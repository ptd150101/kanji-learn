# Kanji N5 / N4 / N3 Quiz

## Từ vựng N3 – Mimi kara Oboeru

- Chọn **N3 → Từ mới** để ôn **880 từ** theo số thứ tự 1–880, chọn độc lập **21 khoảng nhỏ** bên trong 12 bài của *Mimi kara Oboeru N3* (ví dụ: **Bài 1 · 1–71**, **Bài 1 · 72–120**); chọn **N3 → Kanji** để ôn 20 chương Kanji Master.
- Các phần **Tổng hợp · 221–258**, **Tổng hợp · 299–310** và **Tổng hợp · 836–845** có ô chọn riêng, đúng theo mục lục sách. Đối chiếu khoảng số từ tại các trang PDF **5–8**; không nhân đôi 練習問題Ⅱ (đề ôn tổng thể).
- Mỗi từ có cách đọc, nghĩa Việt, Hán Việt (khi có Kanji), số thứ tự, bài gốc và mã khoảng `section`. Mục lục 21 khoảng là `sections` trong `vocab_n3_mimikara.json`.
- Hỗ trợ trắc nghiệm/tự luận, phát âm, lưu từ sai và ôn theo bài. Danh sách bài giữ khoảng cách hàng đồng nhất như các tab khác; dùng chiều cao **tối đa** và chỉ cuộn khi cần, không kéo giãn các hàng theo khung cố định.
- Đã đối chiếu cấu trúc/số thứ tự và kiểm tra các trang mẫu PDF; chưa kiểm chứng thủ công từng câu ví dụ của toàn bộ bản scan.
- `node scripts/sync-kanji-data.mjs` đồng bộ các nguồn JSON vào trang offline.
- `data/source_coverage_mimikara_n3.json` mô tả kiểm tra nguồn.

## Gộp hai bộ dữ liệu Kanji N3

- Giữ lại 1.592 mục từ N3 đã có trên `main`; bổ sung 283 mục khác nhau từ PR #23 thành **1.592 mục từ Kanji N3**.
- Bổ sung metadata tự/tha động từ và `data/n3/verb_pairs.json` (41 cặp); không thay thế bộ dữ liệu gốc trên `main`.
- Đã bổ sung cả 干る（ひる）và các từ dễ thiếu như 乾く（かわく）/乾かす（かわかす）.


- N5: 38 bài, 527 mục từ.
- Bài N5 27–34 là 8 bài theme bổ sung từ Nihongo Master, đối chiếu Minna no Nihongo I/II và loại trùng với dữ liệu hiện có.
- Bài N5 35–38 bổ sung 50 mục còn thiếu khi đối chiếu toàn bộ 128 từ trong PDF JLPT N5 2010–2024; coverage sau merge là 128/128 theo từ + cách đọc, mỗi bài mới tối đa 20 mục.
- N4: 37 bài, 638 mục từ.
- N3: 20 chương theo **漢字マスターN3**, 1.592 mục từ (biên soạn thêm từ ghép thông dụng, theo chủ điểm từng chữ).
- Tổng: 2.757 mục từ (N5 + N4 + N3).
- Chuyển N5/N4/N3 ngay ở màn hình thiết lập.
- Trắc nghiệm 4 đáp án + viết furigana.
- Sau khi trả lời hiện nghĩa Việt + Hán Việt từng chữ.
- Khi trả lời sai có thể bấm **☆ Lưu từ này**; từ được giữ trong trình duyệt và có khu vực **Từ đã lưu** để xem, bỏ lưu và kiểm tra lại theo đúng N5/N4/N3/từ mới hiện tại.
- Tự động Edge/Browser TTS bằng trường reading/furigana.
- Tốc độ mặc định 1.00x + nút nghe thử.

Files:
- data.json: N5 + N4 + N3
- data_n5.json: riêng N5
- data_n4.json: riêng N4
- data_n3.json: 20 chương Kanji Masuta N3, gồm từ tiếng Nhật, cách đọc, nghĩa Việt, chương và trang đối chiếu
- data/source_coverage_n3.json: danh sách 376 chữ Kanji chính và các trang của sách
- han_viet.json: âm Hán Việt theo từng chữ (bổ sung cho N3)

- Tên bài của cả N5, N4 và N3 đều hiển thị bằng tiếng Việt để giao diện đồng nhất.

- Chế độ **Tiếng Việt → Kanji**: hiện nghĩa tiếng Việt và yêu cầu chọn từ Kanji đúng trong 4 đáp án; sau khi trả lời mới hiện furigana, nghĩa và Hán Việt rồi tự phát âm.

## Dữ liệu Kanji Master N3 và phạm vi kiểm tra

- Sách nguồn: `Kanji_Masuta_N3 1.pdf` (bản scan 192 trang).
- Giữ **20 chương** theo đúng thứ tự và chủ đề sách; ghi `source_page` là trang giới thiệu chữ Kanji được dùng làm mốc cho từ (không nhất thiết là trang mà toàn bộ từ ghép đều được in).
- `data/source_coverage_n3.json` ghi đủ **376 vị trí chữ Kanji chính** trên 96 trang học chữ. Mỗi chữ có ít nhất một mục từ tương ứng ngay trong chương của nó.
- Với mỗi từ: `lesson`, `word`, `reading` (hiragana/katakana), `meaning` (tiếng Việt), `level`. Riêng N3 có thêm `source_page` và `source_type`.
- Âm Hán Việt **theo từng chữ** lấy từ `han_viet.json`; 224 mục ánh xạ mới đã được bổ sung.
- **Giới hạn nguồn:** đây là bộ từ **được biên soạn, chọn lọc và mở rộng dựa trên chữ chính trong sách**, **không phải bản chép nguyên văn toàn bộ ví dụ, câu gạch chân hay bài kiểm tra trên từng dòng PDF**. Các mục N3 có `source_type: "curated"` để không nhầm chúng là lời trích nguyên văn. Cần đối chiếu thêm với nguyên bản để bảo đảm bao phủ toàn bộ câu ví dụ nếu muốn nâng mức coverage.
- Một từ có thể xuất hiện ở **nhiều chương** nếu được dùng để học những chữ khác nhau; ứng dụng vẫn lọc theo bài được chọn.

Kiểm tra N3:

```bash
node --test tests/n3-masuta-data.test.mjs
```

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

Database chuẩn hóa nằm ở `data/kanji_vocab.sqlite`. Script xây dựng database đọc `data_n5.json`, `data_n4.json`, `data_n3.json` và `vocab_n4_26_31.json`, chỉ giữ các mục có Kanji và deduplicate theo cặp **word + reading**. Bản SQLite và thống kê được commit từ trước ở `data/kanji_vocab.sqlite` và `data/kanji_vocab_stats.json` vẫn là snapshot N5/N4; **chạy lại lệnh build dưới đây sau khi cập nhật nhánh** để có dữ liệu N3 trong SQLite.

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
