# Kanji N5 / N4 Quiz

- N5: 26 bài, 366 mục từ.
- N4: 24 bài, 449 mục từ.
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
