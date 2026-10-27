# Duy Thắng & Thuý Quỳnh · 29.11.2026

Thiệp cưới tiếng Việt, giao diện xanh rừng / giấy ngà / nâu đồng, đáp ứng điện thoại và máy tính. Xây mới bằng Vite + JavaScript, không cần backend để xem thiệp.

## Chạy dự án

Yêu cầu Node.js 22.12+ (hoặc 24).

```sh
npm ci
npm run dev
npm test
npx playwright install chromium
npm run test:ui
npm run build
npm run preview
```

## Nội dung đã có

- Chú rể **Duy Thắng**, cô dâu **Thuý Quỳnh**.
- Tiệc chung vui **19:00, Chủ nhật 29/11/2026**, múi giờ **Asia/Ho_Chi_Minh (UTC+7)**.
- Nhà trai: ông **Nguyễn Duy Toản**, bà **Nguyễn Thị Thanh**.
- Nhà gái: ông **Lâm Viết Chung**, bà **Nguyễn Thị Hương**.
- Ảnh từ album Drive người dùng cung cấp; đã tối ưu WebP, tải từ thư mục dự án, không phụ thuộc hotlink Drive.
- Nhạc từ trang nội dung `https://jmiiwedding.com/vuquynhh/`, được dẫn từ mẫu `https://jmiiwedding.com/vuquynhmau`: nguồn `https://camcui.vn/bai230.mp3`.

## Tính năng

- Mở link luôn hiển thị phong bì trước, nội dung thiệp được ẩn và khóa tương tác. Một lần chạm/click nâng thư và chuyển vào thiệp; nhạc bật sau thao tác khách. Không có nút đóng/Escape để bỏ qua màn mở thư.
- Khung ảnh chữ nhật kiểu ảnh in, hiệu ứng nghiêng 2.5D trên thiết bị có con trỏ, hiện nội dung theo cuộn. Tôn trọng `prefers-reduced-motion`.
- Đếm ngược đúng giờ Việt Nam; lịch tháng 11 đánh dấu ngày 29; tải sự kiện `.ics`.
- Album 18 ảnh, tải thêm mỗi lần 6 ảnh; xem toàn màn hình, vuốt trên điện thoại, phím mũi tên và Escape.
- Lời hẹn và sổ lưu niệm demo dùng localStorage, thông báo rõ trạng thái lưu. Không giả lập gửi thành công tới cô dâu chú rể.
- Thiệp cá nhân hoá qua `?to=Bạn%20Ngọc` (nội dung được hiển thị như văn bản an toàn).
- Font tự lưu trữ, điều hướng bàn phím, nhãn biểu mẫu, nút nhạc bật/tắt, bố cục mobile.

## Thông tin demo cần bổ sung

- **Địa điểm** hiện là `Tư gia nhà trai — Demo / Hoàn Kiếm, Hà Nội (địa chỉ minh hoạ)`. Cập nhật tên, địa chỉ và URL Maps ở `src/content.js`. Bản demo và lịch tải xuống ghi rõ địa điểm chưa chính thức.
- **RSVP**: để gửi lời hẹn thật, điền `rsvpEndpoint` trong `src/content.js` và cung cấp API nhận POST JSON `{ name, attendance, count, createdAt }`. Cần sửa lời chú thích demo ở biểu mẫu trong `index.html` khi API sẵn sàng. Không đưa khoá bí mật vào frontend.
- **Lời chúc**: hiện chỉ lưu riêng trên trình duyệt và có ba lời chúc minh hoạ ghi nhãn rõ. Muốn đồng bộ giữa khách cần bổ sung backend.
- **Mừng cưới**: chưa có số tài khoản thật, hộp mừng cưới hiển thị trạng thái chờ cập nhật; không tạo QR ngân hàng demo để tránh chuyển nhầm.
- Bố mẹ, tên hai bạn và lời mời nằm ở `index.html`; ngày, nơi tổ chức và album ở `src/content.js`.

## Triển khai

`dist/` có thể đưa lên Vercel, Netlify, Cloudflare Pages hoặc bất kỳ hosting tĩnh nào. Build: `npm run build`, output: `dist`. Với domain riêng dùng base `/` mặc định.

Đã có workflow `.github/workflows/pages.yml` để kiểm thử, build và triển khai GitHub Pages. Pages đã được bật với nguồn GitHub Actions: mỗi push lên `main` chạy unit/DOM tests và Chromium tests trước khi triển khai.

Website: `https://ngocnv0410.github.io/thang-quynh-wedding/`.

Workflow tự đặt `BASE_PATH=/thang-quynh-wedding/`. Nếu đổi tên repo, cập nhật biến này. Các đường dẫn tài nguyên được Vite xử lý theo base.

## Kiểm chứng

- `npm test`: **14 bài kiểm tra** về múi giờ, đếm ngược, lịch, file ICS, lỗi lưu trữ, album, phong bì, RSVP và chèn HTML vào lời chúc.
- `npm run test:ui`: **15 bài kiểm tra Chromium thực tế**, kiểm tra màn hình 320×740, 375×812, 390×844, 430×932, 768×1024, 1440×900 và 1920×1080; tiêu đề/ngày/nút mở thiệp phải nằm trong viewport, các section không tràn ngang. Kiểm tra mở thiệp 3D, bàn phím, album, nhạc, tải lịch, RSVP, lưu lại dữ liệu, lời chúc và trường hợp trình duyệt chặn lưu trữ.
- Test UI tự khởi chạy Vite khi cần. Cài Chromium qua `npx playwright install chromium`; nếu đã có Chromium hệ thống, dùng `CHROMIUM_PATH=/usr/bin/chromium npm run test:ui`.
- GitHub Actions bắt buộc chạy unit + browser tests trước build; ảnh cover cho 7 kích thước màn hình, báo cáo HTML và trace khi lỗi được lưu trong artifact `browser-test-evidence`.
- `npm run review:ui` chụp cover, lời mời, sự kiện, album, RSVP, lời chúc và phong bì trên desktop/mobile, xuất vào `artifacts/visual-review`. Chạy `npm run dev -- --port 5173` trước. Hỗ trợ `CHROMIUM_PATH` và `REVIEW_DIR`.
- Xem [ảnh chụp giao diện và biên bản kiểm tra](docs/visual-review.md). Kiểm tra trực quan đã thực hiện bằng Chromium; chưa xác nhận trên Safari/iOS thật.

## Nguồn tham khảo

- Mẫu bố cục/mở thiệp: https://jmiiwedding.com/duyanhhamauu và trang bên trong https://jmiiwedding.com/duyanhmau.
- Tham khảo cấu trúc các phần, accessibility và phân biệt nội dung thật/demo trong repo `ngocnv0410/ngoc-thuy-wedding`. Không sao chép dữ liệu riêng hay cấu hình backend của repo đó.
- Ảnh: https://drive.google.com/drive/folders/1KJGv_e1GDBI6u0QTpxz097C1xIuCiLUT.

Artwork phần mở thư và font theo mẫu: xem [nguồn và thông số](docs/opening-artwork.md).
