# Kanji N4 Quiz — Full book

Website tĩnh, không cần backend.

## Dữ liệu
- 24 bài trong tài liệu Kanji N4 đã cung cấp.
- 449 mục từ vựng.
- 321 chữ Kanji duy nhất trong các mục từ.
- Kanji + cách đọc được bóc theo các ô On/Kun của sách.
- Nghĩa tiếng Việt và Hán Việt của các chữ phụ trong từ ghép được bổ sung để phục vụ ôn tập.

## Chế độ
- Trắc nghiệm 4 đáp án: Kanji → chọn furigana.
- Sau khi chọn: hiện furigana + Kanji + nghĩa Việt + Hán Việt từng chữ của cả 4 đáp án.
- Viết furigana: nhập cách đọc bằng hiragana/katakana.
- Edge / Browser TTS: `window.speechSynthesis`, ưu tiên voice `ja-JP`.

## Cách chạy
1. Mở `index.html` bằng Microsoft Edge.
2. Chọn một hoặc nhiều bài trong 24 bài.
3. Chọn chế độ, số câu và voice TTS.
4. Bấm **Bắt đầu kiểm tra**.

## File dữ liệu
- `data.json`: toàn bộ dữ liệu từ vựng.
- `han_viet.json`: bảng Hán Việt dùng trong giao diện.

- Sau khi chọn một đáp án trắc nghiệm, website tự động phát âm từ đúng bằng Edge/Browser TTS.

- Tốc độ TTS mặc định: **1.00×**; có nút **Nghe thử giọng** ngay ở màn hình thiết lập.

- TTS đọc trường **reading/furigana** thay vì đọc trực tiếp Kanji, tránh các trường hợp Edge tự chọn sai âm như `八百屋` → phải đọc `やおや`.
