import { validateWish } from './firebase-wishes.js'

export function initGuestbook({ root = document, connect }) {
 const $ = selector => root.querySelector(selector)
 const form = $('#wish-form'), button = form.querySelector('[type=submit]')
 const result = $('#wish-result'), status = $('#wishes-status'), list = $('#wishes'), retry = $('#retry-wishes')
 const label = $('#wish-submit-label')
 let store, unsubscribe, pending = false, permissionsBlocked = false, destroyed = false, generation = 0
 button.disabled = true

 function render(wishes) {
  list.replaceChildren()
  for (const wish of wishes) {
   if (typeof wish.name !== 'string' || typeof wish.message !== 'string') continue
   const article = root.createElement('article'), name = root.createElement('h3'), text = root.createElement('p')
   article.className = 'wish-card'
   name.textContent = wish.name
   text.textContent = wish.message
   article.append(text, name)
   list.append(article)
  }
 }
 function load() {
  unsubscribe?.()
  retry.hidden = true
  status.textContent = 'Đang tải lời chúc…'
  list.setAttribute('aria-busy', 'true')
  unsubscribe = store.subscribe((wishes, { fromCache = false } = {}) => {
   render(wishes)
   if (!fromCache) { permissionsBlocked = false; button.disabled = pending }
   list.setAttribute('aria-busy', String(fromCache))
   status.textContent = fromCache ? 'Đang kết nối để cập nhật lời chúc…' : wishes.length ? 'Những lời chúc dành cho chúng mình' : 'Hãy là người đầu tiên gửi lời chúc cho chúng mình nhé!'
  }, error => {
   list.setAttribute('aria-busy', 'false')
   permissionsBlocked = error.code === 'permission-denied'
   if (permissionsBlocked) button.disabled = true
   status.textContent = permissionsBlocked ? 'Sổ lời chúc đang được chuẩn bị. Bạn ghé lại sau nhé.' : 'Chưa tải được lời chúc. Bạn thử lại nhé.'
   retry.hidden = false
  })
 }
 async function start() {
  const request = ++generation
  try {
   const connected = await connect()
   if (destroyed || request !== generation) return
   store = connected
   button.disabled = false
   load()
  } catch (error) {
   if (destroyed || request !== generation) return
   list.setAttribute('aria-busy', 'false')
   status.textContent = error.code === 'guestbook/unconfigured' ? 'Sổ lời chúc đang được chuẩn bị. Bạn ghé lại sau nhé.' : 'Chưa kết nối được sổ lời chúc. Bạn thử lại nhé.'
   retry.hidden = error.code === 'guestbook/unconfigured'
  }
 }
 async function submit(event) {
  event.preventDefault()
  if (!store || pending || permissionsBlocked) return
  let wish
  try { wish = validateWish({ name: $('#wish-name').value, message: $('#wish-message').value }) }
  catch (error) { result.textContent = error.message; return }
  pending = true
  button.disabled = true
  form.setAttribute('aria-busy', 'true')
  label.textContent = 'ĐANG GỬI…'
  result.textContent = ''
  const waiting = setTimeout(() => { result.textContent = 'Đang chờ kết nối để hoàn tất. Bạn giữ trang mở thêm một chút nhé.' }, 12000)
  try {
   await store.send(wish)
   form.reset()
   result.textContent = 'Đã gửi lời chúc. Cảm ơn bạn thật nhiều!'
  } catch (error) {
   result.textContent = error.code === 'guestbook/already-sent' ? 'Bạn đã gửi lời chúc từ trình duyệt này. Cảm ơn bạn thật nhiều!' : 'Chưa gửi được lời chúc. Nội dung vẫn được giữ lại để bạn thử lần nữa.'
  } finally {
   clearTimeout(waiting)
   pending = false
   button.disabled = permissionsBlocked
   form.setAttribute('aria-busy', 'false')
   label.textContent = 'GỬI LỜI CHÚC'
  }
 }
 function retryLoad() { store ? load() : start() }
 form.addEventListener('submit', submit)
 retry.addEventListener('click', retryLoad)
 return {
  ready: start(),
  destroy() { destroyed = true; generation++; unsubscribe?.(); form.removeEventListener('submit', submit); retry.removeEventListener('click', retryLoad) },
 }
}
