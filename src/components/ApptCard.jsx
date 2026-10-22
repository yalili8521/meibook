import { useState } from 'react'
import { useStore, clientById, serviceById } from '../store.jsx'
import { fmt$, buildReminder, copyText } from '../util.js'
import { IconCheck, IconCopy, IconX } from './Icons.jsx'

const STATUS = {
  booked: { label: '已预约', cls: 'chip-booked' },
  done: { label: '已完成', cls: 'chip-done' },
  cancelled: { label: '已取消', cls: 'chip-cancelled' },
  noshow: { label: '爽约', cls: 'chip-noshow' },
}

const PAY = { card: '会员卡', cash: '现金', transfer: '转账' }

// One appointment row. Parent supplies onComplete (opens the pay sheet).
export default function ApptCard({ appt, onComplete }) {
  const { state, actions } = useStore()
  const [copied, setCopied] = useState(false)
  const client = clientById(state, appt.clientId)
  const service = serviceById(state, appt.serviceId)
  const st = STATUS[appt.status] || STATUS.booked
  const inactive = appt.status === 'cancelled' || appt.status === 'noshow'

  const copyReminder = async () => {
    const text = buildReminder(state.settings.remindTemplate, {
      name: client?.name || '您',
      dstr: appt.date,
      time: appt.time,
      service: service?.name || '服务',
      studio: state.settings.studioName,
    })
    const ok = await copyText(text)
    if (ok) {
      actions.markReminded(appt.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className={'appt' + (inactive ? ' appt-inactive' : '')}>
      <div className="appt-time">
        <span>{appt.time}</span>
        <small>{appt.durationMin}分钟</small>
      </div>
      <div className="appt-main">
        <div className="appt-line1">
          <span className="appt-name">{client?.name || '未知客户'}</span>
          <span className={'chip ' + st.cls}>
            {st.label}
            {appt.status === 'done' && appt.payMethod ? ` · ${PAY[appt.payMethod]}` : ''}
          </span>
        </div>
        <div className="appt-line2">
          <span className="appt-svc">{service?.name || '服务'}</span>
          <span className="appt-price">{fmt$(appt.price)}</span>
        </div>
        {appt.note ? <div className="appt-note">{appt.note}</div> : null}
        {appt.status === 'booked' ? (
          <div className="appt-actions">
            <button className="abtn abtn-primary" onClick={() => onComplete(appt)}>
              <IconCheck size={15} /> 完成
            </button>
            <button className={'abtn' + (copied ? ' abtn-ok' : '')} onClick={copyReminder}>
              <IconCopy size={15} /> {copied ? '已复制 ✓' : appt.reminded ? '再发提醒' : '提醒文案'}
            </button>
            <button
              className="abtn abtn-quiet"
              onClick={() => {
                if (confirm(`取消 ${client?.name || ''} ${appt.time} 的预约？`)) actions.cancelAppt(appt.id)
              }}
            >
              <IconX size={15} /> 取消
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
