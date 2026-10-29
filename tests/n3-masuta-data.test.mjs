import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const readJson = file => JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
const n3 = readJson("../data_n3.json");
const combined = readJson("../data.json");
const hanViet = readJson("../han_viet.json");
const coverage = readJson("../data/source_coverage_n3.json");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function inlineJson(name) {
  const prefix = "const " + name + " = ";
  const line = html.split("\n").find(value => value.startsWith(prefix));
  assert.ok(line?.endsWith(";"), "Missing embedded " + name);
  return JSON.parse(line.slice(prefix.length, -1));
}

test("Kanji Masuta N3 retains 20 book chapters and complete usable lesson data", () => {
  assert.equal(Object.keys(n3.lessons).length, 20);
  assert.equal(n3.total_vocab, n3.vocab.length);
  assert.ok(n3.vocab.length >= 1000, "Unexpected drop in N3 word coverage");
  const seen = new Set();
  for (const item of n3.vocab) {
    assert.equal(item.level, "N3");
    assert.ok(Number.isInteger(item.lesson) && item.lesson >= 1 && item.lesson <= 20);
    assert.ok(item.word.trim() && item.reading.trim() && item.meaning.trim());
    assert.match(item.reading, /^[\u3040-\u309F\u30A0-\u30FFー・]+$/u);
    assert.ok(Number.isInteger(item.source_page), "Missing source page: " + item.word);
    assert.equal(item.source_type, "curated");
    const key = item.lesson + ":" + item.word + ":" + item.reading;
    assert.ok(!seen.has(key), "Duplicate item in one lesson: " + key);
    seen.add(key);
  }
  for (let lesson = 1; lesson <= 20; lesson++) {
    assert.ok(n3.lessons[lesson], "Missing chapter " + lesson);
    assert.ok(n3.vocab.some(item => item.lesson === lesson), "Empty chapter " + lesson);
  }
});

test("All 376 featured N3 Kanji have vocabulary in their original chapter", () => {
  let featured = 0;
  for (const [lesson, pages] of Object.entries(coverage.lesson_pages)) {
    const candidates = n3.vocab.filter(v => v.lesson === Number(lesson));
    for (const page of pages) {
      assert.ok(Number.isInteger(page.page) && page.kanji.length >= 2);
      for (const char of page.kanji) {
        featured++;
        assert.ok(candidates.some(v => v.word.includes(char)),
          `Missing featured Kanji ${char} in chapter ${lesson} (p. ${page.page})`);
        assert.ok(hanViet[char], "Missing Sino-Vietnamese reading for " + char);
      }
    }
  }
  assert.equal(featured, coverage.total_featured_kanji);
  assert.equal(featured, 376);
});

test("N3 is included in combined dataset and matches self-contained quiz HTML", () => {
  const combinedN3 = combined.vocab.filter(item => item.level === "N3");
  const embeddedN3 = inlineJson("VOCAB").filter(item => item.level === "N3");
  const embeddedLessons = inlineJson("LESSON_NAMES");
  const embeddedHanViet = inlineJson("HAN_VIET");
  assert.equal(combined.counts.N3, n3.total_vocab);
  assert.equal(combined.counts.total, combined.vocab.length);
  const core = ({lesson, word, reading, meaning, level}) => ({lesson, word, reading, meaning, level});
  assert.deepEqual(combinedN3.map(core), n3.vocab.map(core));
  assert.deepEqual(embeddedN3, combinedN3);
  assert.deepEqual(embeddedLessons.N3, n3.lessons);
  assert.deepEqual(embeddedHanViet, hanViet);
  assert.match(html, /data-level="N3" type="button">N3<\/button>/);
  assert.doesNotMatch(html, /data-level="N3"[^>]+disabled/u);
});

test("N3 verb-pair examples only use the Kanji taught in their chapter", () => {
  const pairData = readJson("../data/n3/verb_pairs.json");
  const kanjiIn = word => [...word].filter(char => /\p{Script=Han}/u.test(char));
  assert.equal(pairData.total_pairs, pairData.pairs.length);
  const linkedEntries = n3.vocab.filter(entry => entry.paired_with);
  assert.equal(linkedEntries.length, pairData.pairs.length * 2);

  for (const pair of pairData.pairs) {
    const featuredKanji = new Set(
      coverage.lesson_pages[pair.lesson].flatMap(page => page.kanji)
    );
    for (const [verb, counterpart, verbType] of [
      [pair.auto, pair.transitive, "intransitive"],
      [pair.transitive, pair.auto, "transitive"]
    ]) {
      const characters = kanjiIn(verb.word);
      assert.ok(characters.length > 0, `Missing Kanji in pair ${verb.word}`);
      for (const char of characters) {
        assert.ok(featuredKanji.has(char),
          `Unfamiliar Kanji ${char} in chapter ${pair.lesson} pair ${verb.word}`);
      }
      const entry = n3.vocab.find(item =>
        item.lesson === pair.lesson &&
        item.word === verb.word &&
        item.reading === verb.reading
      );
      assert.ok(entry, `Missing verb-pair vocabulary: ${verb.word}`);
      assert.equal(entry.verb_type, verbType);
      assert.deepEqual(entry.paired_with, {
        word: counterpart.word,
        reading: counterpart.reading
      });
    }
  }

  for (const removed of pairData.removed_out_of_book_pairs) {
    for (const word of [removed.auto, removed.transitive]) {
      assert.ok(!n3.vocab.some(entry =>
        entry.lesson === removed.lesson &&
        entry.word === word &&
        entry.paired_with
      ), `Out-of-chapter Kanji pair was restored: ${word}`);
    }
  }
});
