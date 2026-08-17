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

## Kiểm tra từ mới N4 — bài 26–31
- Tích hợp thêm **184 từ mới** từ app tham khảo, chia theo bài: 26 (22 từ), 27 (23), 28 (39), 29 (47), 30 (34), 31 (19).
- Đây là một nội dung kiểm tra riêng, không làm thay đổi quiz Kanji hiện tại.
- Có 3 mode:
  1. **Luyện viết**: hiện nghĩa tiếng Việt → tự viết Kanji/Kana trên canvas → xem đáp án và tự chấm Đúng/Sai.
  2. **Hỏi từ tiếng Nhật**: hiện từ tiếng Nhật + furigana → chọn nghĩa tiếng Việt trong 4 đáp án.
  3. **Hỏi tiếng Việt**: hiện nghĩa tiếng Việt → gõ từ tiếng Nhật; chấp nhận từ tiếng Nhật hoặc furigana.
- Có thể chọn riêng từng bài 26–31 hoặc chọn nhiều bài; vẫn dùng số câu, thứ tự, TTS, điểm số, ôn câu sai và giao diện responsive hiện tại.
- Dữ liệu nguồn được lưu ở `vocab_n4_26_31.json`.
