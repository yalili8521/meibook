import { useState } from 'react'
import { useStore, clientById, serviceById } from '../store.jsx'
import { fmt$, todayStr, monthOf, monthLabel, shiftMonth, tsDateStr, dateLabel } from '../util.js'
import { IconBack, IconChevR } from '../components/Icons.jsx'

export default function Revenue() {
  const { state } = useStore()
  const [month, setMonth] = useState(monthOf(todayStr()))

  const doneAppts = state.appointments.filter((a) => a.status === 'done' && monthOf(a.date) === month)
  const topups = state.ledger.filter((e) => e.type === 'topup' && monthOf(tsDateStr(e.ts)) === month)

  const cashFromAppts = doneAppts.filter((a) => a.payMethod === 'cash' || a.payMethod === 'transfer').reduce((s, a) => s + a.price, 0)
  const topupCash = topups.reduce((s, e) => s + e.amount, 0)
  const topupBonus = topups.reduce((s, e) => s + (e.bonus || 0), 0)
  const cashIn = cashFromAppts + topupCash
  const serviceValue = doneAppts.reduce((s, a) => s + a.price, 0)
  const cardBurn = doneAppts.filter((a) => a.payMethod === 'card').reduce((s, a) => s + a.price, 0)

  // by-service bars
  const byService = {}
  for (const a of doneAppts) byService[a.serviceId] = (byService[a.serviceId] || 0) + a.price
  const bars = Object.entries(byService)
    .map(([sid, amt]) => ({ name: serviceById(state, sid)?.name || '其他', amt }))
    .sort((a, b) => b.amt - a.amt)
  const maxBar = bars.length ? bars[0].amt : 1

  // money timeline (appointments money + topups), newest first
  const events = [
    ...doneAppts.map((a) => ({
      key: 'a' + a.id,
      when: a.date,
      label: `${clientById(state, a.clientId)?.name || ''} · ${serviceById(state, a.serviceId)?.name || ''}`,
      tag: a.payMethod === 'card' ? '耗卡' : a.payMethod === 'cash' ? '现金' : '转账',
      amt: a.price,
      cash: a.payMethod !== 'card',
    })),
    ...topups.map((e) => ({
      key: 'l' + e.id,
      when: tsDateStr(e.ts),
      label: `${clientById(state, e.clientId)?.name || ''} · ${e.note || '充值'}`,
      tag: '充值',
      amt: e.amount,
      cash: true,
    })),
  ].sort((a, b) => b.when.localeCompare(a.when))

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">收入</h1>
        <div className="month-nav">
          <button className="mn-btn" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="上个月">
            <IconBack size={18} />
          </button>
          <span className="mn-label">{monthLabel(month)}</span>
          <button className="mn-btn" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="下个月">
            <IconChevR size={18} />
          </button>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat stat-hero">
          <div className="stat-value">{fmt$(cashIn)}</div>
          <div className="stat-label">本月实收</div>
        </div>
        <div className="stat">
          <div className="stat-value">{fmt$(serviceValue)}</div>
          <div className="stat-label">服务产值</div>
        </div>
        <div className="stat">
          <div className="stat-value">{fmt$(cardBurn)}</div>
          <div className="stat-label">耗卡</div>
        </div>
      </div>

      <div className="card stat-detail">
        <div className="sd-row">
          <span>服务现金/转账</span>
          <b>{fmt$(cashFromAppts)}</b>
        </div>
        <div className="sd-row">
          <span>会员卡充值实收</span>
          <b>{fmt$(topupCash)}</b>
        </div>
        <div className="sd-row">
          <span>充值赠送（成本）</span>
          <b>{fmt$(topupBonus)}</b>
        </div>
        <div className="sd-row">
          <span>完成服务</span>
          <b>{doneAppts.length} 单</b>
        </div>
      </div>

      {bars.length > 0 ? (
        <section className="section">
          <h2 className="section-title">服务构成（产值）</h2>
          <div className="card">
            {bars.map((b) => (
              <div key={b.name} className="bar-row">
                <span className="bar-label">{b.name}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: Math.max(6, Math.round((b.amt / maxBar) * 100)) + '%' }} />
                </span>
                <span className="bar-amt">{fmt$(b.amt)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <h2 className="section-title">本月明细</h2>
        <div className="card list-card">
          {events.length === 0 ? (
            <div className="empty">这个月还没有收入记录</div>
          ) : (
            events.map((e) => (
              <div key={e.key} className="ledger-row">
                <span className={'lr-ico ' + (e.tag === '充值' ? 'lr-topup' : e.tag === '耗卡' ? 'lr-deduct' : 'lr-cash')}>{e.tag}</span>
                <span className="lr-main">
                  <span className="lr-note">{e.label}</span>
                  <span className="lr-date">{dateLabel(e.when)}</span>
                </span>
                <span className={'lr-amt ' + (e.cash ? 'pos' : '')}>{fmt$(e.amt)}</span>
              </div>
            ))
          )}
        </div>
        <div className="note-text">
          口径：实收 = 现金/转账 + 充值实收；耗卡是会员卡抵扣的服务额（钱在充值时已经收过，不重复计入实收）。
        </div>
      </section>
    </div>
  )
}
