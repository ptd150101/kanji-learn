import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { buildEmbeddedVocab } from "../scripts/sync-new-vocab.mjs";

const source = JSON.parse(
  readFileSync(new URL("../vocab_n4_26_31.json", import.meta.url), "utf8")
);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const embeddedMatch = html.match(/const NEW_VOCAB = (\[[^\n]*\]);/);

assert.ok(embeddedMatch, "Không tìm thấy NEW_VOCAB trong index.html");
const embedded = JSON.parse(embeddedMatch[1]);

test("dữ liệu nguồn và dữ liệu nhúng luôn đồng bộ", () => {
  assert.deepEqual(embedded, buildEmbeddedVocab(source));
});

test("bài 32 có đủ 44 từ và ID liên tục", () => {
  const lesson32 = embedded.filter(item => item.lesson === 32);

  assert.equal(embedded.length, 265);
  assert.deepEqual(
    [...new Set(embedded.map(item => item.lesson))],
    [26, 27, 28, 29, 30, 31, 32, 33]
  );
  assert.equal(lesson32.length, 44);
  assert.deepEqual(
    lesson32.map(item => item.id),
    Array.from({ length: 44 }, (_, index) => `v32-${index + 1}`)
  );
  assert.deepEqual(
    lesson32[0],
    {
      id: "v32-1",
      lesson: 32,
      word: "運動します",
      reading: "うんどうします",
      meaning: "vận động",
      level: "N4"
    }
  );
  assert.equal(lesson32.at(-1).word, "もしかしたら");
});

test("mọi từ bài 32 có đủ dữ liệu và không trùng ID", () => {
  const ids = new Set();

  for (const item of embedded) {
    assert.equal(typeof item.word, "string");
    assert.equal(typeof item.reading, "string");
    assert.equal(typeof item.meaning, "string");
    assert.ok(item.word.length > 0, item.id);
    assert.ok(item.reading.length > 0, item.id);
    assert.ok(item.meaning.length > 0, item.id);
    assert.equal(ids.has(item.id), false, item.id);
    ids.add(item.id);
  }
});
