# Duy Thắng & Thuý Quỳnh · 29.11.2026

Thiệp cưới tiếng Việt theo bố cục Chinh–Linh: giấy trắng có vân, phong bì xanh lá trầm, giấy ren, hoa trắng lá xanh, ngọc trai và dải ảnh. Nội dung hiển thị dạng một cuốn thiệp dọc trên điện thoại và máy tính. Không có mục Our Story.

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

1. Khi mở link: nền hoa lá xanh, dòng “TRÂN TRỌNG KÍNH MỜI” và bì thư trắng ren đóng kín; giấy mời và ảnh chưa hiện; phần nội dung còn `hidden` và `inert`.
2. Chạm vào dấu sáp/phong bì: bì thư đóng mở trong phối cảnh, giấy mời và ảnh hiện ra, nhạc bắt đầu và màn mở đầu chuyển vào thiệp. Tôn trọng reduced motion; lỗi phát nhạc không chặn luồng vào.
3. Trang 1: bố cục phong bì, giấy ren Save the Date, tên hai bạn, ngày cưới và đếm ngược.
4. Trang 2: ảnh cưới toàn khung với “We are Getting Married”.
5. Tiếp theo: hai gia đình và khung giấy ren chứa tên/ngày giờ/địa điểm, lịch trình ngày cưới, lịch tháng đánh dấu ngày 29 bằng trái tim, album một ảnh dọc lớn cùng dải ảnh nhỏ, lời chúc Firebase, mừng cưới và phong thư cảm ơn luôn mở sẵn với một ảnh cưới. Đã bỏ phần kể chuyện tình yêu.

Thiệp cá nhân hoá: thêm `?to=Bạn%20Ngọc`. Tên khách được hiển thị an toàn bằng textContent. Mỗi lần tải lại link đều trở về màn mở thiệp.

## Dữ liệu

- Chú rể **Duy Thắng**, cô dâu **Thuý Quỳnh**.
- Giờ mời **18:00, Chủ nhật 29/11/2026**, múi giờ Việt Nam UTC+7.
- Nhà trai: ông **Nguyễn Duy Toản**, bà **Nguyễn Thị Thanh**.
- Nhà gái: ông **Lâm Viết Chung**, bà **Nguyễn Thị Hương**.
- Ảnh từ album Drive đã cung cấp, tối ưu WebP và lưu trong dự án. Không dùng ảnh cặp đôi mẫu.
- Nhạc giữ theo mẫu Vũ–Quỳnh đã yêu cầu: nguồn `https://camcui.vn/bai230.mp3`, lưu tại `public/audio/wedding.mp3`.

Ngày, địa điểm và danh sách ảnh ở `src/content.js`. Tên, bố mẹ và lời mời trong `index.html`. Toàn bộ giao diện ở `src/wedding.css`, cơ chế mở ở `src/entry-gate.js`.

## Địa điểm, lịch trình và dữ liệu demo

