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
  const validOrigins = new Set(["expanded-common-n3", "review-existing-n4-n5"]);
  for (const v of n3.vocab) {
    assert.equal(v.level, "N3");
    assert.ok(v.word && v.reading && v.meaning && validOrigins.has(v.origin));
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
