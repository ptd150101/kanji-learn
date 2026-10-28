import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Đồng bộ dữ liệu JSON vào trang offline, tránh dữ liệu N3/N4/N5 lệch với index.html.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const readJSON = path => JSON.parse(readFileSync(join(root, path), "utf8"));
const combined = readJSON("data.json");
const hanViet = readJSON("han_viet.json");
const standaloneN3 = readJSON("data_n3.json");
const mimi = readJSON("vocab_n3_mimikara.json");
if (mimi.total_vocab !== 880 || mimi.vocab.length !== 880) throw new Error("Mimi Kara N3 must contain exactly 880 terms.");
if (!Array.isArray(mimi.sections) || mimi.sections.length !== 21 ||
  mimi.sections.reduce((sum, section) => sum + section.count, 0) !== 880) {
  throw new Error("Mimi Kara N3 must have exactly 21 complete book-defined review ranges.");
}
for (const word of mimi.vocab) {
  const section = mimi.sections.find(s => s.id === word.section && s.start <= word.number && word.number <= s.end);
  if (!section || section.unit !== word.unit) {
    throw new Error("Invalid Mimi Kara N3 review range for word #" + word.number);
  }
}

if (!Array.isArray(combined.vocab) || !combined.lesson_names || !Array.isArray(standaloneN3.vocab)) {
  throw new Error("Invalid vocabulary datasets.");
}

const n3InMain = combined.vocab.filter(entry => entry.level === "N3");
if (n3InMain.length !== standaloneN3.vocab.length) {
  throw new Error("N3 vocabulary mismatch between data.json and data_n3.json.");
}

const n3Keys = new Set(standaloneN3.vocab.map(v => [v.lesson, v.word, v.reading].join("\u0000")));
for (const row of n3InMain) {
  if (!n3Keys.has([row.lesson, row.word, row.reading].join("\u0000"))) {
    throw new Error(`Missing N3 source entry: ${row.word} (${row.reading})`);
  }
}

const filename = join(root, "index.html");
let html = readFileSync(filename, "utf8");
for (const [name, value] of Object.entries({
  VOCAB: combined.vocab,
  LESSON_NAMES: combined.lesson_names,
  HAN_VIET: hanViet,
  MIMI_VOCAB_N3: mimi.vocab,
  MIMI_UNIT_NAMES: mimi.units,
  MIMI_SECTIONS: mimi.sections
})) {
  const pattern = new RegExp(`^const ${name} = .*;$`, "m");
  if (!pattern.test(html)) throw new Error(`Missing inline variable: ${name}`);
  html = html.replace(pattern, `const ${name} = ${JSON.stringify(value)};`);
}
writeFileSync(filename, html, "utf8");
console.log(`Synced ${combined.vocab.length} Kanji entries, ${mimi.vocab.length} Mimi Kara N3 entries and ${Object.keys(hanViet).length} Sino-Vietnamese readings.`);
