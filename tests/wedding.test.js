import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'
import { wedding } from '../src/content.js'
import * as utils from '../src/utils.js'
import { renderIcons } from '../src/icons.js'
import { initEntryGate } from '../src/entry-gate.js'

test('Countdown uses Vietnam time and never becomes negative', () => {
 assert.equal(new Date(wedding.date).toISOString(), '2026-11-29T11:00:00.000Z')
 assert.deepEqual(utils.countdownTo(wedding.date, Date.parse('2026-11-28T10:58:57Z')), [1,0,1,3])
 assert.deepEqual(utils.countdownTo(wedding.date, Date.parse('2026-11-30T00:00:00Z')), [0,0,0,0])
})
test('November calendar starts Sunday, marks the correct wedding date', () => {
 const days=utils.calendarDays(2026,11)
 assert.deepEqual(days.slice(0,7),[null,null,null,null,null,null,1])
 assert.equal(days.indexOf(29)%7,6)
 assert.equal(days.at(-1),30)
})
test('Calendar download has UTC event boundaries and the confirmed venue', () => {
 const ics=utils.calendarFile(wedding)
 assert.match(ics,/DTSTART:20261129T110000Z/)
 assert.match(ics,/DTEND:20261129T140000Z/)
 assert.match(ics,/SUMMARY:Tiệc cưới Duy Thắng & Thuý Quỳnh/)
 assert.match(ics,/LOCATION:Nhà văn hoá thôn 3 Công Đình - Phù Đổng - Hà Nội/)
 assert.doesNotMatch(ics,/demo|Hoàn Kiếm/i)
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
 win.scrollTo=()=>{}
 win.HTMLMediaElement.prototype.play=()=>Promise.resolve()
 win.HTMLMediaElement.prototype.pause=()=>{}
 let source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*\n/gm,'').replaceAll('import.meta.env.BASE_URL',"'/'").replaceAll('import.meta.env','({})')
 const ctx=dom.getInternalVMContext()
 ctx.initGuestbook=()=>({})
 ctx.wedding=wedding
 ctx.initEntryGate=options=>initEntryGate({...options,root:win.document,reducedMotion:()=>false,schedule:()=>0})
 ctx.renderIcons=(root=win.document)=>renderIcons(root)
 Object.assign(ctx,utils)
 // Browser localStorage is needed by storage utilities imported from Node.
 ctx.readStorage=(key,fallback)=>{try{return JSON.parse(win.localStorage.getItem(key))??fallback}catch{return fallback}}
 ctx.writeStorage=(key,value)=>{win.localStorage.setItem(key,JSON.stringify(value));return true}
 vm.runInContext(source,ctx)
 return {dom,win,doc:win.document}
}
test('Invitation personalizes safely; album selection and lightbox wrap around',async ()=>{
 const {dom,win,doc}=app()
 assert.equal(doc.querySelector('#invited-guest').textContent,'Bạn Ngọc')
 assert.equal(doc.querySelectorAll('.gallery-item').length,7)
 doc.querySelectorAll('.gallery-item')[3].click()
 assert.match(doc.querySelector('#album-featured-image').src,/3.webp$/)
 assert.equal(doc.querySelectorAll('.gallery-item[aria-pressed=true]').length,1)
 doc.querySelector('#album-prev').click()
 assert.match(doc.querySelector('#album-counter').textContent,/03 \/ 7/)
 doc.querySelectorAll('.gallery-item')[0].click()
 doc.querySelector('#album-featured').click()
 assert.ok(doc.querySelector('#lightbox').open)
 doc.querySelector('#photo-prev').click()
 assert.match(doc.querySelector('#photo-counter').textContent,/07 \/ 7/)
 doc.querySelector('#lightbox [data-close]').click()
 assert.equal(doc.querySelector('#lightbox').open,false)
 assert.ok(doc.querySelector('#wedding-site').hidden)
 doc.querySelector('#envelope-seal').click()
 assert.ok(doc.querySelector('.envelope').classList.contains('is-open'))
 await new Promise(resolve=>setImmediate(resolve))
 dom.window.close()
})
test('Every static image, audio, and gallery asset exists locally',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8')
 const media=[...html.matchAll(/(?:src|href|content)="(\/(?:images|audio)\/[^" ]+)"/g)].map(m=>m[1])
 for(const file of [...media,...wedding.gallery.map(f=>'/images/'+f)])assert.ok(existsSync(new URL('../public'+file,import.meta.url)),file)
 assert.ok(readFileSync(new URL('../public/audio/wedding.mp3',import.meta.url)).length>100000)
})


