import {test,expect} from '@playwright/test'
import {PNG} from 'pngjs'
import jsQR from 'jsqr'

async function openGate(page) {
 await page.locator('#envelope-seal').click()
 await expect(page.locator('#entry-gate')).toBeHidden()
 await expect(page.locator('#wedding-site')).toBeVisible()
}
async function enterWedding(page, url='/') {
 await page.emulateMedia({reducedMotion:'reduce'})
 await page.goto(url)
 await openGate(page)
}


const viewports=[
 {name:'small-phone',width:320,height:740},
 {name:'phone',width:375,height:812},
 {name:'phone-390',width:390,height:844},
 {name:'large-phone',width:430,height:932},
 {name:'tablet',width:768,height:1024},
 {name:'desktop',width:1440,height:900},
 {name:'large-desktop',width:1920,height:1080},
]
for(const size of viewports){
 test(`${size.name}: cover fits viewport and has no overflow`,async({page},testInfo)=>{
  await page.setViewportSize(size)
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto('/')
  await page.evaluate(()=>document.fonts.ready)
  await expect(page.locator('#wedding-site')).toBeHidden()
  const envelope=await page.locator('#entry-gate .entry-envelope-wrap').boundingBox()
  expect(envelope.x).toBeGreaterThanOrEqual(0)
  expect(envelope.x+envelope.width).toBeLessThanOrEqual(size.width)
  expect(envelope.y).toBeGreaterThan(0)
  expect(envelope.y+envelope.height).toBeLessThan(size.height)
  await page.screenshot({path:testInfo.outputPath('entry.png')})
  await openGate(page)
  await page.evaluate(()=>document.fonts.ready)
  await expect(page.locator('#hero-title')).toBeVisible()
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-copy')).opacity==='1')
  const layout=await page.evaluate(()=>{
   const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}
   return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:rect(document.querySelector('#hero-title')),date:rect(document.querySelector('.hero-date')),action:rect(document.querySelector('#explore-invitation')),hero:rect(document.querySelector('.hero')),photo:document.querySelector('.hero .photo-strip img').naturalWidth}
  })
  expect(layout.scrollWidth).toBe(layout.width)
  expect(layout.photo).toBeGreaterThan(0)
  for(const element of [layout.title,layout.date,layout.action]){
   expect(element.left).toBeGreaterThanOrEqual(0)
   expect(element.right).toBeLessThanOrEqual(size.width)
   expect(element.top).toBeGreaterThanOrEqual(0)
   expect(element.bottom).toBeLessThanOrEqual(size.height)
  }
  expect(layout.date.bottom).toBeLessThan(layout.title.top)
  expect(layout.date.bottom+20).toBeLessThan(layout.action.top)
  await page.screenshot({path:testInfo.outputPath('cover.png')})
  await testInfo.attach('Cover', {path:testInfo.outputPath('cover.png'),contentType:'image/png'})
  for(const section of ['#loi-moi','#ngay-chung-doi','#album','#xac-nhan','#loi-chuc']){
   await page.locator(section).scrollIntoViewIfNeeded()
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(size.width)
  }
  await expect(page.locator('#married > img')).toHaveCSS('border-top-left-radius','0px')
  await expect(page.locator('.arch-frame')).toHaveCount(0)
  const heading=await page.locator('.event-card h3').boundingBox()
  expect(heading.height).toBeLessThan(160)
  expect(errors).toEqual([])
 })
}

test('entry letter blocks content until click, opens once, and enters automatically',async({page},testInfo)=>{
 await page.setViewportSize({width:390,height:844})
 await page.goto('/?to=Bạn%20Ngọc#album')
 await page.evaluate(()=>document.fonts.ready)
 await expect(page.locator('#entry-gate')).toBeVisible()
 await expect(page.locator('#wedding-site')).toBeHidden()
 await page.keyboard.press('Escape')
 await page.waitForTimeout(300)
 await expect(page.locator('#wedding-site')).toBeHidden()
 await expect(page.locator('#envelope-seal')).toBeEnabled()
 await expect(page.locator('#invited-guest')).toHaveText('Bạn Ngọc')
 await page.locator('#envelope-seal').click()
 await expect(page.locator('#envelope-seal')).toBeDisabled()
 await expect(page.locator('#entry-gate .envelope')).toHaveClass(/is-open/)
 await page.waitForTimeout(1500)
 const letter=await page.locator('#entry-gate .letter').boundingBox()
 expect(letter.y).toBeGreaterThan(0)
 expect(letter.x).toBeGreaterThan(0)
 expect(letter.x+letter.width).toBeLessThanOrEqual(390)
 await page.screenshot({path:testInfo.outputPath('letter-opening.png')})
 await expect(page.locator('#entry-gate')).toBeHidden()
 await expect(page.locator('#wedding-site')).toBeVisible()
 await expect(page.locator('#hero-title')).toBeFocused()
 expect(await page.evaluate(()=>scrollY)).toBe(0)
 await page.reload()
 await expect(page.locator('#entry-gate')).toBeVisible()
 await expect(page.locator('#wedding-site')).toBeHidden()
})

