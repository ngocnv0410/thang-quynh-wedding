import { test, expect } from '@playwright/test'

async function enter(page) {
 await page.emulateMedia({ reducedMotion: 'reduce' })
 await page.goto('/')
 await page.locator('#envelope-seal').click()
 await expect(page.locator('#entry-gate')).toBeHidden()
 await page.locator('#loi-chuc').scrollIntoViewIfNeeded()
 await expect(page.locator('#wish-form button[type=submit]')).toBeEnabled()
}

test('Firebase saves and streams a wish to a second visitor and persists after reload', async ({ browser }, testInfo) => {
 const first = await browser.newContext({ viewport: { width: 390, height: 844 } })
 const second = await browser.newContext({ viewport: { width: 390, height: 844 } })
 const writer = await first.newPage(), reader = await second.newPage()
 await enter(writer); await enter(reader)
 const name = `Bạn Lan ${Date.now()}`, message = '<img src=x onerror=alert(1)> Chúc hai bạn hạnh phúc!'
 await writer.locator('#wish-name').fill(name)
 await writer.locator('#wish-message').fill(message)
 await writer.locator('#wish-form button[type=submit]').click()
 await expect(writer.locator('#wish-result')).toHaveText('Đã gửi lời chúc. Cảm ơn bạn thật nhiều!', { timeout: 20000 })
 await expect(reader.locator('.wish-card').filter({ hasText: name })).toContainText(message, { timeout: 20000 })
 await expect(reader.locator('.wish-card img')).toHaveCount(0)
 await reader.reload(); await reader.locator('#envelope-seal').click()
 await reader.locator('#loi-chuc').scrollIntoViewIfNeeded()
 await expect(reader.locator('.wish-card').filter({ hasText: name })).toContainText(message)
 await reader.locator('#loi-chuc').screenshot({ path: testInfo.outputPath('public-wishes-mobile.png') })
 await reader.setViewportSize({ width: 1440, height: 1000 })
 await reader.locator('#loi-chuc').screenshot({ path: testInfo.outputPath('public-wishes-desktop.png') })
 await writer.locator('#wish-name').fill(name)
 await writer.locator('#wish-message').fill('Thêm một lời chúc')
 await writer.locator('#wish-form button[type=submit]').click()
 await expect(writer.locator('#wish-result')).toContainText('Bạn đã gửi lời chúc')
 await first.close(); await second.close()
})
