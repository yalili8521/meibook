import { useState } from 'react'
import { useStore, apptsOn } from '../store.jsx'
import { todayStr, addDaysStr, weekdayCn, dateLabel } from '../util.js'
import ApptCard from '../components/ApptCard.jsx'
import CompleteSheet from '../components/CompleteSheet.jsx'
import ApptForm from '../components/ApptForm.jsx'
import { IconPlus } from '../components/Icons.jsx'

export default function Schedule() {
  const { state } = useStore()
  const t = todayStr()
  const [selected, setSelected] = useState(t)
  const [completing, setCompleting] = useState(null)
  const [adding, setAdding] = useState(false)

  // 2 days back through 11 days ahead
  const days = Array.from({ length: 14 }, (_, i) => addDaysStr(t, i - 2))
  const dayAppts = apptsOn(state, selected)

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">预约</h1>
        <div className="page-sub">{dateLabel(selected)}</div>
      </header>

      <div className="strip">
        {days.map((d) => {
          const has = apptsOn(state, d).some((a) => a.status === 'booked')
          const [, , dayNum] = d.split('-')
          return (
            <button
              key={d}
              className={'strip-day' + (d === selected ? ' sel' : '') + (d === t ? ' today' : '')}
              onClick={() => setSelected(d)}
            >
              <span className="sd-w">{d === t ? '今' : weekdayCn(d).slice(1)}</span>
              <span className="sd-n">{Number(dayNum)}</span>
              {has ? <span className="sd-dot" /> : <span className="sd-dot sd-dot-empty" />}
            </button>
          )
        })}
      </div>

      <section className="section">
        {dayAppts.length === 0 ? (
          <div className="empty">这天还没有预约</div>
        ) : (
          <div className="tl">
            {dayAppts.map((a) => (
              <ApptCard key={a.id} appt={a} onComplete={setCompleting} />
            ))}
          </div>
        )}
      </section>

      <button className="fab" aria-label="新预约" onClick={() => setAdding(true)}>
        <IconPlus size={26} />
      </button>

      {completing ? <CompleteSheet appt={completing} onClose={() => setCompleting(null)} /> : null}
      {adding ? <ApptForm open onClose={() => setAdding(false)} defaultDate={selected} /> : null}
    </div>
  )
}
