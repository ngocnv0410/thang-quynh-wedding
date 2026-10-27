# Artwork màn mở thư

Mẫu người dùng yêu cầu: https://jmiiwedding.com/duyanhhamauu/

Các lớp được lưu tại `public/images/opening/` để hiển thị ổn định, không phụ thuộc hotlink khi khách mở thiệp. Ảnh nền là ảnh của Thắng & Quỳnh, không dùng ảnh cặp đôi trong mẫu.

| Tệp | Nguồn trong mẫu |
| --- | --- |
| `letter.png` | https://w.ladicdn.com/s650x550/6322a62f2dad980013bb5005/fwf-20260824203514-hvfda.png |
| `flowers-left.png` | https://w.ladicdn.com/s450x600/6322a62f2dad980013bb5005/group-4-copyd-20260824201522-rmr0p.png |
| `flowers-right.png` | https://w.ladicdn.com/s450x650/6322a62f2dad980013bb5005/group-5-copy-20260824202453-jngkz.png |
| `seal.png` | https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/thiep-thanh-dat-element_0030_4-20251010171938-qfleq.png |
| `hand.png` | https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/fff-20250420034256-byv87.png |
| `public/fonts/hastegi.otf` | https://w.ladicdn.com/6322a62f2dad980013bb5005/1ftv-vip-hastegi-20250323075635-ymzdv.otf |
| `public/fonts/uvn-hoatay.ttf` | https://w.ladicdn.com/6322a62f2dad980013bb5005/uvnhoatay1-20250703082157-fl9kv.ttf |

Canvas tham chiếu: 420×765.178. Các toạ độ gốc dùng để kiểm tra:

| Lớp | X | Y | Rộng | Cao | Animation |
| --- | ---: | ---: | ---: | ---: | --- |
| Phong bì | 42.315 | 237.226 | 347 | 226.102 | Fade up 1s, delay 1s |
| Hoa trái | -5 | 173.86 | 133.149 | 255.374 | Fade up 1.5s, delay 1s |
| Hoa phải | 275.4 | 327.7 | 144.6 | 310.6 | Fade up 1.5s, delay 1.5s |
| Con dấu | 184.066 | 358.051 | 53.8684 | 63.949 | Pulse 1s, lặp |
| Bàn tay | 204.854 | 382.35 | 60.0447 | 60.701 | Bounce in 1s, lặp |

Tên khách và ngày tiệc được thay bằng nội dung của dự án. Trên desktop, canvas được phóng có giới hạn; trên điện thoại, canvas co theo màn hình nhưng giữ nguyên tỷ lệ và vị trí tương đối của các lớp. Sau thao tác mở thư, dự án giữ luồng chuyển tiếp vào thiệp cùng trang; không điều hướng sang website mẫu.
