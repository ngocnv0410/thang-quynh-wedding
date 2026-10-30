import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { wedding, weddingForPath } from '../src/content.js'
import { renderInvitationHtml } from '../src/invitation-html.js'
import { countdownTo, calendarDays, calendarFile } from '../src/utils.js'

test('prefix selection works under GitHub Pages, with or without trailing slash and index.html', () => {
  for (const base of ['', '/thang-quynh-wedding']) {
    for (const suffix of ['', '/', '/index.html']) {
      assert.equal(weddingForPath(`${base}/nha-gai${suffix}`).side, 'bride')
      assert.equal(weddingForPath(`${base}/nha-trai${suffix}`).side, 'groom')
    }
  }
  for (const path of ['/', '/thang-quynh-wedding/', '/nha-gai-khac/', '/nha-gai/other']) {
    assert.equal(weddingForPath(path).side, 'groom')
  }
  assert.equal(weddingForPath('/').date, wedding.date)
  assert.equal(weddingForPath('/nha-gai/').selectedGift.accountNumber, '19036000582013')
  assert.equal(weddingForPath('/nha-gai/').selectedGift.accountHolder, 'LAM THI THUY QUYNH')
})

test('both HTML invitations include correct visible dates, weekdays, metadata and QR before JavaScript', () => {
  const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  for (const [prefix, day, weekday, qr] of [
    ['nha-trai', '29', 'Chủ nhật', 'qr-groom-techcombank.png'],
    ['nha-gai', '28', 'Thứ Bảy', 'qr-bride-techcombank.png'],
  ]) {
    const html = renderInvitationHtml(template, weddingForPath(`/${prefix}/`))
    assert.doesNotMatch(html, /__WEDDING_/)
    const dom = new JSDOM(html), doc = dom.window.document
    assert.equal(doc.documentElement.dataset.invitation, prefix)
    assert.match(doc.title, new RegExp(`${day}\\.11\\.2026`))
    assert.ok(doc.querySelector('meta[name=description]').content.includes(`${weekday}, ${day}.11.2026`))
    assert.ok(doc.querySelector('meta[property="og:description"]').content.includes(`${day}.11.2026`))
    assert.equal(doc.querySelector('.event-datetime strong').textContent, day)
    assert.equal(doc.querySelector('.event-card h3').textContent, `18:00 · ${weekday}`)
    assert.ok(doc.querySelector('.hero-date').textContent.startsWith(day))
    assert.equal(doc.querySelector('.closing-date').textContent, `${day}.11.2026`)
    assert.equal(doc.querySelector('#gift-qr').getAttribute('src'), `/images/${qr}`)
    assert.equal(doc.querySelector('#download-gift-qr').download, `QR-${prefix}-Techcombank.png`)
    dom.window.close()
  }
})

test('bride calendar, countdown and ICS use Saturday 28 November in Vietnam without overwriting groom data', () => {
  const bride = weddingForPath('/nha-gai/'), groom = weddingForPath('/nha-trai/')
  assert.equal(calendarDays(2026, 11).indexOf(bride.day) % 7, 5)
  assert.deepEqual(countdownTo(bride.date, Date.parse('2026-11-27T10:58:57Z')), [1, 0, 1, 3])
  assert.match(calendarFile(bride), /DTSTART:20261128T110000Z/)
  assert.match(calendarFile(bride), /DTEND:20261128T140000Z/)
  assert.match(calendarFile(bride), /UID:20261128-thang-quynh@wedding.local/)
  assert.match(calendarFile(groom), /UID:20261129-thang-quynh@wedding.local/)
  assert.equal(groom.date, wedding.date)
  assert.equal(groom.selectedGift.accountNumber, '19050359954016')
  assert.deepEqual(bride.venue, groom.venue)
  assert.deepEqual(bride.gallery, groom.gallery)
})
