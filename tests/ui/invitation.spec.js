import {test,expect} from '@playwright/test'

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
  await expect(page.locator('#hero-title')).toBeVisible()
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-copy')).opacity==='1')
  const layout=await page.evaluate(()=>{
   const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}
   return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:rect(document.querySelector('#hero-title')),date:rect(document.querySelector('.hero-date')),action:rect(document.querySelector('#open-invitation')),hero:rect(document.querySelector('.hero')),photo:document.querySelector('.hero-photo img').naturalWidth}
  })
  expect(layout.scrollWidth).toBe(layout.width)
  expect(layout.photo).toBeGreaterThan(0)
  for(const element of [layout.title,layout.date,layout.action]){
   expect(element.left).toBeGreaterThanOrEqual(0)
   expect(element.right).toBeLessThanOrEqual(size.width)
   expect(element.top).toBeGreaterThanOrEqual(0)
   expect(element.bottom).toBeLessThanOrEqual(size.height)
  }
  expect(layout.title.bottom).toBeLessThan(layout.date.top)
  expect(layout.date.bottom+20).toBeLessThan(layout.action.top)
  await page.screenshot({path:testInfo.outputPath('cover.png')})
  await testInfo.attach('Cover', {path:testInfo.outputPath('cover.png'),contentType:'image/png'})
  for(const section of ['#loi-moi','#ngay-chung-doi','#album','#xac-nhan','#loi-chuc']){
   await page.locator(section).scrollIntoViewIfNeeded()
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(size.width)
  }
  const heading=await page.locator('.event-card h3').boundingBox()
  expect(heading.height).toBeLessThan(160)
  expect(errors).toEqual([])
 })
}

test('3D invitation opens, displays guest and date, closes with keyboard',async({page})=>{
 await page.setViewportSize({width:390,height:844})
 await page.goto('/?to=Bạn%20Ngọc')
 await page.locator('#open-invitation').click()
 await expect(page.locator('#invitation-dialog')).toBeVisible()
 await expect(page.locator('#continue-invitation')).toBeHidden()
 await page.locator('#envelope-seal').click()
 await expect(page.locator('.envelope')).toHaveClass(/is-open/)
 await expect(page.locator('#invited-guest')).toHaveText('Bạn Ngọc')
 await expect(page.locator('#continue-invitation')).toBeVisible()
 await page.waitForTimeout(1700)
 const letter=await page.locator('.letter').boundingBox()
 expect(letter.y).toBeGreaterThan(0)
 expect(letter.x).toBeGreaterThan(0)
 expect(letter.x+letter.width).toBeLessThanOrEqual(390)
 await page.keyboard.press('Escape')
 await expect(page.locator('#invitation-dialog')).toBeHidden()
 await expect(page.locator('#open-invitation')).toBeFocused()
})

test('gallery loads all 18 images, supports keyboard and closes',async({page})=>{
 await page.goto('/')
 await page.locator('#album').scrollIntoViewIfNeeded()
 await expect(page.locator('.gallery-item:visible')).toHaveCount(6)
 await page.locator('#more-photos').click()
 await page.locator('#more-photos').click()
 await expect(page.locator('.gallery-item:visible')).toHaveCount(18)
 await expect(page.locator('#more-photos')).toBeHidden()
 await page.locator('.gallery-item').first().click()
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
 await page.goto('/')
 await page.locator('#xac-nhan').scrollIntoViewIfNeeded()
 await page.locator('#rsvp-form button').click()
 await expect(page.locator('#guest-name')).toBeFocused()
 await page.locator('#guest-name').fill('Bạn Minh')
 await page.locator('#guest-count').selectOption('3')
 await page.locator('#rsvp-form button').click()
 await expect(page.locator('#rsvp-result')).toContainText('chưa gửi đến cô dâu chú rể')
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tq-rsvp')).count)).toBe(3)
 await page.reload()
 await expect(page.locator('#guest-name')).toHaveValue('Bạn Minh')
 await expect(page.locator('#guest-count')).toHaveValue('3')
 await page.locator('[name=attendance][value=no]').check()
 await expect(page.locator('#guest-count')).toBeDisabled()
 await page.locator('#rsvp-form button').click()
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('tq-rsvp')).count)).toBe(0)
})

test('wish text is safe, survives reload, and the gift panel states pending information',async({page})=>{
 await page.goto('/')
 const message='<img src=x onerror=alert(1)> Hạnh phúc nhé!'
 await page.locator('#wish-name').fill('Bạn Lan')
 await page.locator('#wish-message').fill(message)
 await page.locator('#wish-form button').click()
 await expect(page.locator('.wish-card').first()).toContainText(message)
 await expect(page.locator('.wish-card img')).toHaveCount(0)
 await page.reload()
 await expect(page.locator('.wish-card').first()).toContainText(message)
 await page.locator('#gift-button').click()
 await expect(page.locator('#gift-dialog')).toContainText('Thông tin đang được chuẩn bị')
 await page.locator('#gift-to-wishes').click()
 await expect(page.locator('#wish-name')).toBeFocused()
})

test('calendar download contains correct UTC time and demo disclosure',async({page})=>{
 await page.goto('/')
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
 await page.goto('/')
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
 await page.goto('/')
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','false')
 // On phones the music control is revealed after the cover.
 await page.locator('#loi-moi').scrollIntoViewIfNeeded()
 await page.locator('#music-toggle').click()
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','true')
 await expect(page.locator('#music-label')).toHaveText('Đang phát')
 await page.locator('#music-toggle').click()
 await expect(page.locator('#music-toggle')).toHaveAttribute('aria-pressed','false')
})
