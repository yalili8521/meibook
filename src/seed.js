import { todayStr, addDaysStr, makeTs } from './util.js'

export const DEFAULT_SETTINGS = {
  studioName: '我的工作室',
  remindTemplate:
    '{客户} 您好～提醒您{日期} {时间} 在 {店名} 有「{服务}」的预约，期待见到您 💕 如需改期请提前告诉我哦',
  demo: false,
}

export const DEFAULT_SERVICES = [
  { id: 's1', name: '美甲 · 单色', price: 3500, durationMin: 60, active: true },
  { id: 's2', name: '美甲 · 延长', price: 5500, durationMin: 90, active: true },
  { id: 's3', name: '卸甲', price: 1500, durationMin: 20, active: true },
  { id: 's4', name: '美睫 · 嫁接', price: 8800, durationMin: 120, active: true },
  { id: 's5', name: '美睫 · 补睫', price: 4500, durationMin: 60, active: true },
  { id: 's6', name: '剪发', price: 4000, durationMin: 45, active: true },
  { id: 's7', name: '染发', price: 12000, durationMin: 150, active: true },
]

export const blankState = () => ({
  schema: 1,
  settings: { ...DEFAULT_SETTINGS },
  services: DEFAULT_SERVICES.map((s) => ({ ...s })),
  clients: [],
  appointments: [],
  ledger: [],
})

// Demo data built relative to "today" so the first-run experience always looks current.
export const seedState = () => {
  const t = todayStr()
  const d = (n) => addDaysStr(t, n)

  const clients = [
    { id: 'c1', name: '王小姐', wechat: 'wang_xj', phone: '206-555-0101', note: '偏好裸粉色系，对胶过敏（用低敏胶）', createdAt: makeTs(d(-60)) },
    { id: 'c2', name: '陈 Linda', wechat: 'linda.c', phone: '425-555-0188', note: '', createdAt: makeTs(d(-45)) },
    { id: 'c3', name: '李美玲', wechat: 'mei_ling', phone: '', note: '朋友介绍（王小姐）', createdAt: makeTs(d(-30)) },
    { id: 'c4', name: 'Susan 张', wechat: 'susanz', phone: '206-555-0177', note: '', createdAt: makeTs(d(-28)) },
    { id: 'c5', name: '周阿姨', wechat: '', phone: '425-555-0150', note: '只说中文，喜欢上午时段', createdAt: makeTs(d(-25)) },
    { id: 'c6', name: 'Amy 吴', wechat: 'amywu', phone: '', note: '', createdAt: makeTs(d(-25)) },
  ]

  const appointments = [
    // today
    { id: 'a1', clientId: 'c3', serviceId: 's1', date: t, time: '10:00', durationMin: 60, price: 3500, payMethod: 'cash', status: 'done', reminded: true, note: '' },
    { id: 'a2', clientId: 'c1', serviceId: 's4', date: t, time: '13:30', durationMin: 120, price: 8800, payMethod: null, status: 'booked', reminded: true, note: '' },
    { id: 'a3', clientId: 'c2', serviceId: 's6', date: t, time: '16:00', durationMin: 45, price: 4000, payMethod: null, status: 'booked', reminded: false, note: '想剪短一点' },
    // tomorrow
    { id: 'a4', clientId: 'c5', serviceId: 's7', date: d(1), time: '11:00', durationMin: 150, price: 12000, payMethod: null, status: 'booked', reminded: false, note: '' },
    { id: 'a5', clientId: 'c6', serviceId: 's5', date: d(1), time: '14:00', durationMin: 60, price: 4500, payMethod: null, status: 'booked', reminded: false, note: '' },
    // history
    { id: 'a6', clientId: 'c1', serviceId: 's4', date: d(-12), time: '14:00', durationMin: 120, price: 8800, payMethod: 'card', status: 'done', reminded: true, note: '' },
    { id: 'a7', clientId: 'c1', serviceId: 's4', date: d(-2), time: '15:30', durationMin: 120, price: 8800, payMethod: 'card', status: 'done', reminded: true, note: '' },
    { id: 'a8', clientId: 'c5', serviceId: 's5', date: d(-6), time: '11:00', durationMin: 60, price: 4500, payMethod: 'card', status: 'done', reminded: true, note: '' },
    { id: 'a9', clientId: 'c4', serviceId: 's2', date: d(-4), time: '13:00', durationMin: 90, price: 5500, payMethod: 'transfer', status: 'done', reminded: true, note: '' },
    { id: 'a10', clientId: 'c4', serviceId: 's3', date: d(-9), time: '10:30', durationMin: 20, price: 1500, payMethod: 'cash', status: 'done', reminded: true, note: '' },
  ]

  const ledger = [
    { id: 'l1', clientId: 'c1', type: 'topup', amount: 50000, bonus: 5000, apptId: null, ts: makeTs(d(-20), '12:00'), note: '充500送50' },
    { id: 'l2', clientId: 'c1', type: 'deduct', amount: 8800, bonus: 0, apptId: 'a6', ts: makeTs(d(-12), '16:00'), note: '美睫 · 嫁接' },
    { id: 'l3', clientId: 'c1', type: 'deduct', amount: 8800, bonus: 0, apptId: 'a7', ts: makeTs(d(-2), '17:30'), note: '美睫 · 嫁接' },
    { id: 'l4', clientId: 'c5', type: 'topup', amount: 30000, bonus: 3000, apptId: null, ts: makeTs(d(-15), '12:00'), note: '充300送30' },
    { id: 'l5', clientId: 'c5', type: 'deduct', amount: 4500, bonus: 0, apptId: 'a8', ts: makeTs(d(-6), '12:00'), note: '美睫 · 补睫' },
    { id: 'l6', clientId: 'c6', type: 'topup', amount: 20000, bonus: 2000, apptId: null, ts: makeTs(d(-25), '12:00'), note: '充200送20' },
  ]

  return {
    schema: 1,
    settings: { ...DEFAULT_SETTINGS, studioName: 'Mei 美甲美睫 Studio', demo: true },
    services: DEFAULT_SERVICES.map((s) => ({ ...s })),
    clients,
    appointments,
    ledger,
  }
}
