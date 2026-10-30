import QRCode from 'qrcode'
import { wedding } from '../src/content.js'
import { buildVietQR } from '../src/vietqr.js'
for (const gift of Object.values(wedding.gift)) {
const destination = new URL(`../public/images/${gift.qrFile}`, import.meta.url)
await QRCode.toFile(destination.pathname, buildVietQR(gift), {
 errorCorrectionLevel:'M', margin:4, scale:8, color:{dark:'#000000',light:'#ffffff'},
})
}
console.log('Generated verified-format VietQR images for groom and bride gift accounts.')
