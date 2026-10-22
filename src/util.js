// ---- ids ----
export const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2) + Date.now())

// ---- money (stored as integer cents) ----
export const fmt$ = (cents) => {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const dollars = Math.floor(abs / 100)
  const rem = abs % 100
  return rem === 0
    ? `${sign}$${dollars.toLocaleString()}`
    : `${sign}$${dollars.toLocaleString()}.${String(rem).padStart(2, '0')}`
}

export const parseMoney = (str) => {
  const n = parseFloat(String(str).replace(/[^0-9.\-]/g, ''))
  if (Number.isNaN(n)) return null
  return Math.round(n * 100)
}

// ---- dates (local, 'YYYY-MM-DD') ----
const pad = (n) => String(n).padStart(2, '0')

export const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const todayStr = () => toDateStr(new Date())

export const addDaysStr = (dstr, n) => {
  const [y, m, d] = dstr.split('-').map(Number)
  const dt = new Date(y, m - 1, d + n)
  return toDateStr(dt)
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const weekdayCn = (dstr) => {
  const [y, m, d] = dstr.split('-').map(Number)
  return WEEKDAYS[new Date(y, m - 1, d).getDay()]
}

// '2026-06-12' -> '今天' / '明天' / '昨天' / '6月12日 周五'
export const dateLabel = (dstr) => {
  const t = todayStr()
  if (dstr === t) return '今天'
  if (dstr === addDaysStr(t, 1)) return '明天'
  if (dstr === addDaysStr(t, -1)) return '昨天'
  const [, m, d] = dstr.split('-').map(Number)
  return `${m}月${d}日 ${weekdayCn(dstr)}`
}

export const longDateCn = (dstr) => {
  const [y, m, d] = dstr.split('-').map(Number)
  return `${y}年${m}月${d}日 · ${weekdayCn(dstr)}`
}

export const monthOf = (dstr) => dstr.slice(0, 7)

export const monthLabel = (mstr) => {
  const [y, m] = mstr.split('-').map(Number)
  return `${y}年${m}月`
}

export const shiftMonth = (mstr, n) => {
  const [y, m] = mstr.split('-').map(Number)
  const dt = new Date(y, m - 1 + n, 1)
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}`
}

export const makeTs = (dstr, time = '12:00') => new Date(`${dstr}T${time}:00`).getTime()

export const tsDateStr = (ts) => toDateStr(new Date(ts))

// ---- clipboard with fallback ----
export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }
}

// ---- reminder text ----
export const buildReminder = (tpl, { name, dstr, time, service, studio }) =>
  tpl
    .replaceAll('{客户}', name)
    .replaceAll('{日期}', dateLabel(dstr))
    .replaceAll('{时间}', time)
    .replaceAll('{服务}', service)
    .replaceAll('{店名}', studio)
