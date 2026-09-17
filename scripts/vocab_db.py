from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
import unicodedata
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Sequence

KANJI_RE = re.compile(r"[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]")
SPACE_RE = re.compile(r"[\s\u3000]+")
CONTEXT_RE = re.compile(r"\s*[\[［【][^\]］】]*[\]］】]\s*$")
LEVEL_RE = re.compile(r"\b(N[1-5])\b", re.I)
MARKDOWN_LINK_RE = re.compile(r"^\[(https?://[^\]]+)\]\((https?://[^)]+)\)$")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def normalize_text(value: Any) -> str:
    return SPACE_RE.sub(" ", unicodedata.normalize("NFKC", "" if value is None else str(value))).strip()


def strip_context(value: Any) -> str:
    text = normalize_text(value)
    old = None
    while text != old:
        old = text
        text = CONTEXT_RE.sub("", text).strip()
    return text


def katakana_to_hiragana(text: str) -> str:
    out = []
    for ch in text:
        cp = ord(ch)
        out.append(chr(cp - 0x60) if 0x30A1 <= cp <= 0x30F6 else ch)
    return "".join(out)


def normalize_word(value: Any) -> str:
    return strip_context(value)


def normalize_reading(value: Any) -> str:
    return katakana_to_hiragana(strip_context(value)).replace(" ", "")


def contains_kanji(value: Any) -> bool:
    return bool(KANJI_RE.search(normalize_text(value)))


def kanji_signature(value: Any) -> str:
    return "".join(KANJI_RE.findall(normalize_text(value)))


def infer_level(title: str | None) -> str | None:
    m = LEVEL_RE.search(title or "")
    return m.group(1).upper() if m else None


def normalize_source_url(value: Any) -> str:
    text = normalize_text(value).replace(r"\&", "&")
    m = MARKDOWN_LINK_RE.match(text)
    return (m.group(2) if m else text).replace(r"\&", "&")


def load_json_tolerant(path: str | Path) -> tuple[dict[str, Any], str]:
    raw = Path(path).read_text(encoding="utf-8-sig")
    try:
        obj = json.loads(raw)
    except json.JSONDecodeError:
        # Chat/Markdown can turn valid JSON keys/tags into illegal JSON escapes.
        raw = raw.replace(r"\_", "_").replace(r"\<", "<").replace(r"\>", ">").replace(r"\&", "&")
        obj = json.loads(raw)
    if not isinstance(obj, dict) or not isinstance(obj.get("questions"), list):
        raise ValueError("Crawler export must be an object containing a 'questions' array")
    return obj, raw


