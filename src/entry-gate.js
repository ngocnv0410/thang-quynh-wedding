/** The invitation remains hidden and inert until an explicit click opens the letter. */
export function initEntryGate({
 root = document,
 reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
 onOpen = () => {},
 schedule = (callback, delay) => window.setTimeout(callback, delay),
} = {}) {
 const gate = root.querySelector('#entry-gate')
 const site = root.querySelector('#wedding-site')
 const trigger = root.querySelector('#envelope-seal')
 const envelope = gate.querySelector('.envelope')
 const status = root.querySelector('#entry-status')
 let state = 'closed'
 const finish = () => {
  gate.hidden = true
  gate.setAttribute('aria-hidden', 'true')
  site.inert = false
  site.removeAttribute('inert')
  site.removeAttribute('aria-hidden')
  root.body.classList.remove('entry-locked')
  state = 'entered'
  // Focus follows the visual transition, so keyboard users also enter the invitation.
  const title = root.querySelector('#hero-title')
  title.setAttribute('tabindex', '-1')
  title.focus({ preventScroll: true })
  root.defaultView?.scrollTo(0, 0)
 }
 const reveal = () => {
  site.hidden = false
  gate.classList.add('is-leaving')
  schedule(finish, reducedMotion() ? 0 : 650)
 }
 const open = () => {
  if (state !== 'closed') return
  state = 'opening'
  trigger.disabled = true
  envelope.classList.add('is-open')
  gate.classList.add('is-opening')
  status.textContent = 'Đang mở lời hẹn yêu thương…'
  // Music may fail independently; it must never prevent entry into the invitation.
  try { Promise.resolve(onOpen()).catch(() => {}) } catch { /* continue opening */ }
  schedule(reveal, reducedMotion() ? 0 : 1900)
 }
 trigger.addEventListener('click', open)
 return { open, get state() { return state } }
}
