import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/great-vibes/400.css'
import './style.css'
import './refinement.css'
import { renderIcons } from './icons.js'
import { wedding } from './content.js'
import { countdownTo, calendarDays, calendarFile, readStorage, writeStorage } from './utils.js'
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
if (guest) $('#invited-guest').textContent = guest
let invitationTimer
$('#open-invitation').addEventListener('click', () => {
 clearTimeout(invitationTimer)
 $('.envelope').classList.remove('is-open')
 $('#envelope-seal').disabled = false
 $('#continue-invitation').hidden = true
 openDialog($('#invitation-dialog'))
})
$('#envelope-seal').addEventListener('click', () => {
 $('.envelope').classList.add('is-open'); $('#envelope-seal').disabled = true
 playMusic()
 invitationTimer = setTimeout(() => { $('#continue-invitation').hidden = false; $('#continue-invitation').focus() }, reduced.matches ? 0 : 1300)
})
$('#invitation-dialog').addEventListener('close', () => clearTimeout(invitationTimer))
$('#continue-invitation').addEventListener('click', () => { closeDialog($('#invitation-dialog')); $('#loi-moi').scrollIntoView({behavior:reduced.matches?'instant':'smooth'}) })
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
$('#save-date').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([calendarFile(wedding)],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='thang-quynh-29-11-2026.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Đã tải lịch. Địa điểm demo sẽ được cập nhật sau.')})
let currentPhoto=0
function showPhoto(index){currentPhoto=(index+wedding.gallery.length)%wedding.gallery.length;$('#lightbox-image').src=`${import.meta.env.BASE_URL}images/${wedding.gallery[currentPhoto]}`;$('#lightbox-image').alt=`Ảnh cưới Duy Thắng và Thuý Quỳnh — khoảnh khắc ${currentPhoto+1}`;$('#photo-counter').textContent=`${String(currentPhoto+1).padStart(2,'0')} / ${wedding.gallery.length}`}
wedding.gallery.forEach((file,i)=>{const button=document.createElement('button');button.className='gallery-item reveal';button.hidden=i>=6;button.setAttribute('aria-label',`Xem ảnh cưới ${i+1}`);const img=new Image();img.src=`${import.meta.env.BASE_URL}images/${file}`;img.alt=`Khoảnh khắc ${i+1} của Thắng và Quỳnh`;img.loading='lazy';img.decoding='async';button.append(img);const zoom=document.createElement('span');zoom.className='gallery-zoom';zoom.dataset.icon='arrow-up-right';button.append(zoom);button.addEventListener('click',()=>{showPhoto(i);openDialog($('#lightbox'))});$('#gallery').append(button)})
renderIcons($('#gallery'))
$('#more-photos').addEventListener('click',()=>{const hidden=[...document.querySelectorAll('.gallery-item[hidden]')];hidden.slice(0,6).forEach(el=>{el.hidden=false;observer?.observe(el)});if(hidden.length<=6)$('#more-photos').hidden=true})
$('#photo-prev').addEventListener('click',()=>showPhoto(currentPhoto-1));$('#photo-next').addEventListener('click',()=>showPhoto(currentPhoto+1))
$('#lightbox').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')showPhoto(currentPhoto-1);if(event.key==='ArrowRight')showPhoto(currentPhoto+1)})
let touchStart=0
$('#lightbox-image').addEventListener('touchstart',event=>touchStart=event.changedTouches[0].clientX,{passive:true})
$('#lightbox-image').addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>50)showPhoto(currentPhoto+(delta<0?1:-1))},{passive:true})
const savedRSVP=readStorage('tq-rsvp',null)
if(savedRSVP&&typeof savedRSVP.name==='string'){$('#guest-name').value=savedRSVP.name;$('#rsvp-result').textContent='Bạn đã lưu lời hẹn trên thiết bị này. Có thể cập nhật lại bên trên.'}
if (savedRSVP && ['yes','no'].includes(savedRSVP.attendance)) {
 $(`[name=attendance][value=${savedRSVP.attendance}]`).checked=true
 if (Number.isInteger(savedRSVP.count) && savedRSVP.count>=1 && savedRSVP.count<=5) $('#guest-count').value=String(savedRSVP.count)
 $('#guest-count').disabled=savedRSVP.attendance==='no'
}
const attendanceRadios=document.querySelectorAll('[name=attendance]')
attendanceRadios.forEach(input=>input.addEventListener('change',()=>{$('#guest-count').disabled=$('[name=attendance]:checked').value==='no'}))
$('#rsvp-form').addEventListener('submit',async event=>{
 event.preventDefault();const data=new FormData(event.currentTarget);const name=String(data.get('name')||'').trim();if(!name){$('#guest-name').setCustomValidity('Bạn điền tên giúp chúng mình nhé.');$('#guest-name').reportValidity();return}
 const response={name,attendance:data.get('attendance'),count:data.get('attendance')==='yes'?Number(data.get('count')):0,createdAt:new Date().toISOString()}
 const submit=event.currentTarget.querySelector('[type=submit]');submit.disabled=true
 try {
  if(wedding.rsvpEndpoint){const r=await fetch(wedding.rsvpEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(response)});if(!r.ok)throw new Error('send');$('#rsvp-result').textContent='Cảm ơn bạn! Lời hẹn đã được gửi đến chúng mình.'}
  else{if(!writeStorage('tq-rsvp',response))throw new Error('storage');$('#rsvp-result').textContent=`Cảm ơn ${name}! Lời hẹn được lưu trên thiết bị này (demo), chưa gửi đến cô dâu chú rể.`}
 }catch{$('#rsvp-result').textContent=wedding.rsvpEndpoint?'Chưa gửi được lời hẹn. Bạn thử lại nhé.':'Trình duyệt chưa cho phép lưu. Bạn thử lại ở chế độ duyệt web thông thường nhé.'}finally{submit.disabled=false}
})
$('#guest-name').addEventListener('input',()=>$('#guest-name').setCustomValidity(''))
let wishes=readStorage('tq-wishes',[])
if(!Array.isArray(wishes))wishes=[]
wishes=wishes.filter(w=>w&&typeof w.name==='string'&&typeof w.message==='string').slice(0,30)
function renderWishes(){const list=$('#wishes');list.replaceChildren();[...wishes,...wedding.demoWishes].forEach(wish=>{const card=document.createElement('article');card.className='wish-card';const p=document.createElement('p');p.textContent=wish.message;const name=document.createElement('h3');name.textContent=wish.name;const label=document.createElement('small');label.textContent=wish.demo?'LỜI CHÚC MINH HOẠ':'LƯU TRÊN THIẾT BỊ NÀY';card.append(p,name,label);list.append(card)})}
renderWishes()
$('#wish-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const name=String(data.get('name')||'').trim().slice(0,80);const message=String(data.get('message')||'').trim().slice(0,1000);if(!name||!message){$('#wish-result').textContent='Bạn điền tên và lời chúc trước khi gửi nhé.';return}const next=[{name,message},...wishes].slice(0,30);if(!writeStorage('tq-wishes',next)){$('#wish-result').textContent='Chưa lưu được. Trình duyệt đang chặn lưu trữ.';return}wishes=next;renderWishes();event.currentTarget.reset();$('#wish-result').textContent='Đã lưu lời chúc trên thiết bị của bạn. Cảm ơn bạn thật nhiều!';toast('Đã lưu một chút yêu thương ♡')})
$('#gift-button').addEventListener('click',()=>openDialog($('#gift-dialog')))
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
