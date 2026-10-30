import { test, expect } from '@playwright/test'
import { PNG } from 'pngjs'
import jsQR from 'jsqr'

for (const [prefix, day, weekday, account, qr] of [
  ['nha-trai', '29', 'Chủ nhật', '19050359954016', 'qr-groom-techcombank.png'],
  ['nha-gai', '28', 'Thứ Bảy', '19036000582013', 'qr-bride-techcombank.png'],
]) {
  test(`${prefix}: direct entry, reload, dates, heart, countdown and downloadable calendar agree`, async ({ page }, testInfo) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.clock.setFixedTime(new Date('2026-11-27T11:00:00Z'))
    await page.goto(`/${prefix}/?to=Bạn%20Lan`)
    await expect(page.locator('#wedding-site')).toBeHidden()
    await expect(page.locator('#invited-guest')).toHaveText('Bạn Lan')
    await expect(page).toHaveTitle(`Duy Thắng & Thuý Quỳnh — ${day}.11.2026`)
    await page.locator('#envelope-seal').click()
    await expect(page.locator('#entry-gate')).toBeHidden()
    await expect(page.locator('.hero-date strong')).toHaveText(`${day} | 11 | 2026`)
    await expect(page.locator('#countdown strong').first()).toHaveText(day === '28' ? '01' : '02')
    await page.locator('#loi-moi').scrollIntoViewIfNeeded()
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.event-card h3')).toHaveText(`18:00 · ${weekday}`)
    await expect(page.locator('.event-datetime strong')).toHaveText(day)
    await page.locator('#loi-moi').screenshot({ path: testInfo.outputPath(`${prefix}-invitation.png`) })
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#save-date').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe(`thang-quynh-${day}-11-2026.ics`)
    let calendar = ''; for await (const chunk of await download.createReadStream()) calendar += chunk.toString()
    expect(calendar).toContain(`DTSTART:202611${day}T110000Z`)
    expect(calendar).toContain(`DTEND:202611${day}T140000Z`)
    expect(calendar).toContain(`UID:202611${day}-thang-quynh@wedding.local`)
    await page.locator('#luu-ngay').scrollIntoViewIfNeeded()
    await expect(page.locator('#calendar .marked')).toHaveText(day)
    await expect(page.locator('#calendar .marked')).toHaveAttribute('aria-label', `${day} tháng 11, ngày tiệc cưới`)
    await page.locator('#luu-ngay').screenshot({ path: testInfo.outputPath(`${prefix}-calendar.png`) })
    await expect(page.locator('.closing-date')).toHaveText(`${day}.11.2026`)
    await page.reload()
    await expect(page.locator('#wedding-site')).toBeHidden()
    await expect(page.locator('#entry-gate .entry-letter strong')).toHaveText(`${day} | 11 | 2026`)
    expect(errors).toEqual([])
  })

  test(`${prefix}: correct recipient, QR scans, exact account copy and correct downloaded PNG`, async ({ page, context }, testInfo) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/${prefix}/`)
    await page.locator('#envelope-seal').click()
    await expect(page.locator('#entry-gate')).toBeHidden()
    await page.locator('#gift-button').click()
    await expect(page.locator('.gift-side')).toHaveText(`MỪNG CƯỚI ${prefix === 'nha-gai' ? 'nhà gái' : 'nhà trai'}`)
    await expect(page.locator('#gift-bank-name')).toHaveText('Techcombank')
    await expect(page.locator('#gift-qr')).toHaveAttribute('src', `/images/${qr}`)
    await expect(page.locator('#gift-account-number')).toHaveText(account.match(/.{1,4}/g).join(' '))
    if (prefix === 'nha-gai') {
      await expect(page.locator('#gift-account-holder')).toHaveText('LAM THI THUY QUYNH')
      await expect(page.locator('#gift-account-holder')).toBeVisible()
    } else await expect(page.locator('#gift-account-holder')).toBeHidden()
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 })
      await page.locator('#gift-qr').evaluate(img => img.decode())
      const png = PNG.sync.read(await page.locator('#gift-qr').screenshot())
      const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
      expect(decoded?.data).toContain(account)
      expect(decoded?.data).toContain('970407')
      const box = await page.locator('#gift-dialog').boundingBox()
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
      expect(box.y + box.height).toBeLessThanOrEqual(844)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
      await page.screenshot({ path: testInfo.outputPath(`${prefix}-gift-${width}.png`) })
    }
    await page.locator('#copy-gift-account').click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(account)
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#download-gift-qr').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe(`QR-${prefix}-Techcombank.png`)
    const buffers = []; for await (const chunk of await download.createReadStream()) buffers.push(chunk)
    const png = PNG.sync.read(Buffer.concat(buffers))
    expect(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data).toContain(account)
  })
}
