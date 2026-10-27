# Bố cục Chinh–Linh và màn mở

Tham chiếu mới nhất: https://jmiiwedding.com/chinhlinhh.

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

Trang 1 tiếp tục bố cục giấy mời đang mở với ngày/tên và đếm ngược. Trang 2 là ảnh cưới lớn. Các phần bên dưới dùng cùng màu giấy, mực đỏ và chữ của mẫu; bỏ phần kể chuyện tình yêu/Our Story.
