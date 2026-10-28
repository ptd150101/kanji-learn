# Kanji N5 / N4 / N3 Quiz

## Từ vựng N3 — Mimi kara Oboeru N3 (新試験対応)

- Đã tích hợp **880 mục từ chính** theo số thứ tự **1–880** và **12 Unit** của sách do người dùng tải lên (PDF **236 trang**).
- Chọn **N3 → Từ mới** để ôn Mimi kara; chọn **N3 → Kanji** để ôn 20 chương Kanji Master. N4 → Từ mới vẫn sử dụng dữ liệu cũ.
- Các Unit gồm: (01) Danh từ A, (02) Động từ A, (03) Tính từ A, (04) Danh từ B, (05) Động từ B, (06) Katakana A, (07) Tính từ B, (08) Phó từ A, (09) Danh từ C, (10) Động từ C, (11) Katakana B, (12) Phó từ B / liên thể từ / liên từ.
- Không bỏ sót phần **221–258**, **299–310**, **836–845**: đây là các mục tổng hợp nằm giữa các Unit, được ghép vào Unit đứng trước để vẫn chọn ôn được.
- Dữ liệu: `vocab_n3_mimikara.json` chứa `id`, `number`, `lesson`, `word`, `reading`, `meaning`, `han_viet`, `part` và một số dạng từ thay thế; dữ liệu nhúng trong `index.html` qua `MIMI_VOCAB_N3`.
- Giữ nguyên 4 kiểu luyện tập, đọc âm, lưu từ sai, lựa chọn số câu và ôn theo Unit.
- Sửa một số lỗi dữ liệu tham chiếu: mục **#446 盗む（ぬすむ）**, **#503 悩む（なやむ）**, **#240 行き（いき／ゆき）**. Các từ viết kana thông dụng như `けが`, `かび`, `おしゃべり` giữ thêm dạng Kanji thay thế.
- **Phạm vi xác minh:** Đã so thứ tự, nhãn Unit, nhiều từ đầu/cuối phần với các trang ảnh PDF và đối chiếu thêm nguồn dữ liệu cộng đồng. Chưa tự nhận là đã kiểm chứng mọi câu ví dụ/cụm đi kèm trên tất cả 236 trang. Vì đây là bản scan, những từ/cách đọc khó cần tiếp tục rà soát thủ công trước khi merge `main`.

## N3 — 漢字マスター N3

- N3: 20 chương theo thứ tự sách, 376 chữ Kanji tiêu đề chính, **1.150 mục từ** (danh sách học + mở rộng thường gặp).
- Mỗi mục có chữ Nhật, cách đọc hiragana, nghĩa tiếng Việt, cấp độ N3 và nguồn phân loại `origin`. Khi trả lời, ứng dụng hiển thị âm Hán Việt theo từng chữ Kanji.
- Chỉ số nguồn chữ và trang PDF: `data/n3/source_character_index.json`; từ N3 độc lập: `data_n3.json`; tổng dữ liệu: `data.json`. N3 hiện có thể chọn trong giao diện.
- Có 205 từ ôn tập (`review-existing-n4-n5`), 932 từ mở rộng (`expanded-common-n3`) và 13 mục đọc được bổ sung trực tiếp từ bài 1 của sách (`textbook-reading`).
- **Tình trạng đối chiếu:** đã đối chiếu trực quan chữ Kanji chính theo 20 chương và kiểm tra dữ liệu của 376 chữ. Chưa hoàn tất kiểm tra từng dòng bài tập/câu ví dụ trong toàn bộ PDF; không xem 1.150 từ là bản chép nguyên vẹn tất cả từ của sách.
- Riêng bài 1 đã rà lại các cách đọc Kun ở trang 8–12, đặc biệt **干す（ほす）／干る（ひる）** ở trang 9; **乾く／乾かす** được bổ sung vì thường dùng, không phải cặp cùng mặt chữ 干 trong sách.
- Có danh mục **41 cặp tự động từ / tha động từ** tại `data/n3/verb_pairs.json`; quiz hiển thị từ đối ứng sau khi trả lời.
- Sau khi sửa file dữ liệu, chạy `node scripts/sync-kanji-data.mjs` để đồng bộ dữ liệu nhúng offline trong `index.html`; chạy `node --test tests/*.test.mjs` để kiểm tra.

- N5: 38 bài, 527 mục từ.
- Bài N5 27–34 là 8 bài theme bổ sung từ Nihongo Master, đối chiếu Minna no Nihongo I/II và loại trùng với dữ liệu hiện có.
- Bài N5 35–38 bổ sung 50 mục còn thiếu khi đối chiếu toàn bộ 128 từ trong PDF JLPT N5 2010–2024; coverage sau merge là 128/128 theo từ + cách đọc, mỗi bài mới tối đa 20 mục.
- N4: 37 bài, 638 mục từ.
- Tổng dữ liệu Kanji N5/N4/N3: 2315 mục từ.
- Chuyển N5/N4 ngay ở màn hình thiết lập.
- Trắc nghiệm 4 đáp án + viết furigana.
- Sau khi trả lời hiện nghĩa Việt + Hán Việt từng chữ.
- Khi trả lời sai có thể bấm **☆ Lưu từ này**; từ được giữ trong trình duyệt và có khu vực **Từ đã lưu** để xem, bỏ lưu và kiểm tra lại theo đúng N5/N4/từ mới hiện tại.
- Tự động Edge/Browser TTS bằng trường reading/furigana.
- Tốc độ mặc định 1.00x + nút nghe thử.

