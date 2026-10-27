# Duy Thắng & Thuý Quỳnh · 29.11.2026

Thiệp cưới tiếng Việt, giao diện giấy ngà / đỏ rượu vang, đáp ứng điện thoại và máy tính. Xây mới bằng Vite + JavaScript, không cần backend để xem thiệp.

## Chạy dự án

Yêu cầu Node.js 22.12+ (hoặc 24).

```sh
npm ci
npm run dev
npm test
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

- Phong bì CSS 3D mở bằng chạm/click, bật nhạc sau thao tác khách.
- Khung ảnh vòm, hiệu ứng nghiêng 2.5D trên thiết bị có con trỏ, hiện nội dung theo cuộn. Tôn trọng `prefers-reduced-motion`.
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

Đã có workflow `.github/workflows/pages.yml` để kiểm thử, build và triển khai GitHub Pages. Tích hợp hiện tại không được GitHub cấp quyền bật Pages (API trả 403). Chủ repo cần vào **Settings → Pages → Source: GitHub Actions**, sau đó **Actions → Build and deploy wedding invitation → Run workflow**. Khi Pages chưa bật, workflow vẫn kiểm thử/build và lưu artifact, bỏ qua bước deploy.

URL dự kiến sau khi Pages được bật và deploy thành công: `https://ngocnv0410.github.io/thang-quynh-wedding/`.

Workflow tự đặt `BASE_PATH=/thang-quynh-wedding/`. Nếu đổi tên repo, cập nhật biến này. Các đường dẫn tài nguyên được Vite xử lý theo base.

## Kiểm chứng

`npm test` kiểm tra múi giờ, đếm ngược, lịch, file ICS, album, mở phong bì, RSVP demo, chống chèn HTML ở lời chúc và sự tồn tại của tài nguyên. Kiểm thử tương tác chạy với jsdom; chưa thay thế kiểm tra hình ảnh trên Safari/Chrome và điện thoại thật.

## Nguồn tham khảo

- Mẫu bố cục/mở thiệp: https://jmiiwedding.com/duyanhhamauu và trang bên trong https://jmiiwedding.com/duyanhmau.
- Tham khảo cấu trúc các phần, accessibility và phân biệt nội dung thật/demo trong repo `ngocnv0410/ngoc-thuy-wedding`. Không sao chép dữ liệu riêng hay cấu hình backend của repo đó.
- Ảnh: https://drive.google.com/drive/folders/1KJGv_e1GDBI6u0QTpxz097C1xIuCiLUT.
