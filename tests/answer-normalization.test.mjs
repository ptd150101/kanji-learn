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

  assert.equal(templateItems.length, 21);
  for (const item of templateItems) {
    assert.equal(matchesReading(item, item.reading.replace(/[~〜～]/g, "")), true, item.id);
    assert.equal(matchesJapaneseWord(item, item.word.replace(/[~〜～]/g, "")), true, item.id);
  }
});

test("mọi từ bài 32 đều chấp nhận furigana, từ tiếng Nhật và nghĩa đầy đủ", () => {
  const lesson32 = newVocab.filter(item => item.lesson === 32);

  assert.equal(lesson32.length, 44);
  for (const item of lesson32) {
    assert.equal(isWrittenAnswerCorrect(item, item.reading, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, item.word, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, item.meaning, "vocab", "ja"), true, item.id);
  }
});

test("mọi từ bài 36–48, MR1 và MR2 chấp nhận đáp án ở cả hai chiều", () => {
  const addedLessons = new Set([36,37,38,39,40,41,42,43,44,45,46,47,48,"MR1","MR2"]);
  const added = newVocab.filter(item => addedLessons.has(item.lesson));
  assert.equal(added.length, 383);
  for (const item of added) {
    assert.equal(isWrittenAnswerCorrect(item, item.reading, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, item.word, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, item.meaning, "vocab", "ja"), true, item.id);
  }
  const withUsageNotes = added.filter(item => /\[[^\]]*\]/u.test(item.word + item.reading));
  for (const item of withUsageNotes) {
    const baseWord = item.word.replace(/\s*\[[^\]]*\]/g, "");
    const baseReading = item.reading.replace(/\s*\[[^\]]*\]/g, "");
    assert.equal(isWrittenAnswerCorrect(item, baseWord, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, baseReading, "vocab", "vi"), true, item.id);
  }
});

test("mọi từ bài 34 và 35 đều chấp nhận furigana, từ tiếng Nhật và nghĩa đầy đủ", () => {
  const lessons = newVocab.filter(item => item.lesson === 34 || item.lesson === 35);

  assert.equal(lessons.length, 57);
  for (const item of lessons) {
    assert.equal(isWrittenAnswerCorrect(item, item.reading, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, item.word, "vocab", "vi"), true, item.id);
    assert.equal(isWrittenAnswerCorrect(item, item.meaning, "vocab", "ja"), true, item.id);
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
