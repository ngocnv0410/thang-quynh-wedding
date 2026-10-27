import QRCode from 'qrcode'
import { wedding } from '../src/content.js'
import { buildVietQR } from '../src/vietqr.js'
const destination = new URL('../public/images/qr-groom-techcombank.png', import.meta.url)
await QRCode.toFile(destination.pathname, buildVietQR(wedding.gift.groom), {
 errorCorrectionLevel:'M', margin:4, scale:8, color:{dark:'#000000',light:'#ffffff'},
})
console.log('Generated verified-format VietQR image for groom gift account.')
