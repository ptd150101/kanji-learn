from __future__ import annotations

import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from vocab_db import VocabRecord, import_crawl_payload, init_db, load_json_tolerant, load_vocab_cache, match_question, normalize_reading, normalize_source_url, upsert_vocab_record


def ans(text: str, index: int, correct: bool = False) -> dict:
    return {"index": index, "text": text, "value": str(1000 + index), "correct_detected": correct, "checked": False}


class CrawlImportTests(unittest.TestCase):
    def setUp(self):
        self.conn = sqlite3.connect(":memory:"); init_db(self.conn)
        upsert_vocab_record(self.conn, VocabRecord("名前", "なまえ", "tên", "N5", "7", "test"))
        upsert_vocab_record(self.conn, VocabRecord("青い", "あおい", "xanh", "N5", "8", "test"))
        self.conn.commit()

    def tearDown(self): self.conn.close()

    def test_exact_word_and_four_answers(self):
        q = {"underlined_texts":["名前"],"sentence_text":"弟の名前を書いてください。","answers":[ans("なまえい",0),ans("なぜん",1),ans("なまい",2),ans("なまえ",3)]}
        r = match_question(q, load_vocab_cache(self.conn))
        self.assertEqual((r["status"], r["strategy"]), ("existing", "exact_word_and_reading"))

    def test_wrong_underline_falls_back_to_sentence_and_answers(self):
        q = {"underlined_texts":["弟"],"sentence_text":"弟の名前を書いてください。","answers":[ans("なまえい",0),ans("なぜん",1),ans("なまい",2),ans("なまえ",3)]}
        r = match_question(q, load_vocab_cache(self.conn))
        self.assertEqual((r["status"], r["strategy"]), ("existing", "sentence_word_and_reading"))

    def test_same_batch_is_idempotent(self):
        payload = {"crawled_at":"2026-09-17T16:18:47.750Z","page_title":"Luyện đề cấp độ N4","question_count":1,"source_url":"https://example.test/1995","questions":[{"question_id":"348767","sentence_text":"弟の名前を書いてください。","underlined_texts":["名前"],"answers":[ans("なまえい",0),ans("なぜん",1),ans("なまい",2),ans("なまえ",3)]}]}
        a = import_crawl_payload(self.conn, payload); b = import_crawl_payload(self.conn, payload)
        self.assertEqual(a["questions_inserted"], 1); self.assertEqual(b["questions_already_seen"], 1)

    def test_does_not_guess_new_word_from_four_options(self):
        payload = {"crawled_at":"2026-09-17T16:18:47.751Z","page_title":"Luyện đề cấp độ N4","question_count":1,"source_url":"https://example.test/new","questions":[{"question_id":"x","sentence_text":"暗黒のせかい","underlined_texts":["暗黒"],"answers":[ans("くらいこく",0),ans("あんごく",1),ans("あんこく",2),ans("くらこく",3)]}]}
        r = import_crawl_payload(self.conn, payload, promote_detected=True)
        self.assertEqual((r["pending"], r["promoted"]), (1, 0))

    def test_promotes_only_explicitly_detected_correct_answer(self):
        payload = {"crawled_at":"2026-09-17T16:18:47.752Z","page_title":"Luyện đề cấp độ N4","question_count":1,"source_url":"https://example.test/new2","questions":[{"question_id":"x2","sentence_text":"暗黒のせかい","underlined_texts":["暗黒"],"answers":[ans("くらいこく",0),ans("あんごく",1),ans("あんこく",2,True),ans("くらこく",3)]}]}
        r = import_crawl_payload(self.conn, payload, promote_detected=True)
        self.assertEqual(r["promoted"], 1)
        self.assertEqual(self.conn.execute("SELECT reading FROM vocab WHERE normalized_word='暗黒'").fetchone()[0], "あんこく")

    def test_repairs_chat_markdown_escapes(self):
        raw = r'''{"crawled\_at":"2026-09-17T16:18:47.750Z","page\_title":"Luyện đề cấp độ N4","question\_count":1,"questions":[{"question\_id":"1","sentence\_html":"\<u>名前\</u>","sentence\_text":"名前","underlined\_texts":["名前"],"answers":[{"index":0,"text":"なまえ"}]}],"source\_url":"[https://example.test/a?x=1&y=2](https://example.test/a?x=1\&y=2)"}'''
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "crawl.json"; p.write_text(raw, encoding="utf-8")
            payload, _ = load_json_tolerant(p)
        self.assertEqual(payload["crawled_at"], "2026-09-17T16:18:47.750Z")
        self.assertEqual(normalize_source_url(payload["source_url"]), "https://example.test/a?x=1&y=2")
        self.assertEqual(normalize_reading("レイ"), "れい")


if __name__ == "__main__": unittest.main()
