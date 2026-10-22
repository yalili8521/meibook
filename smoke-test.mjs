// Edge-case assertions for util.js pure logic. Run: node smoke-test.mjs
import { pathToFileURL } from 'node:url'
const u = await import(pathToFileURL('src/util.js').href)
let failed = 0
const assert = (cond, msg) => {
  if (!cond) {
    console.error('FAIL: ' + msg)
    failed++
  }
}
// money
assert(u.fmt$(37400) === '$374', 'fmt$ whole: ' + u.fmt$(37400))
assert(u.fmt$(3550) === '$35.50', 'fmt$ cents: ' + u.fmt$(3550))
assert(u.fmt$(-2000) === '-$20', 'fmt$ negative: ' + u.fmt$(-2000))
assert(u.fmt$(123456700) === '$1,234,567', 'fmt$ thousands: ' + u.fmt$(123456700))
assert(u.parseMoney('300') === 30000, 'parseMoney int')
assert(u.parseMoney('35.5') === 3550, 'parseMoney decimal')
assert(u.parseMoney('-20') === -2000, 'parseMoney negative')
assert(u.parseMoney('abc') === null, 'parseMoney junk -> null')
assert(u.parseMoney('$1,200') === 120000, 'parseMoney symbols stripped')
// dates
assert(u.addDaysStr('2026-06-30', 1) === '2026-07-01', 'addDays month roll')
assert(u.addDaysStr('2026-01-01', -1) === '2025-12-31', 'addDays year roll back')
assert(u.addDaysStr('2024-02-28', 1) === '2024-02-29', 'leap year')
assert(u.weekdayCn('2026-06-12') === '周五', 'weekday: ' + u.weekdayCn('2026-06-12'))
assert(u.dateLabel(u.todayStr()) === '今天', 'dateLabel today')
assert(u.dateLabel(u.addDaysStr(u.todayStr(), 1)) === '明天', 'dateLabel tomorrow')
assert(u.monthOf('2026-06-12') === '2026-06', 'monthOf')
assert(u.shiftMonth('2026-01', -1) === '2025-12', 'shiftMonth year boundary')
assert(u.shiftMonth('2026-12', 1) === '2027-01', 'shiftMonth fwd year')
assert(u.monthLabel('2026-06') === '2026年6月', 'monthLabel')
// reminder template
const txt = u.buildReminder('{客户} {日期} {时间} {服务} {店名}', {
  name: '王小姐',
  dstr: u.addDaysStr(u.todayStr(), 1),
  time: '14:00',
  service: '美睫',
  studio: 'Mei Studio',
})
assert(txt === '王小姐 明天 14:00 美睫 Mei Studio', 'buildReminder: ' + txt)
// balance math (mirrors store.jsx balanceOf reduce)
const ledger = [
  { clientId: 'c1', type: 'topup', amount: 50000, bonus: 5000 },
  { clientId: 'c1', type: 'deduct', amount: 8800 },
  { clientId: 'c1', type: 'deduct', amount: 8800 },
  { clientId: 'c1', type: 'adjust', amount: -2000 },
  { clientId: 'c2', type: 'topup', amount: 99999, bonus: 0 },
]
const bal = ledger.reduce(
  (s, e) =>
    e.clientId !== 'c1' ? s : e.type === 'topup' ? s + e.amount + (e.bonus || 0) : e.type === 'deduct' ? s - e.amount : s + e.amount,
  0
)
assert(bal === 35400, 'balance math: ' + bal)
console.log(failed ? `${failed} ASSERTIONS FAILED` : 'ALL 21 ASSERTIONS PASSED')
process.exit(failed ? 1 : 0)
