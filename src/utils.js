export function countdownTo(date, now = Date.now()) {
 const remaining = Math.max(0, new Date(date).getTime() - now)
 const seconds = Math.floor(remaining / 1000)
 return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60]
}
export function calendarDays(year, month) {
 const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
 const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
 return [...Array(offset).fill(null), ...Array.from({length: days}, (_, i) => i + 1)]
}
export function calendarFile(wedding) {
 const stamp = date => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
 const escape = value => value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')
 return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thang Quynh//Wedding//VI', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:20261129-thang-quynh@wedding.local', 'DTSTAMP:20261027T000000Z', `DTSTART:${stamp(wedding.date)}`, `DTEND:${stamp(wedding.endDate)}`, `SUMMARY:${escape(`Tiệc cưới ${wedding.groom} & ${wedding.bride}`)}`, `LOCATION:${escape(wedding.venue.address)}`, 'DESCRIPTION:Địa điểm đang là demo. Vui lòng kiểm tra thiệp cập nhật trước khi đi.', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n')
}
export function readStorage(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
export function writeStorage(key, value) {
 try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}
