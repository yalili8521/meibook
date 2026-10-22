import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, apptsOn, clientById, serviceById } from '../store.jsx'
import { todayStr, addDaysStr, longDateCn, fmt$, buildReminder, copyText } from '../util.js'
import ApptCard from '../components/ApptCard.jsx'
import CompleteSheet from '../components/CompleteSheet.jsx'
import ApptForm from '../components/ApptForm.jsx'
import { IconPlus, IconCopy, IconBell } from '../components/Icons.jsx'

function TomorrowReminder({ appt }) {
  const { state, actions } = useStore()
  const [copied, setCopied] = useState(false)
  const client = clientById(state, appt.clientId)
  const service = serviceById(state, appt.serviceId)

  const copy = async () => {
    const text = buildReminder(state.settings.remindTemplate, {
      name: client?.name || '您',
      dstr: appt.date,
      time: appt.time,
      service: service?.name || '服务',
      studio: state.settings.studioName,
    })
    if (await copyText(text)) {
      actions.markReminded(appt.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className="remind-row">
      <div className="remind-main">
        <span className="remind-name">
          {appt.time} · {client?.name}
        </span>
        <span className="remind-svc">{service?.name}</span>
      </div>
      <button className={'abtn' + (copied ? ' abtn-ok' : appt.reminded ? ' abtn-quiet' : ' abtn-primary')} onClick={copy}>
        <IconCopy size={15} />
        {copied ? '已复制 ✓' : appt.reminded ? '已提醒' : '复制提醒'}
      </button>
    </div>
  )
}

export default function Today() {
  const { state } = useStore()
  const [completing, setCompleting] = useState(null)
  const [adding, setAdding] = useState(false)

  const t = todayStr()
  const todayAppts = apptsOn(state, t)
  const tomorrowAppts = apptsOn(state, addDaysStr(t, 1)).filter((a) => a.status === 'booked')

  const activeCount = todayAppts.filter((a) => a.status === 'booked' || a.status === 'done').length
  const doneToday = todayAppts.filter((a) => a.status === 'done')
  const cashIn = doneToday.filter((a) => a.payMethod === 'cash' || a.payMethod === 'transfer').reduce((s, a) => s + a.price, 0)
  const cardBurn = doneToday.filter((a) => a.payMethod === 'card').reduce((s, a) => s + a.price, 0)

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">今日</h1>
        <div className="page-sub">
          {longDateCn(t)} · {state.settings.studioName}
        </div>
      </header>

      {state.settings.demo ? (
        <div className="demo-banner">
          正在浏览示例数据 — 到 <Link to="/settings">设置</Link> 一键清空，开始记录自己的生意
        </div>
      ) : null}

      <div className="stats-row">
        <div className="stat">
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">今日预约</div>
        </div>
        <div className="stat">
          <div className="stat-value">{fmt$(cashIn)}</div>
          <div className="stat-label">今日实收</div>
        </div>
        <div className="stat">
          <div className="stat-value">{fmt$(cardBurn)}</div>
          <div className="stat-label">今日耗卡</div>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">今天的安排</h2>
        {todayAppts.length === 0 ? (
          <div className="empty">今天还没有预约 — 点右下角 ＋ 添加</div>
        ) : (
          <div className="tl">
            {todayAppts.map((a) => (
              <ApptCard key={a.id} appt={a} onComplete={setCompleting} />
            ))}
          </div>
        )}
      </section>

      {tomorrowAppts.length > 0 ? (
        <section className="section">
          <h2 className="section-title">
            <IconBell size={16} /> 明日提醒（{tomorrowAppts.length}）
          </h2>
          <div className="card remind-card">
            {tomorrowAppts.map((a) => (
              <TomorrowReminder key={a.id} appt={a} />
            ))}
            <div className="note-text">点「复制提醒」→ 打开微信粘贴发给客人</div>
          </div>
        </section>
      ) : null}

      <button className="fab" aria-label="新预约" onClick={() => setAdding(true)}>
        <IconPlus size={26} />
      </button>

      {completing ? <CompleteSheet appt={completing} onClose={() => setCompleting(null)} /> : null}
      {adding ? <ApptForm open onClose={() => setAdding(false)} defaultDate={t} /> : null}
    </div>
  )
}
