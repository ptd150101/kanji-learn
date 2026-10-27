import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Đồng bộ dữ liệu JSON vào trang offline, tránh dữ liệu N3/N4/N5 lệch với index.html.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const readJSON = path => JSON.parse(readFileSync(join(root, path), "utf8"));
const combined = readJSON("data.json");
const hanViet = readJSON("han_viet.json");
const standaloneN3 = readJSON("data_n3.json");

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
  HAN_VIET: hanViet
})) {
  const pattern = new RegExp(`^const ${name} = .*;$`, "m");
  if (!pattern.test(html)) throw new Error(`Missing inline variable: ${name}`);
  html = html.replace(pattern, `const ${name} = ${JSON.stringify(value)};`);
}
writeFileSync(filename, html, "utf8");
console.log(`Synced ${combined.vocab.length} entries and ${Object.keys(hanViet).length} Sino-Vietnamese readings.`);
