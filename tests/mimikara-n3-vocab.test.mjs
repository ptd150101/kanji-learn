import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const get = path => JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));
const mimi = get("vocab_n3_mimikara.json");
const n3Kanji = get("data_n3.json");
const n4 = get("vocab_n4_26_31.json");
const han = get("han_viet.json");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const inline = name => JSON.parse(html.match(new RegExp("^const " + name + " = (.*);$", "m"))?.[1] || "null");
const expected = [120,138,52,100,100,40,40,45,80,80,50,35];

test("880 numbered Mimi Kara N3 entries and 12 complete units", () => {
  assert.equal(mimi.total_vocab, 880);
  assert.equal(mimi.vocab.length, 880);
  assert.equal(Object.keys(mimi.units).length, 12);
  assert.deepEqual(mimi.vocab.map(x => x.number), Array.from({length:880},(_,i)=>i+1));
  assert.equal(new Set(mimi.vocab.map(x=>x.id)).size,880);
  for(let unit=1;unit<=12;unit++){
    assert.equal(mimi.vocab.filter(v=>v.lesson===unit).length,expected[unit-1], "Wrong Unit " + unit);
  }
  assert.equal(mimi.vocab.filter(v=>v.part==="supplement").length,60);
});

test("Readings, Vietnamese meanings and Hán Việt are available", () => {
  for(const term of mimi.vocab){
    assert.equal(term.level,"N3");
    assert.match(term.reading,/^[\u3040-\u30ffー・\s]+$/u,"Invalid kana #" + term.number);
    assert.ok(term.meaning && term.meaning.trim(), "Missing Vietnamese meaning #" + term.number);
    assert.ok(term.word && term.word.trim(),"Missing word #" + term.number);
    for(const kanji of term.word){
      if (/[\u3400-\u9fff]/u.test(kanji)) {
        assert.ok(term.han_viet || han[kanji],"Missing Hán Việt #" + term.number);
      }
    }
  }
  assert.equal(mimi.vocab[120].word, "渇く");
  assert.equal(mimi.vocab[136].word, "乾く");
  assert.equal(mimi.vocab[137].word, "乾かす");
  assert.equal(mimi.vocab[445].reading,"ぬすむ");
  assert.equal(mimi.vocab[502].reading,"なやむ");
  assert.deepEqual(mimi.vocab[239].accepted,["いき","ゆき"]);
});

test("N3 new vocabulary stays separate from N3 Kanji and N4 new vocabulary", () => {
  assert.ok(n3Kanji.vocab.length >= 1592);
  assert.ok((Array.isArray(n4) ? n4 : n4.vocab).length > 700);
  assert.deepEqual(inline("MIMI_VOCAB_N3"),mimi.vocab);
  assert.deepEqual(inline("MIMI_UNIT_NAMES"),mimi.units);
  assert.match(html, /function vocabDatasetForLevel\(level = selectedLevel\)/);
  assert.match(html, /level === "N3" \? MIMI_VOCAB_N3/);
  assert.match(html, /selectedLevel === "N4" \|\| selectedLevel === "N3"/);
  assert.match(html, /pool = vocabDatasetForLevel\(level\)\.filter/);
  assert.match(html, /return vocabDatasetForLevel\(item\.level\)\.filter/);
  assert.match(html, /N3 · Mimi kara · Bài/);
  assert.match(html, /item\.accepted_words \|\| \[\]/);
});

test("N3 vocabulary UI uses Bài 1–12 consistently", () => {
  assert.match(html, /\`Bài \${lesson} · \${MIMI_UNIT_NAMES\[lesson\]}\`/);
  assert.match(html, /gồm 12 bài và các mục tổng hợp/);
  assert.match(html, /N3 Từ mới: \${rows\.length} từ • 12 bài/);
  assert.match(html, /N3 · Mimi kara · Bài \${item\.lesson}/);
  assert.match(html, /"Bài " \+ item\.lesson/);
  assert.doesNotMatch(html, /Mimi kara · Unit/);
  assert.doesNotMatch(html, /\`Unit \${String\(lesson\)/);
});

test("Switching Kanji and N3 Từ mới keeps header and lesson picker dimensions stable", () => {
  const css = html.slice(html.indexOf("<style>"), html.indexOf("</style>"));
  assert.match(css, /\.setup\{[^}]*overflow-anchor:none/);
  assert.match(css, /\.subtitle\{[^}]*min-height:2\.8em/);
  assert.match(css, /\.subtitle\{[^}]*-webkit-line-clamp:2/);
  assert.match(css, /\.lessons\{[^}]*height:clamp\(180px,38svh,300px\)/);
  assert.match(css, /\.lessons\{[^}]*overflow-anchor:none/);
  assert.match(css, /\.lessons\{grid-template-columns:[^}]*height:280px/);
  assert.match(css, /\.lessons\{grid-template-columns:[^}]*height:260px/);
  assert.doesNotMatch(css, /\.lessons\{[^}]*max-height:/);
  assert.match(html, /root\.scrollTop = 0;/);
});
