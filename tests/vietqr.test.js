import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {PNG} from 'pngjs'
import jsQR from 'jsqr'
import {wedding} from '../src/content.js'
import {buildVietQR,crc16} from '../src/vietqr.js'
function parse(input){
 const fields={};let position=0
 while(position<input.length){
  const tag=input.slice(position,position+2),lengthText=input.slice(position+2,position+4)
  assert.match(tag,/^\d{2}$/);assert.match(lengthText,/^\d{2}$/)
  const end=position+4+Number(lengthText);assert.ok(end<=input.length)
  assert.equal(fields[tag],undefined)
  fields[tag]=input.slice(position+4,end);position=end
 }
 return fields
}
test('CRC uses the known CCITT-FALSE test vector',()=>assert.equal(crc16('123456789'),'29B1'))
test('invalid bank and account inputs cannot produce a transfer QR',()=>{
 assert.throws(()=>buildVietQR({bankBin:'TCB',accountNumber:'19050359954016'}))
 assert.throws(()=>buildVietQR({bankBin:'970407',accountNumber:'1905 0359 9540 16'}))
 assert.throws(()=>buildVietQR({bankBin:'970407',accountNumber:'123'}))
})
test('actual PNG scans to the exact requested Techcombank account, without a fixed amount',()=>{
 const png=PNG.sync.read(readFileSync(new URL('../public/images/qr-groom-techcombank.png',import.meta.url)))
 const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height)
 assert.ok(decoded,'The generated QR image must scan')
 assert.equal(decoded.data,buildVietQR(wedding.gift.groom))
 const fields=parse(decoded.data),merchant=parse(fields['38']),beneficiary=parse(merchant['01'])
 assert.equal(fields['00'],'01');assert.equal(fields['01'],'11')
 assert.equal(merchant['00'],'A000000727');assert.equal(merchant['02'],'QRIBFTTA')
 assert.equal(beneficiary['00'],'970407')
 assert.equal(beneficiary['01'],'19050359954016')
 assert.equal(fields['53'],'704');assert.equal(fields['58'],'VN')
 assert.equal(fields['54'],undefined);assert.equal(fields['62'],undefined)
 assert.equal(fields['63'],crc16(decoded.data.slice(0,-4)))
})
test('bride QR PNG scans to the new Techcombank account with a valid checksum and no fixed amount',()=>{
 const png=PNG.sync.read(readFileSync(new URL('../public/images/qr-bride-techcombank.png',import.meta.url)))
 const decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height)
 assert.ok(decoded)
 assert.equal(decoded.data,buildVietQR(wedding.gift.bride))
 const fields=parse(decoded.data),beneficiary=parse(parse(fields['38'])['01'])
 assert.equal(beneficiary['00'],'970407')
 assert.equal(beneficiary['01'],'19036000582013')
 assert.equal(fields['54'],undefined)
 assert.equal(fields['63'],crc16(decoded.data.slice(0,-4)))
})
