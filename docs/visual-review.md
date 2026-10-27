# Kiểm tra giao diện — 27/10/2026

Đây là ảnh chụp từ trang được render trong Chromium, sử dụng ảnh và font thật của dự án.

## Thay đổi theo phản hồi mới nhất

- Bỏ hình cổng vòm ở cả phần lời mời và xác nhận tham dự. Ảnh dùng khung chữ nhật giấy ngà; kiểm thử CSS xác nhận bán kính góc bằng 0 ở cả bảy viewport.
- Khi mở link, màn phong bì hiển thị trước. Phần nội dung thiệp có `hidden` và `inert`, không thể xem/cuộn/tab tới trước khi chạm thư.
- Chạm bất kỳ chỗ nào trên phong bì sẽ mở nắp, nâng lá thư, làm mờ màn mở đầu và tự vào đầu thiệp sau khoảng 2,55 giây. Không cần bấm nút tiếp tục; Escape không bỏ qua màn đầu. Tải lại link sẽ hiển thị lại phong bì.
- Nhạc chỉ bắt đầu sau lần chạm mở thư. Nếu nhạc lỗi, quá trình vào thiệp vẫn hoạt động. Chế độ giảm chuyển động bỏ thời gian chờ hiệu ứng.
- Lá thư nhận tên khách qua query `?to=...` và hiển thị bằng textContent.
- Đã xem ảnh render màn phong bì, trạng thái nâng thư, khung chữ nhật ở lời mời/RSVP trên desktop và mobile.

## Màn mở đầu mới

### Mở link — desktop

![Phong bì khi mở link trên desktop](screenshots/desktop-entry.jpg)

### Mở link — điện thoại

![Phong bì khi mở link trên điện thoại](screenshots/mobile-entry.jpg)

### Chạm mở thư — điện thoại

![Lá thư đang mở trước khi vào thiệp](screenshots/mobile-letter-opening.jpg)

## Kết quả kiểm thử

- **14/14** kiểm thử logic và DOM: múi giờ Việt Nam, ranh giới đếm ngược, lịch năm nhuận, ICS và escaping, lưu trữ lỗi, mở thiệp, album, RSVP và lời chúc an toàn.
- **14/14** kiểm thử trình duyệt: bảy viewport, luồng phong bì/keyboard, album/keyboard, RSVP/reload, lời chúc, tải lịch, reduced motion/storage bị chặn, nhạc bật/tắt.
- Viewport: **320×740, 375×812, 390×844, 430×932, 768×1024, 1440×900, 1920×1080**.
- Đã đọc ảnh chụp cover điện thoại nhỏ/tablet/desktop, lời mời, sự kiện, album, RSVP, lời chúc và phong bì trên mobile/desktop; không có lỗi JavaScript trong lần thu ảnh mobile/desktop.
- Chưa kiểm chứng trên Safari/iOS thật. Screenshot và kiểm tra bounding box không thay thế việc đánh giá thẩm mỹ của cô dâu chú rể.

## Ảnh chụp

### Cover desktop — 1440×1000

![Cover desktop](screenshots/desktop-hero.jpg)

### Cover điện thoại — 390×844

![Cover điện thoại](screenshots/mobile-hero.jpg)

### Thiệp mở — điện thoại

![Phong bì 3D đã mở](screenshots/mobile-letter-opening.jpg)

### Lời mời — desktop

![Lời mời hai gia đình](screenshots/desktop-invitation.jpg)

### Ngày tiệc — điện thoại

![Ngày tiệc và lịch](screenshots/mobile-event.jpg)

### Ngày tiệc — tablet sau khi sửa ngắt dòng

![Ngày tiệc tablet](screenshots/tablet-event.jpg)

### Album — desktop

![Album cưới](screenshots/desktop-album.jpg)

### Xác nhận — điện thoại

![Biểu mẫu lời hẹn](screenshots/mobile-rsvp.jpg)

Một số ảnh toàn section dùng `prefers-reduced-motion: reduce` để mọi khối đều hiển thị khi chụp; ảnh cover được chụp sau khi hiệu ứng ban đầu kết thúc. Các nút cố định trong ảnh toàn section phản ánh vị trí viewport lúc chụp. Toàn bộ luồng mở thiệp còn được test với chế độ chuyển động thông thường.

## Chạy lại

```sh
npm ci
npx playwright install chromium
npm test
npm run test:ui
npm run build
```

Ảnh chụp ở bảy kích thước và báo cáo HTML được upload trong workflow dưới artifact `browser-test-evidence`. Khi có thay đổi giao diện, chạy lại browser tests và `npm run review:ui`, đọc ảnh trước khi cập nhật ảnh trong thư mục này.