SCHEMA_SQL = """
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS vocab(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  reading TEXT NOT NULL,
  normalized_word TEXT NOT NULL,
  normalized_reading TEXT NOT NULL,
  meaning_vi TEXT,
  level TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(normalized_word, normalized_reading)
);
CREATE INDEX IF NOT EXISTS idx_vocab_word ON vocab(normalized_word);
CREATE INDEX IF NOT EXISTS idx_vocab_reading ON vocab(normalized_reading);
CREATE TABLE IF NOT EXISTS vocab_reading_aliases(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vocab_id INTEGER NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,
  reading TEXT NOT NULL,
  normalized_reading TEXT NOT NULL,
  UNIQUE(vocab_id, normalized_reading)
);
CREATE INDEX IF NOT EXISTS idx_vocab_alias_reading ON vocab_reading_aliases(normalized_reading);
CREATE TABLE IF NOT EXISTS vocab_sources(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vocab_id INTEGER NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,
  source_file TEXT NOT NULL,
  lesson TEXT,
  source_word TEXT NOT NULL,
  source_reading TEXT NOT NULL,
  UNIQUE(vocab_id, source_file, lesson, source_word, source_reading)
);
CREATE TABLE IF NOT EXISTS crawl_batches(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_key TEXT NOT NULL UNIQUE,
  crawled_at TEXT,
  page_title TEXT,
  source_url TEXT,
  question_count INTEGER,
  imported_at TEXT NOT NULL,
  raw_json TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS crawl_questions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER NOT NULL REFERENCES crawl_batches(id) ON DELETE CASCADE,
  source_question_id TEXT NOT NULL,
  dom_id TEXT,
  question_number TEXT,
  index_on_page INTEGER,
  sentence_text TEXT,
  sentence_html TEXT,
  underlined_text TEXT,
  normalized_underlined TEXT,
  status TEXT NOT NULL,
  matched_vocab_id INTEGER REFERENCES vocab(id) ON DELETE SET NULL,
  match_strategy TEXT,
  confidence REAL,
  correct_reading TEXT,
  raw_json TEXT NOT NULL,
  UNIQUE(batch_id, source_question_id)
);
CREATE INDEX IF NOT EXISTS idx_crawl_question_status ON crawl_questions(status);
CREATE INDEX IF NOT EXISTS idx_crawl_question_underlined ON crawl_questions(normalized_underlined);
CREATE TABLE IF NOT EXISTS crawl_answers(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crawl_question_id INTEGER NOT NULL REFERENCES crawl_questions(id) ON DELETE CASCADE,
  answer_index INTEGER,
  text TEXT NOT NULL,
  normalized_text TEXT NOT NULL,
  value TEXT,
  correct_detected INTEGER NOT NULL DEFAULT 0,
  selected INTEGER NOT NULL DEFAULT 0,
  checked INTEGER NOT NULL DEFAULT 0,
  raw_json TEXT NOT NULL,
  UNIQUE(crawl_question_id, answer_index, normalized_text)
);
"""


@dataclass(frozen=True)
class VocabRecord:
    word: str
    reading: str
    meaning_vi: str | None
    level: str | None
    lesson: str | None
    source_file: str
    accepted: tuple[str, ...] = ()


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA_SQL)


def iter_source_vocab(root: str | Path) -> Iterable[VocabRecord]:
    root = Path(root)
    for filename in ("data_n5.json", "data_n4.json"):
        path = root / filename
        if not path.exists():
            continue
        payload = json.loads(path.read_text(encoding="utf-8-sig"))
        for row in payload.get("vocab", []):
            word, reading = normalize_word(row.get("word")), normalize_reading(row.get("reading"))
            if not word or not reading or not contains_kanji(word):
                continue
            accepted = tuple(r for r in map(normalize_reading, row.get("accepted", []) or []) if r and r != reading)
            yield VocabRecord(word, reading, normalize_text(row.get("meaning")) or None,
                              normalize_text(row.get("level")) or None,
                              normalize_text(row.get("lesson")) or None, filename, accepted)

    path = root / "vocab_n4_26_31.json"
    if path.exists():
        for row in json.loads(path.read_text(encoding="utf-8-sig")):
            word, reading = normalize_word(row.get("ja")), normalize_reading(row.get("furigana"))
            if word and reading and contains_kanji(word):
                yield VocabRecord(word, reading, normalize_text(row.get("vi")) or None, "N4",
                                  normalize_text(row.get("lesson")) or None, path.name)


