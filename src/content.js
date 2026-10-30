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
  gift: {
    groom: {
      bankName: 'Techcombank',
      bankBin: '970407',
      accountNumber: '19050359954016',
      qrFile: 'qr-groom-techcombank.png',
    },
    bride: {
      bankName: 'Techcombank',
      bankBin: '970407',
      accountNumber: '19036000582013',
      accountHolder: 'LAM THI THUY QUYNH',
      qrFile: 'qr-bride-techcombank.png',
    },
  },
  gallery: ['4.webp', '11.webp', '17.webp', '3.webp', '6.webp', '10.webp', '12.webp'],
}

// Link cũ mặc định là nhà trai; hai prefix dùng chung nội dung và sổ lời chúc.
export function weddingForPath(pathname = '/') {
  const bride = /\/nha-gai(?:\/index\.html)?\/?$/.test(pathname)
  return {
    ...wedding,
    side: bride ? 'bride' : 'groom',
    prefix: bride ? 'nha-gai' : 'nha-trai',
    sideLabel: bride ? 'nhà gái' : 'nhà trai',
    day: bride ? 28 : 29,
    weekday: bride ? 'Thứ Bảy' : 'Chủ nhật',
    date: bride ? '2026-11-28T18:00:00+07:00' : wedding.date,
    endDate: bride ? '2026-11-28T21:00:00+07:00' : wedding.endDate,
    selectedGift: bride ? wedding.gift.bride : wedding.gift.groom,
  }
}
