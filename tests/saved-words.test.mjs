import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("có đầy đủ UI lưu từ và kiểm tra từ đã lưu", () => {
  for (const id of ["saveWordBtn", "savedReviewSection", "savedCountBadge", "reviewSavedBtn", "toggleSavedListBtn", "savedList"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `Thiếu #${id}`);
  }
});

test("từ đã lưu được persist bằng localStorage", () => {
  assert.match(html, /const SAVED_WORDS_KEY = "kanjiLearnSavedWordsV1"/);
  assert.match(html, /localStorage\.getItem\(SAVED_WORDS_KEY\)/);
  assert.match(html, /localStorage\.setItem\(SAVED_WORDS_KEY, JSON\.stringify\(savedWords\)\)/);
});

test("nút lưu chỉ được hiện sau câu sai", () => {
  assert.match(html, /renderSaveWordButton\(!isCorrect, item\)/);
  assert.match(html, /renderSaveWordButton\(false\);\s*\$\("nextBtn"\)/);
});

test("kiểm tra từ đã lưu dùng đúng pool đã lưu", () => {
  assert.match(html, /function reviewSavedWords\(\)/);
  assert.match(html, /const records = savedWordsForCurrentScope\(\)/);
  assert.match(html, /explicitPool: pool/);
  assert.match(html, /forced\?\.explicitPool \? \{explicitPool:\[\.\.\.quiz\]\} : \{\}/);
});

test("có thể bỏ lưu từ trong danh sách", () => {
  assert.match(html, /remove\.textContent = "Bỏ lưu"/);
  assert.match(html, /savedWords = savedWords\.filter\(x => x\.key !== record\.key\)/);
});
