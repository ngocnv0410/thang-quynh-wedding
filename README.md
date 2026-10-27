# Duy Thắng & Thuý Quỳnh · 29.11.2026

Thiệp cưới tiếng Việt theo bố cục Chinh–Linh: giấy trắng có vân, phong bì đỏ rượu vang, giấy ren, ngọc trai và dải ảnh. Nội dung hiển thị dạng một cuốn thiệp dọc trên điện thoại và máy tính. Không có mục Our Story.

Website: https://ngocnv0410.github.io/thang-quynh-wedding/

## Chạy dự án

Node.js 22.12+ hoặc 24.

```sh
npm ci
npm run dev
npm test
npx playwright install chromium
npm run test:ui
npm run build
```

Có thể dùng Chromium hệ thống với `CHROMIUM_PATH=/usr/bin/chromium npm run test:ui`. Báo cáo ở `playwright-report/`; ảnh và trace khi lỗi ở `test-results/`.

## Bố cục và mở thiệp

1. Khi mở link: phong bì đỏ, giấy mời và dải ảnh; phần nội dung còn `hidden` và `inert`.
2. Chạm vào dấu sáp/phong bì: mặt phong bì hạ trong phối cảnh, giấy mời và ảnh trượt lên, nhạc bắt đầu và màn mở đầu chuyển vào thiệp. Tôn trọng reduced motion; lỗi phát nhạc không chặn luồng vào.
3. Trang 1: bố cục phong bì, giấy ren Save the Date, tên hai bạn, ngày cưới và đếm ngược.
4. Trang 2: ảnh cưới toàn khung với “We are Getting Married”.
5. Tiếp theo: hai gia đình, giờ/địa điểm, lịch trình dự kiến, gợi ý trang phục, lịch tháng, album, RSVP, lời chúc, mừng cưới và cảm ơn. Đã bỏ phần kể chuyện tình yêu.

Thiệp cá nhân hoá: thêm `?to=Bạn%20Ngọc`. Tên khách được hiển thị an toàn bằng textContent. Mỗi lần tải lại link đều trở về màn mở thiệp.

## Dữ liệu

- Chú rể **Duy Thắng**, cô dâu **Thuý Quỳnh**.
- Tiệc chung vui **19:00, Chủ nhật 29/11/2026**, múi giờ Việt Nam UTC+7.
- Nhà trai: ông **Nguyễn Duy Toản**, bà **Nguyễn Thị Thanh**.
- Nhà gái: ông **Lâm Viết Chung**, bà **Nguyễn Thị Hương**.
- Ảnh từ album Drive đã cung cấp, tối ưu WebP và lưu trong dự án. Không dùng ảnh cặp đôi mẫu.
- Nhạc giữ theo mẫu Vũ–Quỳnh đã yêu cầu: nguồn `https://camcui.vn/bai230.mp3`, lưu tại `public/audio/wedding.mp3`.

Ngày, địa điểm, danh sách ảnh và endpoint RSVP ở `src/content.js`. Tên, bố mẹ và lời mời trong `index.html`. Toàn bộ giao diện ở `src/wedding.css`, cơ chế mở ở `src/entry-gate.js`.

## Dữ liệu demo cần bổ sung

- Địa điểm hiện là **Tư gia nhà trai — Demo / Hoàn Kiếm, Hà Nội (địa chỉ minh hoạ)**; cập nhật cả tên, địa chỉ và Maps URL trước khi gửi chính thức.
- Lịch trình **18:30 đón khách / 20:00 lưu lại khoảnh khắc** là minh hoạ, có ghi nhãn. **19:00 tiệc chung vui** là giờ thật được cung cấp. Màu trang phục là gợi ý.
- RSVP mặc định lưu riêng trên thiết bị. Để gửi thật, cung cấp API POST nhận `{ name, attendance, count, createdAt }`, đặt `rsvpEndpoint` và cập nhật chú thích demo. Không đưa khoá bí mật vào frontend.
- Lời chúc lưu riêng trên thiết bị; ba lời chúc minh hoạ có ghi nhãn. Đồng bộ nhiều khách cần backend.
- Mừng cưới chưa có tài khoản/QR thật, giao diện hiển thị chờ cập nhật.

## Kiểm chứng và triển khai

- **14 bài logic/DOM**: múi giờ, đếm ngược, lịch, ICS, lưu trữ bị chặn, album, RSVP, lời chúc an toàn, gate chống mở lặp và reduced motion.
- **15 bài Chromium**: bảy viewport từ 320px đến 1920px, phong bì/mở thiệp, trang 1–2 và loại bỏ Our Story, album, phím điều hướng, tải lịch, nhạc, RSVP/reload và lời chúc.
- Xem [biên bản và ảnh giao diện](docs/visual-review.md).
- `npm run review:ui` chụp màn mở, trang 1, trang 2 và các phần còn lại. Khởi chạy Vite ở cổng 5173 trước; hỗ trợ `CHROMIUM_PATH` và `REVIEW_DIR`.
- GitHub Actions chạy test và browser tests trước khi build/triển khai Pages; lưu artifact `browser-test-evidence`.
- Chưa kiểm chứng Safari/iOS thật.

Với GitHub Pages, workflow đặt `BASE_PATH=/thang-quynh-wedding/`. Hosting domain riêng dùng `npm run build` với base `/`, output `dist/`.

## Nguồn

- Bố cục hiện tại: https://jmiiwedding.com/chinhlinhh.
- [Artwork, font và cơ chế dựng lớp](docs/opening-artwork.md).
- Ảnh: https://drive.google.com/drive/folders/1KJGv_e1GDBI6u0QTpxz097C1xIuCiLUT.