def upsert_vocab_record(conn: sqlite3.Connection, row: VocabRecord) -> int:
    nw, nr = normalize_word(row.word), normalize_reading(row.reading)
    found = conn.execute("SELECT id, meaning_vi, level FROM vocab WHERE normalized_word=? AND normalized_reading=?", (nw, nr)).fetchone()
    if found:
        vocab_id = int(found[0])
        if not found[1] and row.meaning_vi:
            conn.execute("UPDATE vocab SET meaning_vi=? WHERE id=?", (row.meaning_vi, vocab_id))
        if not found[2] and row.level:
            conn.execute("UPDATE vocab SET level=? WHERE id=?", (row.level, vocab_id))
    else:
        cur = conn.execute("INSERT INTO vocab(word,reading,normalized_word,normalized_reading,meaning_vi,level,created_at) VALUES(?,?,?,?,?,?,?)",
                           (row.word, row.reading, nw, nr, row.meaning_vi, row.level, now_iso()))
        vocab_id = int(cur.lastrowid)

    conn.execute("INSERT OR IGNORE INTO vocab_sources(vocab_id,source_file,lesson,source_word,source_reading) VALUES(?,?,?,?,?)",
                 (vocab_id, row.source_file, row.lesson, row.word, row.reading))
    for alias in row.accepted:
        na = normalize_reading(alias)
        if na and na != nr:
            conn.execute("INSERT OR IGNORE INTO vocab_reading_aliases(vocab_id,reading,normalized_reading) VALUES(?,?,?)", (vocab_id, alias, na))
    return vocab_id