- Địa điểm: **Nhà văn hoá thôn 3 Công Đình - Phù Đổng - Hà Nội**. [Bản đồ](https://maps.app.goo.gl/ndNBkdF58QADRr4o6?g_st=ic). File lịch tải về dùng cùng địa điểm.
- Lịch trình: **18:00 đón khách / 18:30 lễ thành hôn / 19:00 dùng tiệc**. Giờ mời trên thiệp, đếm ngược và file lịch là **18:00** theo cập nhật ngày 29/10/2026.
- Đã bỏ phần xác nhận tham gia (RSVP). Nút nổi đưa khách tới phần gửi lời chúc.
- Lời chúc dùng Firebase Auth Anonymous + Firestore, cập nhật trực tiếp cho các khách. Đã kiểm thử bằng Firebase Emulator. **Production đã có Web config của project `thang-quynh` qua GitHub Repository Secrets ở bước build; Anonymous Auth đã hoạt động, đang chờ publish Firestore rules để đọc/gửi thật**; khi thiếu cấu hình hoặc bị Firestore từ chối quyền, không nhận gửi và không báo lưu giả. Xem [hướng dẫn Firebase](docs/firebase-setup.md).
- Mừng cưới nhà trai: **Techcombank — 1905 0359 9540 16**. QR VietQR được sinh trong dự án, không đặt sẵn số tiền hay lời nhắn. Có sao chép số tài khoản và tải mã PNG. Chưa có thông tin nhà gái nên không hiển thị tài khoản nhà gái.

## Kiểm chứng và triển khai

- **24 bài logic/DOM**: múi giờ, đếm ngược, lịch, ICS, lưu trữ bị chặn, album, trạng thái gửi/tải lời chúc an toàn, gate chống mở lặp và reduced motion.
- **20 bài Chromium**: bảy viewport từ 320px đến 1920px, phong bì/mở thiệp, trang 1–2 và loại bỏ Our Story, album, phím điều hướng, tải lịch, nhạc, loại bỏ RSVP, ảnh số 8 trước lịch và lời chúc chưa cấu hình.
- **5 bài Firestore Rules + 1 luồng Firebase trong Chromium**: xác thực, quyền đọc/ghi, dữ liệu hợp lệ, namespace riêng; gửi từ một khách, khách thứ hai nhận trực tiếp và vẫn thấy khi tải lại.
- Xem [biên bản và ảnh giao diện](docs/visual-review.md).
- `npm run review:ui` chụp màn mở, trang 1, trang 2 và các phần còn lại. Khởi chạy Vite ở cổng 5173 trước; hỗ trợ `CHROMIUM_PATH` và `REVIEW_DIR`.
- GitHub Actions chạy test và browser tests trước khi build/triển khai Pages; lưu artifact `browser-test-evidence`.
- Chưa kiểm chứng Safari/iOS thật.

Với GitHub Pages, workflow đặt `BASE_PATH=/thang-quynh-wedding/`. Hosting domain riêng dùng `npm run build` với base `/`, output `dist/`.

## Nguồn

- Bố cục hiện tại: https://jmiiwedding.com/chinhlinhh.
- [Artwork, font và cơ chế dựng lớp](docs/opening-artwork.md).
- Ảnh: https://drive.google.com/drive/folders/1KJGv_e1GDBI6u0QTpxz097C1xIuCiLUT.

## QR mừng cưới nhà trai

Cấu hình ở `wedding.gift.groom` trong `src/content.js`. Mã BIN Techcombank **970407** đối chiếu danh sách ngân hàng VietQR; số tài khoản **19050359954016** theo dữ liệu được cung cấp. Không điền tên chủ tài khoản khi chưa được cung cấp.

`npm run gift:qr` sinh ảnh `public/images/qr-groom-techcombank.png`. `pretest` và `prebuild` tự chạy bước này để ảnh khớp cấu hình. Tạo QR tại dự án, không gọi dịch vụ QR trong trình duyệt khách. `src/vietqr.js` dựng payload NAPAS QRIBFTTA và CRC16/CCITT-FALSE; kiểm thử giải mã lại PNG, đối chiếu ngân hàng/số tài khoản/tiền tệ và xác nhận không có số tiền cố định.

## Tông xanh và hoa

Giữ bố cục Chinh–Linh, đổi sang trắng và xanh lá trầm. Hai cụm hoa trắng lá xanh theo mẫu https://jmiiwedding.com/duyanhhamauu được lưu trong `public/images/floral-white`. Các lớp phong bì/dấu sáp được đổi tông qua CSS; ảnh cưới và QR thanh toán không áp bộ lọc màu.

## Bố cục trắng xanh và font tiếng Việt

Trang 3 theo ảnh tham chiếu: hai gia đình nằm phía trên, tên cô dâu chú rể và thông tin tiệc nằm trong một tấm giấy ren oval, điểm hoa trắng lá xanh/ngọc trai. Khung oval chỉ dành cho giấy mời, không cắt ảnh chân dung thành vòm. Đã bỏ hoàn toàn dress code.

Lora cho tên và tiêu đề, Be Vietnam Pro cho nội dung/biểu mẫu; font tự lưu trong bản build qua Fontsource, gồm tập ký tự tiếng Việt. Số lịch dùng Be Vietnam Pro 300 ở 18px, năm 2026 ở 26px. Riêng “Thank you!” trên ảnh cuối dùng font Ecatherina theo ảnh tham chiếu; câu hẹn gặp nằm ngay phía trên chữ này, đã bỏ phần lời cảm ơn phía trên phong thư.

Album có một ảnh dọc lớn tỉ lệ 2:3, hiển thị trọn ảnh với object-fit: contain, và 7 ảnh thu nhỏ trong dải cuộn ngang. Chỉ dùng đúng các ảnh Drive số **4, 11, 17, 3, 6, 10, 12** theo thứ tự này (đưa ảnh thứ 2, 5, 7 của thứ tự cũ lên đầu). Chọn ảnh nhỏ hoặc dùng nút/phím điều hướng để đổi ảnh lớn; chạm ảnh lớn mở ảnh đầy đủ trong lightbox. Phong thư cuối luôn mở sẵn với một ảnh cưới; dấu sáp chỉ trang trí, không cần bấm mở.

## Ảnh chuyển tiếp trước Timeline

Ảnh ngang **9.jpg** trong Drive đã được lưu thành `public/images/9.webp`, hiển thị tỉ lệ 3:2 trước Timeline. Caption gồm “Where” bằng font Ecatherina (ClosingScript) và “LOVE BEGINS” bằng Lora, màu trắng trên lớp phủ tối ở khoảng trời, không che hai người. Không cắt ảnh ngang thành ảnh dọc.

## Cập nhật ngày 30/10/2026

Ảnh ngang số 8 nằm ngay trước phần lịch Save the date (sau Timeline). Album vẫn dọc 2:3, thứ tự mới: 4 → 11 → 17 → 3 → 6 → 10 → 12. Không còn form xác nhận tham gia. Sổ lời chúc dùng collection Firebase riêng; xem [cấu hình và quy tắc dữ liệu](docs/firebase-setup.md). Tổng 50 bài kiểm thử: 24 unit/DOM, 20 UI, 5 rules, 1 UI Firebase.

## Firebase production build

Cả sáu trường Firebase Web config được cấp qua GitHub Repository Secrets ở bước build; Vite nhận chúng khi `npm run build`. Mã ứng dụng lấy giá trị từ `import.meta.env`; không có giá trị Firebase được hardcode trong `src/`. Auth Anonymous của project `thang-quynh` đã hoạt động. Firestore vẫn trả permission-denied; cần chủ project Publish rules đã chuẩn bị, xem [hướng dẫn](docs/firebase-setup.md).

Workflow kiểm tra đủ sáu Repository Secrets `VITE_FIREBASE_*` trước khi build, dừng khi thiếu hoặc rỗng và không log giá trị. Đã bỏ `.env.production` khỏi phiên bản hiện tại; local dùng `.env.local` theo `.env.example`.