test('countdown handles the final second and exact ceremony time',()=>{
 const date=Date.parse(wedding.date)
 assert.deepEqual(utils.countdownTo(wedding.date,date-1000),[0,0,0,1])
 assert.deepEqual(utils.countdownTo(wedding.date,date),[0,0,0,0])
})
test('calendar correctly handles leap day and a Monday month start',()=>{
 const february=utils.calendarDays(2024,2)
 assert.equal(february.filter(Boolean).length,29)
 assert.equal(utils.calendarDays(2026,6)[0],1)
})
test('ICS escapes user-provided punctuation and newline in location',()=>{
 const file=utils.calendarFile({...wedding,venue:{address:'12, Hàng Đào; Hà Nội\nTầng 2'}})
 assert.ok(file.includes('LOCATION:12\\, Hàng Đào\\; Hà Nội\\nTầng 2'))
})
test('storage reads recover from broken JSON and inaccessible storage',()=>{
 assert.deepEqual(utils.readStorage('key',[],{getItem:()=>'{broken'}),[])
 assert.equal(utils.readStorage('key','fallback',{getItem:()=>null}),'fallback')
 assert.equal(utils.readStorage('key','fallback',{getItem:()=>{throw new Error('blocked')}}),'fallback')
 assert.deepEqual(utils.readStorage('key',[],{getItem:()=>'[1,2]'}),[1,2])
})
test('storage writes report quota failures without claiming success',()=>{
 const saved={}
 assert.equal(utils.writeStorage('key',{name:'Quỳnh'},{setItem:(key,value)=>saved[key]=value}),true)
 assert.equal(saved.key,'{"name":"Quỳnh"}')
 assert.equal(utils.writeStorage('key',{}, {setItem:()=>{throw new Error('quota')}}),false)
})


test('entry gate requires a click, opens only once, then unlocks and focuses the invitation',async()=>{
 const dom=new JSDOM(readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.test/'})
 const doc=dom.window.document;dom.window.scrollTo=()=>{}
 const tasks=[];let musicStarts=0
 const gate=initEntryGate({root:doc,reducedMotion:()=>false,onOpen:()=>{musicStarts++},schedule:(fn,ms)=>tasks.push({fn,ms})})
 assert.equal(gate.state,'closed');assert.ok(doc.querySelector('#wedding-site').hidden)
 assert.ok(doc.querySelector('#wedding-site').hasAttribute('inert'))
 assert.equal(tasks.length,0)
 doc.querySelector('#envelope-seal').click();gate.open()
 assert.equal(gate.state,'opening');assert.equal(musicStarts,1);assert.equal(tasks.length,1)
 assert.equal(tasks[0].ms,1900)
 assert.ok(doc.querySelector('#wedding-site').hidden)
 tasks.shift().fn()
 assert.equal(doc.querySelector('#wedding-site').hidden,false)
 assert.ok(doc.querySelector('#wedding-site').hasAttribute('inert'))
 assert.equal(tasks[0].ms,650)
 tasks.shift().fn()
 assert.equal(gate.state,'entered');assert.ok(doc.querySelector('#entry-gate').hidden)
 assert.equal(doc.querySelector('#wedding-site').hasAttribute('inert'),false)
 assert.equal(doc.activeElement.id,'hero-title')
 gate.open();assert.equal(musicStarts,1)
 dom.window.close()
})
test('reduced-motion entry uses no animation delay and audio failure never blocks entry',async()=>{
 const dom=new JSDOM(readFileSync(new URL('../index.html',import.meta.url),'utf8'))
 dom.window.scrollTo=()=>{}
 const tasks=[]
 const gate=initEntryGate({root:dom.window.document,reducedMotion:()=>true,onOpen:()=>Promise.reject(new Error('audio blocked')),schedule:(fn,ms)=>tasks.push({fn,ms})})
 gate.open()
 assert.equal(tasks[0].ms,0);tasks.shift().fn()
 assert.equal(tasks[0].ms,0);tasks.shift().fn()
 assert.equal(gate.state,'entered')
 await Promise.resolve();dom.window.close()
})