def rebuild_database(root: str | Path, output: str | Path, stats_output: str | Path | None = None) -> dict[str, Any]:
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        output.unlink()
    conn = sqlite3.connect(output)
    try:
        init_db(conn)
        source_count = 0
        for row in iter_source_vocab(root):
            upsert_vocab_record(conn, row)
            source_count += 1
        conn.execute("INSERT OR REPLACE INTO meta(key,value) VALUES('schema_version','1')")
        conn.execute("INSERT OR REPLACE INTO meta(key,value) VALUES('built_at',?)", (now_iso(),))
        conn.commit()
        stats = {
            "schema_version": 1,
            "source_records_with_kanji": source_count,
            "unique_vocab": conn.execute("SELECT COUNT(*) FROM vocab").fetchone()[0],
            "source_links": conn.execute("SELECT COUNT(*) FROM vocab_sources").fetchone()[0],
            "reading_aliases": conn.execute("SELECT COUNT(*) FROM vocab_reading_aliases").fetchone()[0],
            "by_level": {k or "unknown": v for k, v in conn.execute("SELECT level,COUNT(*) FROM vocab GROUP BY level ORDER BY level")},
        }
    finally:
        conn.close()
    if stats_output:
        p = Path(stats_output); p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(stats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return stats


def load_vocab_cache(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    alias_map: dict[int, set[str]] = {}
    for vid, reading in conn.execute("SELECT vocab_id,normalized_reading FROM vocab_reading_aliases"):
        alias_map.setdefault(int(vid), set()).add(reading)
    cache = []
    for row in conn.execute("SELECT id,word,reading,normalized_word,normalized_reading,meaning_vi,level FROM vocab"):
        vid = int(row[0])
        cache.append({
            "id": vid, "word": row[1], "reading": row[2], "normalized_word": row[3],
            "normalized_reading": row[4], "meaning_vi": row[5], "level": row[6],
            "kanji_signature": kanji_signature(row[1]), "readings": {row[4], *alias_map.get(vid, set())},
        })
    return cache


def _unique(items: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    out: dict[int, dict[str, Any]] = {}
    for item in items:
        out[item["id"]] = item
    return list(out.values())


def _prefix_len(a: str, b: str) -> int:
    n = 0
    for x, y in zip(a, b):
        if x != y: break
        n += 1
    return n


def match_question(question: dict[str, Any], cache: Sequence[dict[str, Any]]) -> dict[str, Any]:
    underlined = [normalize_word(x) for x in (question.get("underlined_texts") or []) if normalize_word(x)]
    if not underlined:
        html = normalize_text(question.get("sentence_html"))
        underlined = [normalize_word(x) for x in re.findall(r"<u[^>]*>(.*?)</u>", html, re.I | re.S) if normalize_word(x)]
    answers = {normalize_reading(a.get("text")) for a in (question.get("answers") or []) if isinstance(a, dict) and normalize_reading(a.get("text"))}

    exact = _unique(v for v in cache if v["normalized_word"] in underlined and v["readings"] & answers)
    if len(exact) == 1: return {"status":"existing","matched_vocab":exact[0],"strategy":"exact_word_and_reading","confidence":1.0}
    if len(exact) > 1: return {"status":"ambiguous","matched_vocab":None,"strategy":"exact_word_and_reading_multiple","confidence":0.6}

    exact_word = _unique(v for v in cache if v["normalized_word"] in underlined)
    if len(exact_word) == 1: return {"status":"existing","matched_vocab":exact_word[0],"strategy":"exact_word_only","confidence":0.86}
    if len(exact_word) > 1: return {"status":"ambiguous","matched_vocab":None,"strategy":"exact_word_multiple_readings","confidence":0.55}

    sentence = normalize_word(question.get("sentence_text"))
    sentence_matches = _unique(v for v in cache if v["normalized_word"] and v["normalized_word"] in sentence and v["readings"] & answers)
    if len(sentence_matches) == 1: return {"status":"existing","matched_vocab":sentence_matches[0],"strategy":"sentence_word_and_reading","confidence":0.96}
    if len(sentence_matches) > 1: return {"status":"ambiguous","matched_vocab":None,"strategy":"sentence_word_and_reading_multiple","confidence":0.5}

    # Conservative inflection fallback: same Kanji characters + >=2 kana shared prefix.
    surface = []
    for u in underlined:
        sig = kanji_signature(u)
        if not sig: continue
        for v in cache:
            if v["kanji_signature"] != sig: continue
            if any(_prefix_len(r, a) >= 2 for r in v["readings"] for a in answers):
                surface.append(v)
    surface = _unique(surface)
    if len(surface) == 1: return {"status":"existing","matched_vocab":surface[0],"strategy":"kanji_signature_and_reading_prefix","confidence":0.78}
    if len(surface) > 1: return {"status":"ambiguous","matched_vocab":None,"strategy":"kanji_signature_multiple","confidence":0.4}
    return {"status":"pending","matched_vocab":None,"strategy":"no_confident_match","confidence":0.0}


def detected_correct_reading(question: dict[str, Any]) -> str | None:
    answers = [a for a in (question.get("answers") or []) if isinstance(a, dict)]
    found = {normalize_reading(a.get("text")) for a in answers if a.get("correct_detected") and normalize_reading(a.get("text"))}
    if len(found) == 1: return next(iter(found))
    for x in question.get("correct_answers_detected") or []:
        if isinstance(x, dict) and x.get("text"): found.add(normalize_reading(x["text"]))
        elif isinstance(x, int) and 0 <= x < len(answers): found.add(normalize_reading(answers[x].get("text")))
        elif isinstance(x, str): found.add(normalize_reading(x))
    found.discard("")
    return next(iter(found)) if len(found) == 1 else None


def make_batch_key(payload: dict[str, Any]) -> str:
    identity = "\0".join([normalize_text(payload.get("crawled_at")), normalize_text(payload.get("page_title")), normalize_source_url(payload.get("source_url"))])
    return hashlib.sha256(identity.encode()).hexdigest()


def import_crawl_payload(conn: sqlite3.Connection, payload: dict[str, Any], *, raw_json: str | None = None, promote_detected: bool = False) -> dict[str, Any]:
    init_db(conn)
    cache = load_vocab_cache(conn)
    key = make_batch_key(payload)
    row = conn.execute("SELECT id FROM crawl_batches WHERE batch_key=?", (key,)).fetchone()
    existed = bool(row)
    if row:
        batch_id = int(row[0])
    else:
        raw_json = raw_json or json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        cur = conn.execute("INSERT INTO crawl_batches(batch_key,crawled_at,page_title,source_url,question_count,imported_at,raw_json) VALUES(?,?,?,?,?,?,?)",
                           (key, normalize_text(payload.get("crawled_at")) or None, normalize_text(payload.get("page_title")) or None,
                            normalize_source_url(payload.get("source_url")) or None, int(payload.get("question_count") or len(payload.get("questions") or [])), now_iso(), raw_json))
        batch_id = int(cur.lastrowid)

    counts = {k:0 for k in ("existing","pending","ambiguous","promoted","questions_inserted","questions_already_seen")}
    level = infer_level(normalize_text(payload.get("page_title")))
    for pos, q in enumerate(payload.get("questions") or []):
        if not isinstance(q, dict): continue
        qid = normalize_text(q.get("question_id")) or f"index:{pos}"
        if conn.execute("SELECT 1 FROM crawl_questions WHERE batch_id=? AND source_question_id=?", (batch_id, qid)).fetchone():
            counts["questions_already_seen"] += 1; continue

        result = match_question(q, cache)
        status, matched = result["status"], result["matched_vocab"]
        correct = detected_correct_reading(q)
        underlined_values = [normalize_word(x) for x in (q.get("underlined_texts") or []) if normalize_word(x)]
        underlined = " | ".join(underlined_values)
        if promote_detected and status == "pending" and correct and underlined_values and contains_kanji(underlined_values[0]):
            vid = upsert_vocab_record(conn, VocabRecord(underlined_values[0], correct, None, level, None, f"crawl:{key[:12]}"))
            matched = {"id":vid}; status = "promoted"; result = {**result,"strategy":"detected_correct_answer","confidence":1.0}
            counts["promoted"] += 1; cache = load_vocab_cache(conn)
        elif status in counts:
            counts[status] += 1

        cur = conn.execute("""INSERT INTO crawl_questions(batch_id,source_question_id,dom_id,question_number,index_on_page,sentence_text,sentence_html,underlined_text,normalized_underlined,status,matched_vocab_id,match_strategy,confidence,correct_reading,raw_json)
                              VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                           (batch_id, qid, normalize_text(q.get("dom_id")) or None, normalize_text(q.get("question_number")) or None,
                            int(q.get("index_on_page") if q.get("index_on_page") is not None else pos), normalize_text(q.get("sentence_text")) or None,
                            normalize_text(q.get("sentence_html")) or None, underlined or None, normalize_word(underlined) or None, status,
                            int(matched["id"]) if matched else None, result["strategy"], float(result["confidence"]), correct,
                            json.dumps(q, ensure_ascii=False, separators=(",", ":"))))
        cqid = int(cur.lastrowid); counts["questions_inserted"] += 1
        selected = {x for x in (q.get("selected_answers") or []) if isinstance(x, int)}
        for i, a in enumerate(q.get("answers") or []):
            if not isinstance(a, dict): continue
            text = normalize_text(a.get("text"))
            if not text: continue
            idx = a.get("index") if isinstance(a.get("index"), int) else i
            conn.execute("INSERT OR IGNORE INTO crawl_answers(crawl_question_id,answer_index,text,normalized_text,value,correct_detected,selected,checked,raw_json) VALUES(?,?,?,?,?,?,?,?,?)",
                         (cqid, idx, text, normalize_reading(text), normalize_text(a.get("value")) or None, int(bool(a.get("correct_detected"))), int(idx in selected), int(bool(a.get("checked"))), json.dumps(a, ensure_ascii=False, separators=(",", ":"))))

    return {"batch_id":batch_id,"batch_key":key,"batch_already_existed":existed,"page_title":normalize_text(payload.get("page_title")),"source_url":normalize_source_url(payload.get("source_url")),**counts}


def connect(path: str | Path) -> sqlite3.Connection:
    conn = sqlite3.connect(path); conn.execute("PRAGMA foreign_keys = ON"); return conn


def main() -> None:
    p = argparse.ArgumentParser(description="Build the Kanji Learn SQLite vocabulary database")
    p.add_argument("--root", default="."); p.add_argument("--output", default="data/kanji_vocab.sqlite"); p.add_argument("--stats", default="data/kanji_vocab_stats.json")
    a = p.parse_args(); print(json.dumps(rebuild_database(a.root, a.output, a.stats), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
