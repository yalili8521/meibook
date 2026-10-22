import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore, balanceOf } from '../store.jsx'
import { fmt$, tsDateStr, dateLabel } from '../util.js'
import MemberCard from '../components/MemberCard.jsx'
import TopUpSheet from '../components/TopUpSheet.jsx'
import ApptForm from '../components/ApptForm.jsx'
import ClientForm from '../components/ClientForm.jsx'
import CompleteSheet from '../components/CompleteSheet.jsx'
import ApptCard from '../components/ApptCard.jsx'
import { IconBack, IconEdit } from '../components/Icons.jsx'

const LEDGER_LABEL = { topup: '充值', deduct: '扣卡', adjust: '调整' }

export default function ClientDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { state } = useStore()
  const [sheet, setSheet] = useState(null) // 'topup' | 'adjust' | 'appt' | 'edit'
  const [tab, setTab] = useState('ledger')
  const [completing, setCompleting] = useState(null)

  const client = state.clients.find((c) => c.id === id)
  if (!client) {
    return (
      <div className="page">
        <div className="empty">客户不存在</div>
      </div>
    )
  }

  const balance = balanceOf(state, id)
  const entries = state.ledger.filter((e) => e.clientId === id).slice().sort((a, b) => b.ts - a.ts)
  const appts = state.appointments
    .filter((a) => a.clientId === id)
    .slice()
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

  return (
    <div className="page">
      <header className="page-head head-with-back">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="返回">
          <IconBack size={22} />
        </button>
        <h1 className="page-title">{client.name}</h1>
        <button className="back-btn" onClick={() => setSheet('edit')} aria-label="编辑">
          <IconEdit size={20} />
        </button>
      </header>

      <MemberCard client={client} balance={balance} studioName={state.settings.studioName} />

      <div className="action-row">
        <button className="btn btn-primary" onClick={() => setSheet('topup')}>
          充值
        </button>
        <button className="btn btn-ghost" onClick={() => setSheet('adjust')}>
          调整余额
        </button>
        <button className="btn btn-ghost" onClick={() => setSheet('appt')}>
          新预约
        </button>
      </div>

      {client.note ? <div className="card note-card">📝 {client.note}</div> : null}

      <div className="seg">
        <button className={'seg-btn' + (tab === 'ledger' ? ' active' : '')} onClick={() => setTab('ledger')}>
          卡记录（{entries.length}）
        </button>
        <button className={'seg-btn' + (tab === 'appts' ? ' active' : '')} onClick={() => setTab('appts')}>
          预约记录（{appts.length}）
        </button>
      </div>

      {tab === 'ledger' ? (
        <div className="card list-card">
          {entries.length === 0 ? (
            <div className="empty">还没有卡记录 — 充值后从这里开始</div>
          ) : (
            entries.map((e) => {
              const delta = e.type === 'topup' ? e.amount + (e.bonus || 0) : e.type === 'deduct' ? -e.amount : e.amount
              return (
                <div key={e.id} className="ledger-row">
                  <span className={'lr-ico lr-' + e.type}>{LEDGER_LABEL[e.type]}</span>
                  <span className="lr-main">
                    <span className="lr-note">{e.note || LEDGER_LABEL[e.type]}</span>
                    <span className="lr-date">{dateLabel(tsDateStr(e.ts))}</span>
                  </span>
                  <span className={'lr-amt ' + (delta >= 0 ? 'pos' : 'neg')}>
                    {delta >= 0 ? '+' : ''}
                    {fmt$(delta)}
                  </span>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="tl">
          {appts.length === 0 ? (
            <div className="empty">还没有预约记录</div>
          ) : (
            appts.map((a) => (
              <div key={a.id}>
                <div className="tl-date">{dateLabel(a.date)}</div>
                <ApptCard appt={a} onComplete={setCompleting} />
              </div>
            ))
          )}
        </div>
      )}

      {sheet === 'topup' || sheet === 'adjust' ? (
        <TopUpSheet open client={client} mode={sheet} onClose={() => setSheet(null)} />
      ) : null}
      {sheet === 'appt' ? <ApptForm open defaultClientId={client.id} onClose={() => setSheet(null)} /> : null}
      {sheet === 'edit' ? <ClientForm open client={client} onClose={() => setSheet(null)} /> : null}
      {completing ? <CompleteSheet appt={completing} onClose={() => setCompleting(null)} /> : null}
    </div>
  )
}
