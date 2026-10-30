# Kết nối sổ lời chúc Firebase

Phần lời chúc đã chuyển sang Firebase Authentication (Anonymous) và Cloud Firestore. Đã kiểm thử SDK thật với Firebase Emulator: gửi, lưu, cập nhật sang khách thứ hai, tải lại trang, chặn sửa/xoá và kiểm tra dữ liệu. **Chưa cấu hình project production và chưa triển khai rules lên Firebase thật.** Không tự dùng project của mẫu Ngọc–Thuỷ.

## Cấu hình cần cung cấp

Từ Firebase Console → Project settings → Your apps → Web app, lấy `firebaseConfig` của project được chọn. Cần `apiKey`, `projectId`, `appId`; `authDomain` có thể suy ra từ project. Đây là cấu hình Web được Firebase thiết kế để dùng trong trình duyệt, không phải service account hay khoá quản trị.

Ánh xạ vào build:

| Firebase Web config | Biến Vite / GitHub |
| --- | --- |
| apiKey | GitHub Secret `VITE_FIREBASE_API_KEY` |
| projectId | GitHub Variable `VITE_FIREBASE_PROJECT_ID` |
| appId | GitHub Variable `VITE_FIREBASE_APP_ID` |
| authDomain | GitHub Variable `VITE_FIREBASE_AUTH_DOMAIN` (tuỳ chọn) |

Workflow Pages đã truyền các biến trên vào bước build. Local dùng `.env.local` theo `.env.example`. Không điền service-account JSON, private key hoặc token quản trị vào các biến `VITE_`.

Trong project được chọn:

1. Tạo Cloud Firestore database `(default)` nếu chưa có.
2. Bật Authentication → Sign-in method → Anonymous.
3. Áp dụng match rule trong [firestore.rules](../firestore.rules).
4. Điền Web config, build/deploy lại website.

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
