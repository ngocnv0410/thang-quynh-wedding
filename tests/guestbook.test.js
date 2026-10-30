import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { initGuestbook } from '../src/guestbook.js'
import { readFirebaseConfig, validateWish } from '../src/firebase-wishes.js'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const flush = () => new Promise(resolve => setImmediate(resolve))
async function setup(send = async () => {}) {
 const dom = new JSDOM(html), doc = dom.window.document
 let onData, onError, reads = 0, unsubscribed = 0
 const store = { send, subscribe(data, error) { reads++; onData = data; onError = error; return () => { unsubscribed++ } } }
 const controller = initGuestbook({ root: doc, connect: async () => store })
 await controller.ready
 return { dom, doc, controller, data: (...args) => onData(...args), error: () => onError(new Error('offline')), get reads() { return reads }, get unsubscribed() { return unsubscribed } }
}
function submit(app, name = 'Bạn Lan', message = 'Chúc hai bạn hạnh phúc!') {
 app.doc.querySelector('#wish-name').value = name
 app.doc.querySelector('#wish-message').value = message
 app.doc.querySelector('#wish-form').dispatchEvent(new app.dom.window.Event('submit', { cancelable: true }))
}

test('Firebase config requires the selected project and rejects demo projects in production', () => {
 assert.equal(readFirebaseConfig({}), null)
 const env = { VITE_FIREBASE_API_KEY: ' key ', VITE_FIREBASE_PROJECT_ID: 'demo-thang-quynh', VITE_FIREBASE_APP_ID: 'app' }
 assert.equal(readFirebaseConfig(env).authDomain, 'demo-thang-quynh.firebaseapp.com')
 assert.equal(readFirebaseConfig({ ...env, PROD: true }), null)
 assert.equal(readFirebaseConfig({ ...env, VITE_FIREBASE_PROJECT_ID: 'chosen-project', PROD: true }).projectId, 'chosen-project')
})
test('wish validation rejects blank/invisible content and oversized fields', () => {
 for (const wish of [{ name: '\u200b ', message: 'Hello' }, { name: 'Lan', message: '\u200b ' }, { name: 'x'.repeat(81), message: 'Hello' }, { name: 'Lan', message: 'x'.repeat(1001) }]) assert.throws(() => validateWish(wish))
 assert.deepEqual(validateWish({ name: ' Lan ', message: ' Hạnh phúc nhé! ' }), { name: 'Lan', message: 'Hạnh phúc nhé!' })
})
test('public wishes render safely from subscription with no HTML injection', async () => {
 const app = await setup(), payload = '<img src=x onerror=alert(1)>'
 app.data([{ name: payload, message: payload }])
 assert.equal(app.doc.querySelector('.wish-card p').textContent, payload)
 assert.equal(app.doc.querySelector('.wish-card img'), null)
 assert.equal(app.doc.querySelector('.wish-card h3').textContent, payload)
 app.controller.destroy(); assert.equal(app.unsubscribed, 1); app.dom.window.close()
})
test('pending send is not reported saved and double submit cannot create two writes', async () => {
 let resolve, writes = 0
 const pending = new Promise(done => { resolve = done })
 const app = await setup(async () => { writes++; await pending })
 submit(app); submit(app)
 assert.equal(writes, 1)
 assert.equal(app.doc.querySelector('#wish-name').value, 'Bạn Lan')
 assert.equal(app.doc.querySelector('#wish-result').textContent, '')
 resolve(); await flush()
 assert.match(app.doc.querySelector('#wish-result').textContent, /Đã gửi lời chúc/)
 assert.equal(app.doc.querySelector('#wish-name').value, '')
 app.controller.destroy(); app.dom.window.close()
})
test('write failure preserves the message and never falls back to localStorage', async () => {
 const app = await setup(async () => { throw new Error('network') })
 submit(app); await flush()
 assert.match(app.doc.querySelector('#wish-result').textContent, /Chưa gửi được/)
 assert.equal(app.doc.querySelector('#wish-message').value, 'Chúc hai bạn hạnh phúc!')
 assert.equal(app.doc.querySelector('#wish-form button').disabled, false)
 assert.equal(app.doc.querySelectorAll('.wish-card').length, 0)
 app.controller.destroy(); app.dom.window.close()
})
test('read error can retry and cache-only results do not claim a live connection', async () => {
 const app = await setup()
 app.error(); assert.equal(app.doc.querySelector('#retry-wishes').hidden, false)
 app.doc.querySelector('#retry-wishes').click(); assert.equal(app.reads, 2)
 app.data([], { fromCache: true }); assert.match(app.doc.querySelector('#wishes-status').textContent, /Đang kết nối/)
 app.data([]); assert.match(app.doc.querySelector('#wishes-status').textContent, /đầu tiên/)
 app.controller.destroy(); app.dom.window.close()
})
test('missing configuration disables sending and never shows fake wishes', async () => {
 const dom = new JSDOM(html), doc = dom.window.document
 const controller = initGuestbook({ root: doc, connect: async () => { throw { code: 'guestbook/unconfigured' } } })
 await controller.ready
 assert.equal(doc.querySelector('#wish-form button').disabled, true)
 assert.equal(doc.querySelectorAll('.wish-card').length, 0)
 assert.match(doc.querySelector('#wishes-status').textContent, /đang được chuẩn bị/)
 controller.destroy(); dom.window.close()
})
test('a duplicate guest wish is explained without clearing their text', async () => {
 const app = await setup(async () => { throw { code: 'guestbook/already-sent' } })
 submit(app); await flush()
 assert.match(app.doc.querySelector('#wish-result').textContent, /Bạn đã gửi/)
 assert.equal(app.doc.querySelector('#wish-name').value, 'Bạn Lan')
 app.controller.destroy(); app.dom.window.close()
})
