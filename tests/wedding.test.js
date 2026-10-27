import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'
import { wedding } from '../src/content.js'
import * as utils from '../src/utils.js'

test('Countdown uses Vietnam time and never becomes negative', () => {
 assert.equal(new Date(wedding.date).toISOString(), '2026-11-29T12:00:00.000Z')
 assert.deepEqual(utils.countdownTo(wedding.date, Date.parse('2026-11-28T10:58:57Z')), [1,1,1,3])
 assert.deepEqual(utils.countdownTo(wedding.date, Date.parse('2026-11-30T00:00:00Z')), [0,0,0,0])
})
test('November calendar starts Sunday, marks the correct wedding date', () => {
 const days=utils.calendarDays(2026,11)
 assert.deepEqual(days.slice(0,7),[null,null,null,null,null,null,1])
 assert.equal(days.indexOf(29)%7,6)
 assert.equal(days.at(-1),30)
})
test('Calendar download has UTC event boundaries and demo location disclosure', () => {
 const ics=utils.calendarFile(wedding)
 assert.match(ics,/DTSTART:20261129T120000Z/)
 assert.match(ics,/DTEND:20261129T140000Z/)
 assert.match(ics,/SUMMARY:Tiệc cưới Duy Thắng & Thuý Quỳnh/)
 assert.match(ics,/Địa điểm đang là demo/)
 assert.ok(ics.endsWith('END:VCALENDAR\r\n'))
})
function app() {
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8')
 const dom=new JSDOM(html,{url:'https://example.test/?to=Bạn%20Ngọc',runScripts:'outside-only'})
 const win=dom.window
 win.matchMedia=()=>({matches:false})
 win.setInterval=()=>0
 win.setTimeout=()=>0
 win.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')}
 win.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new win.Event('close'))}
 win.HTMLElement.prototype.scrollIntoView=()=>{}
 win.HTMLMediaElement.prototype.play=()=>Promise.resolve()
 win.HTMLMediaElement.prototype.pause=()=>{}
 let source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*\n/gm,'').replaceAll('import.meta.env.BASE_URL',"'/'")
 const ctx=dom.getInternalVMContext()
 ctx.wedding=wedding
 Object.assign(ctx,utils)
 // Browser localStorage is needed by storage utilities imported from Node.
 ctx.readStorage=(key,fallback)=>{try{return JSON.parse(win.localStorage.getItem(key))??fallback}catch{return fallback}}
 ctx.writeStorage=(key,value)=>{win.localStorage.setItem(key,JSON.stringify(value));return true}
 vm.runInContext(source,ctx)
 return {dom,win,doc:win.document}
}
test('Invitation personalizes safely; gallery expands and wraps around',async ()=>{
 const {dom,win,doc}=app()
 assert.equal(doc.querySelector('#invited-guest').textContent,'Bạn Ngọc')
 assert.equal(doc.querySelectorAll('.gallery-item:not([hidden])').length,6)
 doc.querySelector('#more-photos').click()
 assert.equal(doc.querySelectorAll('.gallery-item:not([hidden])').length,12)
 doc.querySelector('.gallery-item').click()
 assert.ok(doc.querySelector('#lightbox').open)
 doc.querySelector('#photo-prev').click()
 assert.match(doc.querySelector('#photo-counter').textContent,/18 \/ 18/)
 doc.querySelector('#lightbox [data-close]').click()
 assert.equal(doc.querySelector('#lightbox').open,false)
 doc.querySelector('#open-invitation').click()
 assert.ok(doc.querySelector('#invitation-dialog').open)
 doc.querySelector('#envelope-seal').click()
 assert.ok(doc.querySelector('.envelope').classList.contains('is-open'))
 await new Promise(resolve=>setImmediate(resolve))
 dom.window.close()
})
test('RSVP stores attendance accurately and explicitly reports local demo',()=>{
 const {dom,win,doc}=app()
 doc.querySelector('#guest-name').value='Bạn Hà'
 doc.querySelector('[value=no]').checked=true
 doc.querySelector('#rsvp-form').dispatchEvent(new win.Event('submit',{cancelable:true}))
 const saved=JSON.parse(win.localStorage.getItem('tq-rsvp'))
 assert.equal(saved.name,'Bạn Hà');assert.equal(saved.count,0)
 assert.match(doc.querySelector('#rsvp-result').textContent,/chưa gửi đến cô dâu chú rể/)
 dom.window.close()
})
test('Guestbook renders untrusted guest text without HTML injection',()=>{
 const {dom,win,doc}=app()
 const payload='<img src=x onerror=alert(1)>'
 doc.querySelector('#wish-name').value=payload
 doc.querySelector('#wish-message').value=payload
 doc.querySelector('#wish-form').dispatchEvent(new win.Event('submit',{cancelable:true}))
 assert.equal(doc.querySelector('.wish-card p').textContent,payload)
 assert.equal(doc.querySelector('.wish-card img'),null)
 assert.equal(JSON.parse(win.localStorage.getItem('tq-wishes')).length,1)
 assert.match(doc.querySelector('#wish-result').textContent,/thiết bị/)
 dom.window.close()
})
test('Every static image, audio, and gallery asset exists locally',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8')
 const media=[...html.matchAll(/(?:src|href|content)="(\/(?:images|audio)\/[^" ]+)"/g)].map(m=>m[1])
 for(const file of [...media,...wedding.gallery.map(f=>'/images/'+f)])assert.ok(existsSync(new URL('../public'+file,import.meta.url)),file)
 assert.ok(readFileSync(new URL('../public/audio/wedding.mp3',import.meta.url)).length>100000)
})
