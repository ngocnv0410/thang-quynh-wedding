# Kết nối sổ lời chúc Firebase

Phần lời chúc đã chuyển sang Firebase Authentication (Anonymous) và Cloud Firestore. Đã kiểm thử SDK thật với Firebase Emulator: gửi, lưu, cập nhật sang khách thứ hai, tải lại trang, chặn sửa/xoá và kiểm tra dữ liệu. **Project production đã được chọn: `thang-quynh`, sáu trường Web config được cấp qua GitHub Repository Secrets khi build.** Anonymous Auth đã được kiểm tra thành công. Firestore hiện trả `PERMISSION_DENIED` cho cả truy vấn công khai và đã xác thực; cần publish rules trước khi khách gửi/đọc lời chúc thật. Không có phiên đăng nhập Firebase quản trị trong môi trường này để tự triển khai rules.

## Cấu hình build đã áp dụng

Từ Firebase Console → Project settings → Your apps → Web app, lấy `firebaseConfig` của project được chọn. Cần `apiKey`, `projectId`, `appId`; `authDomain` có thể suy ra từ project. Đây là cấu hình Web được Firebase thiết kế để dùng trong trình duyệt, không phải service account hay khoá quản trị.

Workflow `.github/workflows/pages.yml` cấp cả sáu thông số từ **Repository Secrets** trực tiếp vào bước build. Mã ứng dụng chỉ đọc `import.meta.env`, không hardcode giá trị. Không dùng GitHub Variables cho các trường này.

| Firebase Web config | Repository Secret |
| --- | --- |
| apiKey | `VITE_FIREBASE_API_KEY` |
| authDomain | `VITE_FIREBASE_AUTH_DOMAIN` |
| projectId | `VITE_FIREBASE_PROJECT_ID` |
| storageBucket | `VITE_FIREBASE_STORAGE_BUCKET` |
| messagingSenderId | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| appId | `VITE_FIREBASE_APP_ID` |

Đã bỏ `.env.production` khỏi phiên bản hiện tại và khôi phục gitignore cho mọi file `.env.*` trừ `.env.example`. Local có thể tạo `.env.local` từ file mẫu. `scripts/check-build-env.mjs` kiểm tra đủ sáu biến trước khi build; nếu thiếu hoặc rỗng, build dừng và chỉ báo tên biến, không in giá trị.

Secrets chỉ được truyền ở bước build, không truyền vào các bài kiểm thử; Firebase Emulator tiếp tục dùng project demo tách biệt. Firebase Web config vẫn được Vite nhúng vào JavaScript trình duyệt theo thiết kế của Firebase, không phải khoá quản trị.

Trong project được chọn:

1. Tạo Cloud Firestore database `(default)` nếu chưa có.
2. Bật Authentication → Sign-in method → Anonymous.
3. Áp dụng match rule trong [firestore.rules](../firestore.rules).
4. Web config đã sẵn sàng; sau khi publish rules, khách có thể bấm Thử tải lại hoặc tải lại trang để kết nối.

**Nếu dùng chung project với thiệp khác:** gộp match `/weddings/thang-quynh-20261129/wishes/{guestId}` vào rules hiện có và giữ nguyên các match của thiệp cũ. Không thay toàn bộ rules của project chung bằng file dành riêng của repo này. Cần quyền Firebase Console/CLI của chủ project để triển khai rules; quyền push GitHub không cấp quyền Firebase.

## Dữ liệu và hành vi

- Collection: `weddings/thang-quynh-20261129/wishes`.
- Document ID là UID Anonymous, cho phép một lời chúc trên mỗi danh tính trình duyệt. Khách không cần thao tác đăng nhập.
- Mỗi document có đúng `name` (1–80 ký tự), `message` (1–1000 ký tự) và `createdAt` do server tạo.
- Mọi khách đọc được 50 lời chúc mới nhất, cập nhật qua `onSnapshot`; dữ liệu cũ vẫn được lưu trong Firestore.
- Browser không được sửa hoặc xoá lời chúc. Chủ project quản lý bằng Firebase Console.
- Chỉ báo gửi thành công sau khi transaction được server xác nhận. Lỗi giữ nguyên nội dung để gửi lại; không chuyển sang localStorage và không chèn lời chúc demo.
- Khi thiếu cấu hình, nút gửi bị khoá và trang báo sổ lời chúc đang chuẩn bị. Không báo lưu thành công khi chưa có backend.

## Kiểm thử độc lập với production

```sh
npm ci
npx playwright install chromium
npm test
npm run test:firebase
npm run test:ui
```

`test:firebase` cần Java 21; tự khởi động Auth/Firestore Emulator với project `demo-thang-quynh`. Gồm 5 bài rules và một luồng trình duyệt thật dùng hai browser context độc lập. Không truy cập hoặc ghi dữ liệu vào Firebase production. GitHub Actions chạy cả bộ kiểm thử trước khi triển khai Pages.

## Kiểm tra project thật ngày 30/10/2026

- Anonymous Auth: HTTP 200, tạo được phiên khách; tài khoản QA tạm được dọn sau kiểm tra, không viết lời chúc thử vào production.
- Truy vấn 50 lời chúc trong collection đúng namespace: HTTP 403 `PERMISSION_DENIED / Missing or insufficient permissions`, ở cả trạng thái public và đã xác thực.
- Cần chủ project mở [Firebase Console của thang-quynh](https://console.firebase.google.com/project/thang-quynh/firestore), tab Rules, áp dụng [firestore.rules](../firestore.rules) rồi Publish. Sau đó kiểm tra lại quyền đọc/gửi từ website.
- Khi Firestore từ chối quyền, trang khóa nút gửi và giữ khả năng Thử tải lại. Không báo đã lưu thành công khi server chưa chấp nhận.