test('album selects thumbnails, keeps a square feature, supports keyboard and lightbox',async({page})=>{
 await enterWedding(page)
 await page.locator('#album').scrollIntoViewIfNeeded()
 await expect(page.locator('.gallery-item')).toHaveCount(18)
 const square=await page.locator('#album-featured').boundingBox()
 expect(Math.abs(square.width-square.height)).toBeLessThan(1)
 await page.locator('.gallery-item').nth(5).click()
 await expect(page.locator('#album-featured-image')).toHaveAttribute('src',/57.webp$/)
 await expect(page.locator('.gallery-item[aria-pressed=true]')).toHaveCount(1)
 await expect(page.locator('#album-counter')).toHaveText('06 / 18')
 await page.keyboard.press('End')
 await expect(page.locator('#album-counter')).toHaveText('18 / 18')
 await page.locator('#album-next').click()
 await expect(page.locator('#album-counter')).toHaveText('01 / 18')
 await page.locator('#album-prev').click()
 await expect(page.locator('#album-counter')).toHaveText('18 / 18')
 await page.locator('.gallery-item').first().click()
 await page.locator('#album-featured').click()
 await expect(page.locator('#photo-counter')).toHaveText('01 / 18')
 await page.keyboard.press('ArrowLeft')
 await expect(page.locator('#photo-counter')).toHaveText('18 / 18')
 await page.keyboard.press('ArrowRight')
 await expect(page.locator('#photo-counter')).toHaveText('01 / 18')
 await expect(page.locator('#lightbox-image')).toBeVisible()
 await page.waitForFunction(()=>document.querySelector('#lightbox-image').naturalWidth>0)
 await page.keyboard.press('Escape')
 await expect(page.locator('#lightbox')).toBeHidden()
})

test('RSVP validates input, stores locally, and persists after reload',async({page})=>{
 await enterWedding(page)
 await page.locator('#xac-nhan').scrollIntoViewIfNeeded()
 await page.locator('#rsvp-form button').click()
 await expect(page.locator('#guest-name')).toBeFocused()
 await page.locator('#guest-name').fill('Bạn Minh')
 await page.locator('#guest-count').selectOption('3')
 await page.locator('#rsvp-form button').click()
 await expect(page.locator('#rsvp-result')).toContainText('chưa gửi đến cô dâu chú rể')
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tq-rsvp')).count)).toBe(3)
 await page.reload()
 await openGate(page)
 await expect(page.locator('#guest-name')).toHaveValue('Bạn Minh')
 await expect(page.locator('#guest-count')).toHaveValue('3')
 await page.locator('[name=attendance][value=no]').check()
 await expect(page.locator('#guest-count')).toBeDisabled()
 await page.locator('#rsvp-form button').click()
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tq-rsvp')).count)).toBe(0)
})

test('wish text is safe, survives reload, and gift links back to wishes',async({page})=>{
 await enterWedding(page)
 const message='<img src=x onerror=alert(1)> Hạnh phúc nhé!'
 await page.locator('#wish-name').fill('Bạn Lan')
 await page.locator('#wish-message').fill(message)
 await page.locator('#wish-form button').click()
 await expect(page.locator('.wish-card').first()).toContainText(message)
 await expect(page.locator('.wish-card img')).toHaveCount(0)
 await page.reload()
 await openGate(page)
 await expect(page.locator('.wish-card').first()).toContainText(message)
 await page.locator('#gift-button').click()
 await expect(page.locator('#gift-dialog')).toContainText('Techcombank')
 await expect(page.locator('#gift-account-number')).toHaveText('1905 0359 9540 16')
 await page.locator('#gift-to-wishes').click()
 await expect(page.locator('#wish-name')).toBeFocused()
})

test('calendar download contains correct UTC time and demo disclosure',async({page})=>{
 await enterWedding(page)
 const downloadPromise=page.waitForEvent('download')
 await page.locator('#save-date').click()
 const download=await downloadPromise
 expect(download.suggestedFilename()).toBe('thang-quynh-29-11-2026.ics')
 const stream=await download.createReadStream();let contents=''
 for await(const chunk of stream)contents+=chunk.toString()
 expect(contents).toContain('DTSTART:20261129T120000Z')
 expect(contents).toContain('Địa điểm đang là demo')
})

