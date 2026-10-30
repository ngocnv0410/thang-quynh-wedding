import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { weddingForPath } from '../src/content.js'

const base = process.env.BASE_PATH || '/'
for (const prefix of ['', 'nha-trai', 'nha-gai']) {
  const file = prefix ? `${prefix}/index.html` : 'index.html'
  const html = readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8')
  const wedding = weddingForPath(`/${prefix}/`)
  assert.doesNotMatch(html, /__WEDDING_/)
  const dom = new JSDOM(html), doc = dom.window.document
  assert.equal(doc.querySelector('.event-datetime strong').textContent, String(wedding.day))
  assert.equal(doc.querySelector('.event-card h3').textContent, `18:00 · ${wedding.weekday}`)
  assert.ok(doc.title.includes(`${wedding.day}.11.2026`))
  assert.equal(doc.querySelector('#gift-qr').getAttribute('src'), `${base}images/${wedding.selectedGift.qrFile}`)
  // Deep links must use the deployment base, never resolve assets relative to /nha-gai/.
  for (const element of doc.querySelectorAll('[src],link[href],meta[property="og:image"]')) {
    const value = element.getAttribute('src') || element.getAttribute('href') || element.content
    assert.ok(value.startsWith(base), `Wrong asset base in ${file}: ${value}`)
    assert.ok(existsSync(new URL(`../dist/${value.slice(base.length)}`, import.meta.url)), `Missing built asset: ${value}`)
  }
  dom.window.close()
}
console.log('Verified root, /nha-trai/ and /nha-gai/ HTML, dates, metadata, QR and deployment asset paths.')
