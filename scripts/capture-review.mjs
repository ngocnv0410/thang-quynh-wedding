import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const output = process.env.REVIEW_DIR || 'artifacts/visual-review'
await mkdir(output, {recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox']})
for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5173/?to=Bạn%20Ngọc')
 await page.evaluate(()=>document.fonts.ready)
 await page.waitForTimeout(3300)
 await page.screenshot({path:`${output}/${device}-entry.png`})
 await page.locator('#envelope-seal').click()
 await page.waitForTimeout(1600)
 await page.screenshot({path:`${output}/${device}-letter-opening.png`})
 await page.waitForFunction(()=>document.querySelector('#entry-gate').hidden)
 await page.waitForTimeout(1000)
 await page.screenshot({path:`${output}/${device}-hero.png`})
 await page.emulateMedia({reducedMotion:'reduce'})
 for(const [section,id] of [['page-two','#married'],['invitation','#loi-moi'],['where-love-begins','#where-love-begins'],['timeline','#lich-trinh'],['calendar','#luu-ngay'],['event','#ngay-chung-doi'],['album','#album'],['rsvp','#xac-nhan'],['wishes','#loi-chuc'],['closing','#loi-cam-on']]) {
  await page.locator(id).scrollIntoViewIfNeeded()
  // A section screenshot can extend beyond the viewport: load its lazy photos first.
  await page.locator(id).evaluate(async section => {
   await Promise.all([...section.querySelectorAll('img')].filter(img=>!img.closest('[hidden]')).map(async img=>{img.loading='eager';await img.decode()}))
  })
  await page.waitForTimeout(1000)
  await page.locator(id).screenshot({path:`${output}/${device}-${section}.png`})
 }
 await page.locator('#loi-cam-on').screenshot({path:`${output}/${device}-closing-open.png`})
 const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,hero:document.querySelector('.hero').getBoundingClientRect().height}))
 console.log(device, JSON.stringify({dimensions,errors}))
 await page.close()
}
await browser.close()
