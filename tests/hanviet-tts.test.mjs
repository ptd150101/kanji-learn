import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const vocabMatch = html.match(/const NEW_VOCAB = (\[[^\n]*\]);/);
const hvMatch = html.match(/const HAN_VIET = (\{[^\n]*\});/);
assert.ok(vocabMatch, "Không tìm thấy NEW_VOCAB");
assert.ok(hvMatch, "Không tìm thấy HAN_VIET");
const vocab = JSON.parse(vocabMatch[1]);
const hanViet = JSON.parse(hvMatch[1]);

const helperStart = html.indexOf("function cleanJapaneseSpeechText");
const helperEnd = html.indexOf("function speak(text)", helperStart);
assert.notEqual(helperStart, -1, "Không tìm thấy cleanJapaneseSpeechText");
assert.notEqual(helperEnd, -1, "Không tìm thấy function speak");
const helpers = new Function(`${html.slice(helperStart, helperEnd)}\nreturn { cleanJapaneseSpeechText, ttsTextForItem };`)();

test("mọi Kanji trong bộ từ mới đều có Hán-Việt", () => {
  const missing = new Set();
  for (const item of vocab) {
    for (const ch of (item.word.match(/\p{Script=Han}/gu) || [])) {
      if (!hanViet[ch]) missing.add(ch);
    }
  }
  assert.deepEqual([...missing], []);
});

test("TTS bỏ ghi chú ngữ cảnh và ký hiệu mẫu", () => {
  assert.equal(helpers.cleanJapaneseSpeechText("つとめます [かいしゃに〜]"), "つとめます");
  assert.equal(helpers.cleanJapaneseSpeechText("〜ちゅう"), "ちゅう");
  assert.equal(helpers.cleanJapaneseSpeechText("いれます [コーヒーを〜]"), "いれます");
});

test("TTS giữ nguyên âm ghép và âm ngắt nhỏ", () => {
  assert.equal(helpers.cleanJapaneseSpeechText("きゅう"), "きゅう");
  assert.equal(helpers.cleanJapaneseSpeechText("しゅっせきします"), "しゅっせきします");
  assert.equal(helpers.cleanJapaneseSpeechText("はっぴょう"), "はっぴょう");
  assert.equal(helpers.ttsTextForItem({ reading: "きょういく", word: "教育" }), "きょういく");
});