test('reduced motion reveals content and disabled storage produces honest error',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'})
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked')}})
 await enterWedding(page)
 await expect(page.locator('#loi-moi .reveal').first()).toHaveCSS('opacity','1')
 await page.locator('#guest-name').fill('Bạn An')
 await page.locator('#rsvp-form button').click()
 await expect(page.locator('#rsvp-result')).toContainText('Trình duyệt chưa cho phép lưu')
 await page.locator('#wish-name').fill('Bạn An')
 await page.locator('#wish-message').fill('Chúc mừng hai bạn!')
 await page.locator('#wish-form button').click()
 await expect(page.locator('#wish-result')).toContainText('Trình duyệt đang chặn lưu trữ')
})


test('background music plays only on user action and can be paused',async({page})=>{
 await enterWedding(page)
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','true')
 await page.locator('#music-toggle').click()
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','false')
 // On phones the music control is revealed after the cover.
 await page.locator('#loi-moi').scrollIntoViewIfNeeded()
 await page.locator('#music-toggle').click()
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','true')
 await expect(page.locator('#music-label')).toHaveText('Đang phát')
 await page.locator('#music-toggle').click()
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','false')
})


test('Chinh–Linh layout has green floral envelope, photo page two, and no story',async({page},testInfo)=>{
 await page.setViewportSize({width:420,height:800})
 await page.goto('/?to=Bạn%20Ngọc')
 await page.evaluate(()=>document.fonts.ready)
 await expect(page.locator('#invited-guest')).toHaveText('Bạn Ngọc')
 await expect(page.locator('#entry-gate .envelope-front img')).toHaveAttribute('src',/chinh-linh\/envelope-front.png$/)
 await expect(page.locator('#entry-gate .envelope-front img')).toHaveCSS('filter',/hue-rotate/)
 await expect(page.locator('#entry-gate .cover-bouquet')).toHaveAttribute('src',/floral-white\/flowers-left.png$/)
 await expect(page.locator('#entry-gate .cover-flower-right')).toHaveAttribute('src',/floral-white\/flowers-right.png$/)
 await page.screenshot({path:testInfo.outputPath('green-envelope.png')})
 await page.locator('#envelope-seal').click()
 await expect(page.locator('#entry-gate .envelope-front')).toHaveCSS('opacity','0.1')
 await expect(page.locator('#entry-gate')).toBeHidden()
 await expect(page.locator('.hero .paper-label')).toHaveText('SAVE THE DATE')
 await expect(page.locator('.hero .photo-strip img')).toHaveCount(2)
 await page.locator('#married').scrollIntoViewIfNeeded()
 await expect(page.locator('#married h2')).toHaveText('Getting Married')
 expect(await page.locator('#married img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true)
 await expect(page.locator('[id*=story],.our-story,.quote-band')).toHaveCount(0)
 await expect(page.locator('main')).not.toContainText('Our Story')
 const layout=await page.evaluate(()=>({book:document.querySelector('#wedding-site').getBoundingClientRect().width,pages:[...document.querySelectorAll('main > section')].slice(0,3).map(el=>el.id||el.className),fonts:document.fonts.check('400 16px Lora','Thuý Quỳnh')&&document.fonts.check('400 16px \"Be Vietnam Pro\"','Trân trọng kính mời')}))
 expect(layout.book).toBe(420)
 expect(layout.pages).toEqual(['hero','married','loi-moi'])
 expect(layout.fonts).toBe(true)
 await page.locator('#married').screenshot({path:testInfo.outputPath('page-two.png')})
})


test('groom QR scans from the rendered image, copies exact account, and downloads',async({page,context},testInfo)=>{
 await context.grantPermissions(['clipboard-read','clipboard-write'])
 await page.setViewportSize({width:390,height:844})
 await enterWedding(page)
 await page.locator('#gift-button').click()
 await expect(page.locator('#gift-dialog')).toBeVisible()
 await page.locator('#gift-qr').evaluate(img=>img.decode())
 const screenshot=await page.locator('#gift-qr').screenshot()
 const png=PNG.sync.read(screenshot),decoded=jsQR(new Uint8ClampedArray(png.data),png.width,png.height)
 expect(decoded?.data).toContain('970407')
 expect(decoded?.data).toContain('19050359954016')
 await page.locator('#copy-gift-account').click()
 await expect(page.locator('#gift-copy-result')).toHaveText('Đã sao chép số tài khoản.')
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('19050359954016')
 const downloadPromise=page.waitForEvent('download')
 await page.locator('#download-gift-qr').click()
 expect((await downloadPromise).suggestedFilename()).toBe('QR-nha-trai-Techcombank.png')
 for(const [width,height] of [[390,844],[320,740],[1440,900]]){
  await page.setViewportSize({width,height})
  const bounds=await page.locator('#gift-dialog').boundingBox()
  expect(bounds.x).toBeGreaterThanOrEqual(0)
  expect(bounds.x+bounds.width).toBeLessThanOrEqual(width)
  expect(bounds.y).toBeGreaterThanOrEqual(0)
  expect(bounds.y+bounds.height).toBeLessThanOrEqual(height)
  await page.screenshot({path:testInfo.outputPath(`gift-${width}.png`)})
 }
 await page.keyboard.press('Escape')
 await expect(page.locator('#gift-dialog')).toBeHidden()
})

test('blocked clipboard offers manual copy without claiming success',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('blocked'))}})})
 await enterWedding(page)
 await page.locator('#gift-button').click()
 await page.locator('#copy-gift-account').click()
 await expect(page.locator('#gift-copy-result')).toContainText('Chưa sao chép được')
 await expect(page.locator('#gift-account-number')).toHaveText('1905 0359 9540 16')
})


