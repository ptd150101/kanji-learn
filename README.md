# Kanji N5 / N4 Quiz

- N5: 34 bài, 477 mục từ.
- Bài N5 27–34 là 8 bài theme bổ sung từ Nihongo Master, đối chiếu Minna no Nihongo I/II và loại trùng với dữ liệu hiện có.
- N4: 37 bài, 638 mục từ.
- Tổng: 815 mục từ.
- Chuyển N5/N4 ngay ở màn hình thiết lập.
- Trắc nghiệm 4 đáp án + viết furigana.
- Sau khi trả lời hiện nghĩa Việt + Hán Việt từng chữ.
- Tự động Edge/Browser TTS bằng trường reading/furigana.
- Tốc độ mặc định 1.00x + nút nghe thử.

Files:
- data.json: N5 + N4
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
