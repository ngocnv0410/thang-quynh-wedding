// Inline SVG avoids platform/font-dependent missing glyphs in controls.
const paths = {
 'arrow-up-right': '<path d="M5 19 19 5M5 5h14v14"/>',
 'arrow-down-right': '<path d="m5 5 14 14M5 19h14V5"/>',
 'arrow-down': '<path d="M12 4v16m-6-6 6 6 6-6"/>',
 'arrow-up': '<path d="M12 20V4m-6 6 6-6 6 6"/>',
 'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
 'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
 copy: '<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M15 5V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1"/>',
 plus: '<path d="M12 5v14M5 12h14"/>',
 heart: '<path d="m12 20-8.3-8.2A5 5 0 0 1 12 5a5 5 0 0 1 8.3 6.8Z"/>',
 close: '<path d="m6 6 12 12M6 18 18 6"/>',
 pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
}
export function renderIcons(root = document) {
 root.querySelectorAll('[data-icon]').forEach(el => {
  const path = paths[el.dataset.icon]
  if (path) el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`
 })
}
