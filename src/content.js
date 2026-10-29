// Toàn bộ dữ liệu cần thay đổi trước khi gửi thiệp chính thức.
export const wedding = {
  groom: 'Duy Thắng',
  bride: 'Thuý Quỳnh',
  // Giờ Việt Nam (UTC+7), không dùng múi giờ thiết bị khách.
  date: '2026-11-29T18:00:00+07:00',
  endDate: '2026-11-29T21:00:00+07:00',
  venue: {
    name: 'Nhà văn hoá thôn 3 Công Đình',
    address: 'Phù Đổng - Hà Nội',
    mapsUrl: 'https://maps.app.goo.gl/ndNBkdF58QADRr4o6?g_st=ic',
  },
  // Để trống khi chạy demo. Endpoint thật cần kiểm tra dữ liệu và giới hạn gửi phía server.
  rsvpEndpoint: '',
  gift: {
    groom: {
      bankName: 'Techcombank',
      bankBin: '970407',
      accountNumber: '19050359954016',
    },
  },
  gallery: ['3.webp', '4.webp', '6.webp', '10.webp', '11.webp', '12.webp', '17.webp'],
  demoWishes: [
    { name: 'Một người bạn', message: 'Chúc hai bạn một đời bình an, một nhà đầy ắp tiếng cười và luôn nắm tay nhau qua mọi mùa yêu.', demo: true },
    { name: 'Người thương mến', message: 'Mong hai bạn luôn nhìn nhau bằng ánh mắt dịu dàng như hôm nay. Hạnh phúc thật nhiều nhé!', demo: true },
    { name: 'Gia đình & bạn bè', message: 'Trăm năm tình viên mãn, bạc đầu nghĩa phu thê. Chúc mừng ngày chung đôi của Thắng và Quỳnh!', demo: true },
  ],
}
