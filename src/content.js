// Toàn bộ dữ liệu cần thay đổi trước khi gửi thiệp chính thức.
export const wedding = {
  groom: 'Duy Thắng',
  bride: 'Thuý Quỳnh',
  // Giờ Việt Nam (UTC+7), không dùng múi giờ thiết bị khách.
  date: '2026-11-29T19:00:00+07:00',
  endDate: '2026-11-29T21:00:00+07:00',
  venue: {
    name: 'Tư gia nhà trai — Demo',
    address: 'Hoàn Kiếm, Hà Nội (địa chỉ minh hoạ)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hoan+Kiem+Ha+Noi',
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
  gallery: ['3.webp', '56.webp', '15.webp', '39.webp', '13.webp', '57.webp', '6.webp', '40.webp', '19.webp', '45.webp', '54.webp', '10.webp', '38.webp', '41.webp', '55.webp', '44.webp', '11.webp', '16.webp'],
  demoWishes: [
    { name: 'Một người bạn', message: 'Chúc hai bạn một đời bình an, một nhà đầy ắp tiếng cười và luôn nắm tay nhau qua mọi mùa yêu.', demo: true },
    { name: 'Người thương mến', message: 'Mong hai bạn luôn nhìn nhau bằng ánh mắt dịu dàng như hôm nay. Hạnh phúc thật nhiều nhé!', demo: true },
    { name: 'Gia đình & bạn bè', message: 'Trăm năm tình viên mãn, bạc đầu nghĩa phu thê. Chúc mừng ngày chung đôi của Thắng và Quỳnh!', demo: true },
  ],
}
