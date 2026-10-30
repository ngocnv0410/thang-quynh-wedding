import '@fontsource/be-vietnam-pro/300.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import '@fontsource/lora/500.css'
import './wedding.css'
import { initEntryGate } from './entry-gate.js'
import { renderIcons } from './icons.js'
import { initGuestbook } from './guestbook.js'
import { connectFirebaseWishes } from './firebase-wishes.js'
import { wedding } from './content.js'
import { countdownTo, calendarDays, calendarFile } from './utils.js'
renderIcons()
const $ = selector => document.querySelector(selector)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
let toastTimer
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4500) }
function openDialog(dialog) { dialog.showModal() }
function closeDialog(dialog) { dialog.close() }
document.querySelectorAll('dialog').forEach(dialog => {
 dialog.querySelector('[data-close]')?.addEventListener('click', () => closeDialog(dialog))
 dialog.addEventListener('click', event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) closeDialog(dialog) } })
})
const guest = new URLSearchParams(location.search).get('to')?.trim().slice(0, 80)
if (guest) document.querySelectorAll('[data-invited-guest]').forEach(el => { el.textContent = guest })
const music = $('#music')
function updateMusic() { const playing=!music.paused; $('#music-toggle').setAttribute('aria-pressed',String(playing)); $('#music-toggle').setAttribute('aria-label',playing?'Tắt nhạc nền':'Bật nhạc nền'); $('#music-label').textContent=playing?'Đang phát':'Bật nhạc' }
async function playMusic() { try { music.volume=.4; await music.play() } catch { toast('Chạm nút nhạc để bật giai điệu cho ngày vui.') } updateMusic() }
$('#music-toggle').addEventListener('click', () => { if(music.paused) playMusic(); else music.pause() })
;['play','pause','ended'].forEach(event => music.addEventListener(event, updateMusic))
music.addEventListener('error', () => toast('Nhạc chưa tải được. Bạn có thể thử lại sau nhé.'))
$('#venue-name').textContent=wedding.venue.name
$('#venue-address').textContent=wedding.venue.address
$('#map-link').href=wedding.venue.mapsUrl
calendarDays(2026,11).forEach(day => { const el=document.createElement('span'); el.textContent=day??''; if(day===29){el.className='marked';el.setAttribute('aria-label','29 tháng 11, ngày tiệc cưới')} $('#calendar').append(el) })
const units=['NGÀY','GIỜ','PHÚT','GIÂY']
units.forEach(unit=>{const el=document.createElement('div');const n=document.createElement('strong');const label=document.createElement('span');label.textContent=unit;el.append(n,label);$('#countdown').append(el)})
function updateCountdown(){countdownTo(wedding.date).forEach((n,i)=>$('#countdown').children[i].firstChild.textContent=String(n).padStart(2,'0'));if(Date.now()>=new Date(wedding.date).getTime())$('#countdown-label').textContent='NGÀY HẠNH PHÚC ĐÃ ĐẾN ♡'}
updateCountdown();setInterval(updateCountdown,1000)
$('#save-date').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([calendarFile(wedding)],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='thang-quynh-29-11-2026.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Đã tải lịch tiệc cưới tại Nhà văn hoá thôn 3 Công Đình.')})
let currentPhoto=0
function selectAlbumPhoto(index, scrollThumbnail=false) {
 currentPhoto=(index+wedding.gallery.length)%wedding.gallery.length
 const src=`${import.meta.env.BASE_URL}images/${wedding.gallery[currentPhoto]}`
 const alt=`Ảnh cưới Duy Thắng và Thuý Quỳnh — khoảnh khắc ${currentPhoto+1}`
 $('#album-featured-image').src=src
 $('#album-featured-image').alt=alt
 $('#album-featured').setAttribute('aria-label',`Mở ảnh cưới ${currentPhoto+1} đầy đủ`)
 $('#album-counter').textContent=`${String(currentPhoto+1).padStart(2,'0')} / ${wedding.gallery.length}`
 const thumbs=[...document.querySelectorAll('.gallery-item')]
 thumbs.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===currentPhoto)))
 if(scrollThumbnail) {
  const thumb=thumbs[currentPhoto],strip=$('#gallery')
  strip.scrollTo?.({left:thumb.offsetLeft-strip.offsetLeft-(strip.clientWidth-thumb.clientWidth)/2,behavior:reduced.matches?'instant':'smooth'})
 }
}
function showPhoto(index){selectAlbumPhoto(index);$('#lightbox-image').src=$('#album-featured-image').src;$('#lightbox-image').alt=$('#album-featured-image').alt;$('#photo-counter').textContent=$('#album-counter').textContent}
wedding.gallery.forEach((file,i)=>{
 const button=document.createElement('button');button.className='gallery-item';button.setAttribute('aria-label',`Chọn ảnh cưới ${i+1}`)
 const img=new Image();img.src=`${import.meta.env.BASE_URL}images/${file}`;img.alt=`Khoảnh khắc ${i+1} của Thắng và Quỳnh`;img.loading='lazy';img.decoding='async';button.append(img)
 button.addEventListener('click',()=>selectAlbumPhoto(i,true))
 button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?wedding.gallery.length-1:currentPhoto+(event.key==='ArrowLeft'?-1:1);selectAlbumPhoto(next,true);$('#gallery').children[currentPhoto].focus({preventScroll:true})})
 $('#gallery').append(button)
})
selectAlbumPhoto(0)
$('#album-featured').addEventListener('click',()=>{showPhoto(currentPhoto);openDialog($('#lightbox'))})
$('#album-prev').addEventListener('click',()=>selectAlbumPhoto(currentPhoto-1,true))
$('#album-next').addEventListener('click',()=>selectAlbumPhoto(currentPhoto+1,true))
$('#photo-prev').addEventListener('click',()=>showPhoto(currentPhoto-1));$('#photo-next').addEventListener('click',()=>showPhoto(currentPhoto+1))
$('#lightbox').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')showPhoto(currentPhoto-1);if(event.key==='ArrowRight')showPhoto(currentPhoto+1)})
let touchStart=0
$('#lightbox-image').addEventListener('touchstart',event=>touchStart=event.changedTouches[0].clientX,{passive:true})
$('#lightbox-image').addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>50)showPhoto(currentPhoto+(delta<0?1:-1))},{passive:true})
initGuestbook({ connect: () => connectFirebaseWishes(import.meta.env) })
const groomGift = wedding.gift.groom
$('#gift-bank-name').textContent = groomGift.bankName
$('#gift-account-number').textContent = groomGift.accountNumber.match(/.{1,4}/g).join(' ')
$('#copy-gift-account').addEventListener('click', async () => {
 try {
  await navigator.clipboard.writeText(groomGift.accountNumber)
  $('#gift-copy-result').textContent = 'Đã sao chép số tài khoản.'
 } catch {
  $('#gift-copy-result').textContent = 'Chưa sao chép được. Bạn nhấn giữ số tài khoản để sao chép nhé.'
 }
})
$('#gift-button').addEventListener('click',()=>{
 $('#gift-copy-result').textContent = ''
 openDialog($('#gift-dialog'))
})
$('#gift-to-wishes').addEventListener('click',()=>{closeDialog($('#gift-dialog'));$('#loi-chuc').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});$('#wish-name').focus({preventScroll:true})})
let observer
if('IntersectionObserver' in window){document.body.classList.add('motion-ready');observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal:not([hidden])').forEach(el=>observer.observe(el))}
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){document.querySelectorAll('.tilt').forEach(el=>{el.addEventListener('pointermove',event=>{if(reduced.matches)return;const r=el.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1200px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-3px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}
if ('IntersectionObserver' in window) {
 const heroObserver = new IntersectionObserver(([entry]) => {
  document.body.classList.toggle('hero-in-view', entry.isIntersecting)
 }, { threshold: .2 })
 heroObserver.observe($('.hero'))
}

initEntryGate({ onOpen: playMusic })