Files:
- data.json: N5 + N4 + N3
- data_n5.json: riêng N5
- data_n4.json: riêng N4
- han_viet.json: Hán Việt

- Tên bài của cả N5 và N4 đều hiển thị bằng tiếng Việt để giao diện đồng nhất.

- Chế độ **Tiếng Việt → Kanji**: hiện nghĩa tiếng Việt và yêu cầu chọn từ Kanji đúng trong 4 đáp án; sau khi trả lời mới hiện furigana, nghĩa và Hán Việt rồi tự phát âm.

## Cấu trúc chế độ kiểm tra
Website có 2 chiều lựa chọn độc lập:
- Kiểu câu hỏi: **Kanji / tiếng Nhật** hoặc **Tiếng Việt**.
- Cách trả lời: **Trắc nghiệm 4 đáp án** hoặc **Tự luận**.

Tạo thành 4 tổ hợp:
1. Kanji → chọn furigana.
2. Kanji → tự viết furigana.
3. Tiếng Việt → chọn Kanji / từ tiếng Nhật.
4. Tiếng Việt → tự viết furigana **hoặc** Kanji / từ tiếng Nhật; cả hai đều được chấp nhận.

- Số câu mặc định là **Toàn bộ từ đã chọn**.

- Ở mode **Tự luận**, có nút **Xem đáp án**. Nếu bấm nút này, câu đó sẽ được tính là sai, hiện đáp án đầy đủ và tự phát âm cách đọc đúng.

## Kiểm tra từ mới N4 — bài 26–48 + MR1–MR2
- Tích hợp **705 từ mới**: bài 26–48 và 2 mục ôn tập MR1, MR2.
- Đây là một nội dung kiểm tra riêng, không làm thay đổi quiz Kanji hiện tại.
- Mode **Từ mới N4** dùng đúng cấu trúc 2 × 2 như kiểm tra Kanji:
  - Kiểu câu hỏi: **Tiếng Nhật** hoặc **Tiếng Việt**.
  - Cách trả lời: **Trắc nghiệm 4 đáp án** hoặc **Tự luận**.
- Tạo thành 4 tổ hợp:
  1. Tiếng Nhật → chọn nghĩa tiếng Việt.
  2. Tiếng Nhật → tự nhập nghĩa tiếng Việt.
  3. Tiếng Việt → chọn từ tiếng Nhật.
  4. Tiếng Việt → tự nhập từ tiếng Nhật hoặc furigana; cả hai đều được chấp nhận.
- Có thể chọn riêng từng bài 26–48, MR1, MR2 hoặc chọn nhiều bài; vẫn dùng số câu, thứ tự, TTS, điểm số, ôn câu sai và giao diện responsive hiện tại.
- Dữ liệu nguồn được lưu ở `vocab_n4_26_31.json`.
- Sau khi chỉnh dữ liệu nguồn, chạy `node scripts/sync-new-vocab.mjs` để đồng bộ dữ liệu nhúng trong `index.html`.

## SQLite database + import JSON từ crawler

Database chuẩn hóa nằm ở `data/kanji_vocab.sqlite`. Database được tổng hợp từ `data_n5.json`, `data_n4.json` và `vocab_n4_26_31.json`, chỉ giữ các mục có Kanji và deduplicate theo cặp **word + reading**. Thống kê build hiện tại nằm ở `data/kanji_vocab_stats.json`.

Build lại database:

```bash
python scripts/vocab_db.py
```

Importer nhận trực tiếp JSON crawler dạng `crawled_at`, `page_title`, `question_count`, `questions[]`, `answers[]`, `sentence_text`, `sentence_html`, `underlined_texts[]`, `source_url` như extension đang xuất:

```bash
python scripts/import_crawl.py path/to/crawl.json
```

Có thể chạy thử mà không ghi DB:

```bash
python scripts/import_crawl.py path/to/crawl.json --dry-run --report import-report.json
```

Cơ chế match trước khi import:
1. `underlined_text + một trong 4 đáp án furigana` khớp DB → `existing`, không tạo vocab mới.
2. Chỉ `underlined_text` đã có trong DB → vẫn coi là `existing`, nhưng lưu strategy để có thể review trường hợp đáp án crawl lệch.
3. Nếu phần gạch chân sai, importer tìm vocab nằm trong `sentence_text` và yêu cầu reading của vocab xuất hiện trong 4 đáp án.
4. Có fallback bảo thủ cho biến thể chia động từ: cùng Kanji signature + prefix furigana đủ mạnh.
5. Không đoán đáp án đúng cho từ hoàn toàn mới chỉ từ 4 lựa chọn. Câu chưa xác định được lưu `pending`; câu có nhiều match lưu `ambiguous`.

Nếu crawler sau này đánh dấu chính xác một đáp án bằng `correct_detected` / `correct_answers_detected`, có thể cho phép promote từ mới vào bảng `vocab`:

```bash
python scripts/import_crawl.py path/to/crawl.json --promote-detected
```

Importer là idempotent theo batch + `question_id`: import lại cùng JSON sẽ không tạo duplicate. Toàn bộ raw question/answer vẫn được giữ trong các bảng `crawl_batches`, `crawl_questions`, `crawl_answers` để debug các trường hợp gạch chân sai.
