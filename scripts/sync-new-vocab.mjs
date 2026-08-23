import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../", import.meta.url);
const sourceUrl = new URL("vocab_n4_26_31.json", repoRoot);
const indexUrl = new URL("index.html", repoRoot);

export function buildEmbeddedVocab(sourceRows) {
  if (!Array.isArray(sourceRows)) {
    throw new TypeError("Dữ liệu từ mới phải là một mảng JSON");
  }

  const lessonCounters = new Map();
  const ids = new Set();

  return sourceRows.map((row, index) => {
    const lesson = Number(row.lesson);
    if (!Number.isInteger(lesson)) {
      throw new TypeError(`Mục ${index + 1} có lesson không hợp lệ`);
    }

    for (const field of ["vi", "ja", "furigana"]) {
      if (typeof row[field] !== "string" || !row[field].trim()) {
        throw new TypeError(`Mục ${index + 1} thiếu trường ${field}`);
      }
    }

    const sequence = (lessonCounters.get(lesson) || 0) + 1;
    lessonCounters.set(lesson, sequence);
    const id = `v${lesson}-${sequence}`;
    if (ids.has(id)) throw new Error(`ID trùng: ${id}`);
    ids.add(id);

    return {
      id,
      lesson,
      word: row.ja,
      reading: row.furigana,
      meaning: row.vi,
      level: "N4"
    };
  });
}

export function syncNewVocab() {
  const sourceRows = JSON.parse(readFileSync(sourceUrl, "utf8"));
  const embeddedRows = buildEmbeddedVocab(sourceRows);
  const indexHtml = readFileSync(indexUrl, "utf8");
  const marker = /const NEW_VOCAB = \[[^\n]*\];/g;
  const matches = indexHtml.match(marker) || [];

  if (matches.length !== 1) {
    throw new Error(`Cần đúng 1 khai báo NEW_VOCAB, tìm thấy ${matches.length}`);
  }

  const updatedHtml = indexHtml.replace(
    marker,
    `const NEW_VOCAB = ${JSON.stringify(embeddedRows)};`
  );
  writeFileSync(indexUrl, updatedHtml);
  return embeddedRows;
}

const isMain = process.argv[1]
  && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const rows = syncNewVocab();
  console.log(`Đã đồng bộ ${rows.length} từ mới vào index.html.`);
}
