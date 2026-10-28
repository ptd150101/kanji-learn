import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const readJSON = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const n3 = readJSON("data_n3.json");
const main = readJSON("data.json");
const index = readJSON("data/n3/source_character_index.json");
const han = readJSON("han_viet.json");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const inlineJSON = name => JSON.parse(html.match(new RegExp(`^const ${name} = (.*);$`, "m"))?.[1] || "null");
const unique = rows => new Set(rows.map(v => [v.lesson, v.word, v.reading].join("\u0000")));

test("N3 includes 20 chapters with each textbook heading Kanji represented", () => {
  assert.equal(Object.keys(index.lessons).length, 20);
  assert.equal(Object.keys(n3.lessons).length, 20);
  assert.equal(Object.values(index.lessons).reduce((s, l) => s + l.characters.length, 0), 376);
  assert.equal(n3.vocab.length, n3.total_vocab);
  for (let lesson = 1; lesson <= 20; lesson++) {
    const words = n3.vocab.filter(v => v.lesson === lesson);
    assert.ok(words.length >= 8, `No vocabulary in chapter ${lesson}`);
    for (const entry of index.lessons[lesson].characters) {
      assert.ok(words.some(v => v.word.includes(entry.kanji)),
        `Missing vocabulary for chapter ${lesson}: ${entry.kanji}`);
    }
  }
});

test("Japanese readings, Vietnamese meanings, provenance and Hán Việt are filled", () => {
  const validOrigins = new Set(["expanded-common-n3", "review-existing-n4-n5", "textbook-reading"]);
  for (const v of n3.vocab) {
    assert.equal(v.level, "N3");
    assert.ok(v.word && v.reading && v.meaning && (validOrigins.has(v.origin) || v.source_type === "curated"));
    assert.match(v.reading, /^[\u3040-\u30ffー・\s]+$/u, `Bad reading for ${v.word}`);
    for (const c of v.word) {
      if (/[\u3400-\u9fff]/u.test(c)) assert.ok(han[c], `Missing Hán Việt: ${c} in ${v.word}`);
    }
  }
  assert.equal(unique(n3.vocab).size, n3.vocab.length, "Duplicated N3 word+reading in one lesson");
});

test("N3 stays synchronized with main JSON, embedded site data and selectable UI", () => {
  const mainN3 = main.vocab.filter(v => v.level === "N3");
  assert.equal(mainN3.length, n3.vocab.length);
  assert.deepEqual(unique(mainN3), unique(n3.vocab));
  assert.deepEqual(Object.keys(main.lesson_names.N3), Object.keys(n3.lessons));
  assert.equal(main.counts.N3, n3.vocab.length);
  assert.equal(main.counts.total, main.vocab.length);
  assert.equal(inlineJSON("VOCAB").length, main.vocab.length);
  assert.deepEqual(inlineJSON("LESSON_NAMES"), main.lesson_names);
  assert.deepEqual(inlineJSON("HAN_VIET"), han);
  assert.match(html, /data-level="N3" type="button"/);
  assert.doesNotMatch(html, /data-level="N3" type="button" disabled/);
});

test("bài 1 giữ nguyên âm Kun từ sách, gồm 干る và các từ thường bị bỏ sót", () => {
  const expected = [
    ["寝かす", "ねかす", 8],
    ["浴びせる", "あびせる", 8],
    ["洗う", "あらう", 9],
    ["干す", "ほす", 9],
    ["干る", "ひる", 9],
    ["燃す", "もす", 10],
    ["末", "すえ", 11],
    ["定まる", "さだまる", 12],
    ["定める", "さだめる", 12],
    ["用いる", "もちいる", 12],
  ];
  for (const [word, reading, page] of expected) {
    const entry = n3.vocab.find(v => v.lesson === 1 && v.word === word && v.reading === reading);
    assert.ok(entry, `Missing textbook reading: ${word}（${reading}）`);
    assert.equal(entry.source_page, page);
  }
  const hi = n3.vocab.find(v => v.lesson === 1 && v.word === "干る");
  assert.equal(hi.origin, "textbook-reading");
  assert.equal(hi.verb_type, "intransitive");
  assert.match(hi.meaning, /ít dùng/);
  assert.ok(n3.vocab.some(v => v.lesson === 1 && v.word === "乾く" && v.reading === "かわく"));
  assert.ok(n3.vocab.some(v => v.lesson === 1 && v.word === "乾かす" && v.reading === "かわかす"));
});

test("mọi cặp động từ N3 đều có đủ hai từ, đúng loại và được hiển thị trong quiz", () => {
  const index = readJSON("data/n3/verb_pairs.json");
  assert.equal(index.total_pairs, index.pairs.length);
  assert.ok(index.pairs.length >= 40);
  for (const pair of index.pairs) {
    const a = n3.vocab.find(v => v.lesson === pair.lesson && v.word === pair.auto.word && v.reading === pair.auto.reading);
    const b = n3.vocab.find(v => v.lesson === pair.lesson && v.word === pair.transitive.word && v.reading === pair.transitive.reading);
    assert.ok(a, `Missing intransitive ${pair.lesson}: ${pair.auto.word}`);
    assert.ok(b, `Missing transitive ${pair.lesson}: ${pair.transitive.word}`);
    assert.equal(a.verb_type, "intransitive");
    assert.equal(b.verb_type, "transitive");
    assert.deepEqual(a.paired_with, {word:b.word,reading:b.reading});
    assert.deepEqual(b.paired_with, {word:a.word,reading:a.reading});
  }
  assert.match(html, /function verbPairFeedback\(item\)/);
  assert.match(html, /const pairHtml = verbPairFeedback\(item\)/);
});
