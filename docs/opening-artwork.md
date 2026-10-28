# Bố cục Chinh–Linh và màn mở

Tham chiếu bố cục: https://jmiiwedding.com/chinhlinhh.

Phần nội dung đầu của mẫu dùng phong bì đỏ mở sẵn, giấy ren trượt lên, dải ảnh, hoa đỏ/ngọc trai trên nền giấy trắng. Trang kế tiếp là ảnh toàn khung với hai dòng “We are / Getting Married”. Dự án dựng lại các lớp này với ảnh, tên và ngày cưới của Thắng & Quỳnh; không dùng ảnh cặp đôi mẫu hay API/biểu mẫu bên ngoài.

| Tài nguyên cục bộ | Nguồn |
| --- | --- |
| `images/chinh-linh/paper.png` | https://w.ladicdn.com/s750x950/6322a62f2dad980013bb5005/thiep-thanh-dat-element_0033_1-20251010160355-v6bgi.png |
| `images/chinh-linh/torn-edge.png` | https://w.ladicdn.com/s750x550/6322a62f2dad980013bb5005/vector-smart-object-20260823154006-exf34.png |
| `images/chinh-linh/botanical.png` | https://w.ladicdn.com/s500x600/6322a62f2dad980013bb5005/chatgpt-image-aug-25-2026-01_38_30-am-20260824183718-ju4w5.png |
| `images/chinh-linh/envelope-back.png` | https://w.ladicdn.com/s650x700/6322a62f2dad980013bb5005/elm_0001s_0006_pbi-20260823154102-pfnqg.png |
| `images/chinh-linh/invitation-paper.png` | https://w.ladicdn.com/s550x700/6322a62f2dad980013bb5005/chatgpt-image-aug-23-2026-12_53_23-am-20260823155052-kgay1.png |
| `images/chinh-linh/small-card.png` | https://w.ladicdn.com/s500x450/6322a62f2dad980013bb5005/elm_0001s_0004_chatgpt-image-aug-23-2026-12_14_54-am-20260823154102-e9stc.png |
| `images/chinh-linh/ribbon.png` | https://w.ladicdn.com/s400x600/6322a62f2dad980013bb5005/group-2-copy-20260824180758-_oxqa.png |
| `images/chinh-linh/envelope-front.png` | https://w.ladicdn.com/s650x550/6322a62f2dad980013bb5005/elm_0001s_0003_pbi-tren-20260823154102-4dyrc.png |
| `images/chinh-linh/wax-seal.png` | https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/elm_0001s_0001_chatgpt-image-aug-23-2026-01_31_51-am-20260823154102-u2li3.png |
| `fonts/lora-regular-20250728035828-eollg.ttf` | https://w.ladicdn.com/6322a62f2dad980013bb5005/lora-regular-20250728035828-eollg.ttf |
| `fonts/oranienbaum-regular-20260810155540-evoqr.ttf` | https://w.ladicdn.com/6322a62f2dad980013bb5005/oranienbaum-regular-20260810155540-evoqr.ttf |
| `fonts/bhn-bp-ecatherina-medium-20251128142613-8-1tw.otf` | https://w.ladicdn.com/6322a62f2dad980013bb5005/bhn-bp-ecatherina-medium-20251128142613-8-1tw.otf |
| `fonts/1ftv-vip-british-green-20251230052627-5a9cp.ttf` | https://w.ladicdn.com/6322a62f2dad980013bb5005/1ftv-vip-british-green-20251230052627-5a9cp.ttf |

## Các lớp chính

Canvas 420×590 của phần phong bì bám vị trí các phần tử gốc:

- Phong bì sau: x41.143, y158.124, rộng343.644, cao391.753.
- Giấy ren: x114.575, y127.1, rộng240.983, cao352.8.
- Dải ảnh: x53.143, y206.5, rộng99, cao248; nghiêng -11 độ.
- Mặt phong bì: x41.8115, y337.387, rộng336.377, cao206.62.
- Con dấu: x186.0095, y405, rộng57.3185, cao60.

Khi chạm: dấu sáp mờ, mặt phong bì xoay -115 độ trong phối cảnh, giấy và ảnh trượt lên. Sau 1,9 giây màn đầu chuyển vào trang thiệp, rồi kết thúc chuyển cảnh sau 650ms. Phần nội dung được giữ inert đến hết chuyển cảnh. Với reduced motion, bỏ thời gian chờ hiệu ứng.

Trang 1 tiếp tục bố cục giấy mời đang mở với ngày/tên và đếm ngược. Trang 2 là ảnh cưới lớn. Các phần bên dưới dùng giấy trắng và mực xanh lá; bỏ phần kể chuyện tình yêu/Our Story.

## Cập nhật tông xanh theo yêu cầu

Bố cục Chinh–Linh giữ nguyên. Phong bì và dấu sáp dùng CSS hue-rotate/saturate/brightness để chuyển sang xanh lá trầm; nền giấy, chữ và nút đồng bộ trắng–xanh. Các bộ lọc chỉ áp dụng cho phong bì/dấu sáp, không áp cho ảnh cưới hay QR ngân hàng.

Hai cụm hoa trắng/lá xanh dùng đúng artwork của mẫu https://jmiiwedding.com/duyanhhamauu:

- `public/images/floral-white/flowers-left.png`: https://w.ladicdn.com/s450x600/6322a62f2dad980013bb5005/group-4-copyd-20260824201522-rmr0p.png
- `public/images/floral-white/flowers-right.png`: https://w.ladicdn.com/s450x650/6322a62f2dad980013bb5005/group-5-copy-20260824202453-jngkz.png

## Điều chỉnh theo ảnh người dùng gửi

Trang 3 sử dụng `invitation-paper.png` làm giấy ren chứa tên/ngày giờ/địa điểm và hai chuỗi ngọc trai. Thông tin hai gia đình đặt phía trên. Hoa `floral-white/flowers-right.png` ở cạnh phải. Không dùng phần dress code.

Font hiện dùng Lora và Be Vietnam Pro qua các package Fontsource (có đầy đủ Vietnamese subset), được Vite đóng gói tại chỗ. Font Ecatherina trong bảng nguồn được nạp riêng với tên ClosingScript cho chữ “Thank you!” theo yêu cầu mới. Các font còn lại trong bảng nguồn là tài nguyên tham chiếu lịch sử.

Phong thư cảm ơn cuối trang tái sử dụng các lớp phong bì/dấu sáp, chuyển xanh bằng CSS. Phong thư luôn mở sẵn, một ảnh cưới và dòng cảm ơn hiện ngay như ảnh tham chiếu thứ 4. Dấu sáp chỉ trang trí; không có thao tác mở/khép hay hướng dẫn bấm.

## Trang 0 đóng kín trên nền hoa lá

Hai tài nguyên từ mẫu Duy–Hà được lưu cục bộ:

- `images/floral-white/botanical-background.jpg`: https://w.ladicdn.com/s750x1100/6322a62f2dad980013bb5005/ed70c7df1022719d8aa47cdd8c78c38e-20260824202213-wu0j1.jpg
- `images/floral-white/closed-envelope.png`: https://w.ladicdn.com/s650x550/6322a62f2dad980013bb5005/fwf-20260824203514-hvfda.png

Trang 0 chỉ hiển thị bì thư ren đóng kín, hoa và dấu sáp trên nền hoa lá. Giấy mời, ảnh và phong bì mở ẩn cho đến khi bấm; khi mở, bì thư đóng xoay/mờ và giấy/ảnh hiện lên trước khi chuyển sang trang 1. Cơ chế khóa nội dung và thời gian chuyển cảnh giữ nguyên.