test('formal invitation keeps family details, event and green flowers inside the lace composition',async({page},testInfo)=>{
 await enterWedding(page)
 await expect(page.locator('main')).not.toContainText('Dress code')
 await expect(page.locator('.dress-code,.dress-swatches')).toHaveCount(0)
 for(const width of [320,390,600,1440]){
  await page.setViewportSize({width,height:900})
  await page.locator('#loi-moi').scrollIntoViewIfNeeded()
  await page.evaluate(()=>document.fonts.ready)
  await expect(page.locator('.families')).toContainText('Nguyễn Duy Toản')
  await expect(page.locator('.families')).toContainText('Lâm Viết Chung')
  await expect(page.locator('.event-card')).toContainText('19:00 · Chủ nhật')
  await expect(page.locator('.formal-flowers')).toHaveAttribute('src',/floral-white/)
  const bounds=await page.locator('.formal-card').boundingBox()
  for(const selector of ['.couple-names','.event-datetime','.event-location','.event-actions']){
   const content=await page.locator(selector).boundingBox()
   expect(content.x).toBeGreaterThan(bounds.x)
   expect(content.x+content.width).toBeLessThan(bounds.x+bounds.width)
   expect(content.y+content.height).toBeLessThan(bounds.y+bounds.height*.9)
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width)
  await page.locator('#loi-moi').screenshot({path:testInfo.outputPath(`formal-invitation-${width}.png`)})
 }
 await page.locator('#luu-ngay').scrollIntoViewIfNeeded()
 await expect(page.locator('#calendar .marked')).toHaveText('29')
 const marker=await page.locator('#calendar .marked').evaluate(el=>({shape:getComputedStyle(el,'::before').clipPath,color:getComputedStyle(el,'::before').backgroundColor}))
 expect(marker.shape).toMatch(/^path/)
 expect(marker.color).toBe('rgb(65, 91, 56)')
})

test('closing envelope is always open with one visible photo and no opening control',async({page},testInfo)=>{
 await enterWedding(page)
 await expect(page.locator('#loi-cam-on button')).toHaveCount(0)
 await expect(page.locator('#loi-cam-on')).not.toContainText('Chạm vào dấu sáp')
 const photo=page.locator('#closing-photo')
 for(const motion of ['reduce','no-preference']){
  await page.emulateMedia({reducedMotion:motion})
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900})
   await page.locator('#loi-cam-on').scrollIntoViewIfNeeded()
   await expect(photo).toBeVisible()
   await expect(photo.locator('img')).toHaveCount(1)
   await photo.locator('img').evaluate(img=>img.decode())
   const bounds=await photo.boundingBox(),envelope=await page.locator('#closing-envelope').boundingBox()
   expect(bounds.x).toBeGreaterThan(envelope.x)
   expect(bounds.x+bounds.width).toBeLessThan(envelope.x+envelope.width)
   expect(bounds.y).toBeGreaterThanOrEqual(envelope.y)
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width)
   if(motion==='reduce')await page.locator('#loi-cam-on').screenshot({path:testInfo.outputPath(`closing-${width}.png`)})
  }
 }
 await page.reload()
 await openGate(page)
 await page.locator('#loi-cam-on').scrollIntoViewIfNeeded()
 await expect(photo).toBeVisible()
})
