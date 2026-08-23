import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const start = html.indexOf("function normalizeKana");
const end = html.indexOf("function hanVietForWord");

assert.notEqual(start, -1, "Không tìm thấy normalizeKana trong index.html");
assert.notEqual(end, -1, "Không tìm thấy hanVietForWord trong index.html");

const answerHelpers = new Function(`
  ${html.slice(start, end)}
  return {
    normalizeKana,
    acceptedReadings,
    normalizeJapaneseWord,
    matchesReading,
    matchesJapaneseWord,
    isWrittenAnswerCorrect
  };
`)();

const {
  normalizeKana,
  acceptedReadings,
  normalizeJapaneseWord,
  matchesReading,
  matchesJapaneseWord,
  isWrittenAnswerCorrect
} = answerHelpers;

const newVocabMatch = html.match(/const NEW_VOCAB = (\[[^\n]*\]);/);
assert.ok(newVocabMatch, "Không tìm thấy NEW_VOCAB trong index.html");
const newVocab = JSON.parse(newVocabMatch[1]);

test("bỏ ký hiệu chỗ trống khi so sánh cách đọc", () => {
  const item = { word: "〜中", reading: "〜ちゅう" };

  assert.equal(isWrittenAnswerCorrect(item, "ちゅう", "vocab", "vi"), true);
  assert.equal(matchesReading(item, "ちゅう"), true);
  assert.equal(matchesReading(item, "チュウ"), true);
  assert.equal(matchesReading(item, "～ちゅう"), true);
  assert.equal(matchesReading(item, "ちゅ"), false);
});

test("bỏ ký hiệu chỗ trống khi so sánh từ tiếng Nhật", () => {
  assert.equal(matchesJapaneseWord({ word: "〜中", reading: "〜ちゅう" }, "中"), true);
  assert.equal(matchesJapaneseWord({ word: "あと〜", reading: "あと〜" }, "あと"), true);
  assert.equal(matchesJapaneseWord({ word: "〜ほど", reading: "〜ほど" }, "ほど"), true);
  assert.equal(matchesJapaneseWord({ word: "〜しか〜ない", reading: "〜しか〜ない" }, "しかない"), true);
});

test("mọi mẫu từ vựng chứa 〜 đều chấp nhận câu trả lời không có ký hiệu mẫu", () => {
  const templateItems = newVocab.filter(item => /[~〜～]/u.test(item.word + item.reading));

  assert.equal(templateItems.length, 8);
  for (const item of templateItems) {
    assert.equal(matchesReading(item, item.reading.replace(/[~〜～]/g, "")), true, item.id);
    assert.equal(matchesJapaneseWord(item, item.word.replace(/[~〜～]/g, "")), true, item.id);
  }
});

test("giữ nguyên các ký hiệu phát âm thật và mọi cách đọc được chấp nhận", () => {
  assert.equal(normalizeKana("ボール"), "ぼーる");
  assert.equal(normalizeJapaneseWord("ボール"), "ボール");
  assert.deepEqual(
    acceptedReadings({ reading: "よん", accepted: ["し"] }),
    ["よん", "し"]
  );
});
