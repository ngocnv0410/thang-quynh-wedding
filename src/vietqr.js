// NAPAS VietQR transfer-to-account profile. No fixed amount or transfer message.
function tlv(tag, value) {
 if (value.length > 99) throw new Error('VietQR field is too long')
 return tag + String(value.length).padStart(2, '0') + value
}
export function crc16(input) {
 let crc = 0xffff
 for (const char of input) {
  crc ^= char.charCodeAt(0) << 8
  for (let bit = 0; bit < 8; bit++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
 }
 return crc.toString(16).toUpperCase().padStart(4, '0')
}
export function buildVietQR({bankBin, accountNumber}) {
 if (!/^\d{6}$/.test(bankBin)) throw new Error('Invalid bank BIN')
 if (!/^\d{6,19}$/.test(accountNumber)) throw new Error('Invalid account number')
 const beneficiary = tlv('00', bankBin) + tlv('01', accountNumber)
 const merchant = tlv('00', 'A000000727') + tlv('01', beneficiary) + tlv('02', 'QRIBFTTA')
 const payload = tlv('00', '01') + tlv('01', '11') + tlv('38', merchant) + tlv('53', '704') + tlv('58', 'VN') + '6304'
 return payload + crc16(payload)
}
