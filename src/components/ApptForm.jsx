import { useState } from 'react'
import Sheet from './Sheet.jsx'
import { useStore } from '../store.jsx'
import { todayStr, parseMoney, fmt$ } from '../util.js'

// New appointment. Supports picking an existing client or quick-adding a new one inline.
export default function ApptForm({ open, onClose, defaultDate, defaultClientId }) {
  const { state, actions } = useStore()
  const activeServices = state.services.filter((s) => s.active)

  const [clientId, setClientId] = useState(defaultClientId || '')
  const [newName, setNewName] = useState('')
  const [newWechat, setNewWechat] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState(defaultDate || todayStr())
  const [time, setTime] = useState('10:00')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')

  const isNew = clientId === '__new'
  const svc = state.services.find((s) => s.id === serviceId)

  const pickService = (id) => {
    setServiceId(id)
    const s = state.services.find((x) => x.id === id)
    if (s) setPrice((s.price / 100).toString())
  }

  const canSave =
    (isNew ? newName.trim() : clientId) && serviceId && date && time && parseMoney(price) !== null

  const save = () => {
    if (!canSave) return
    let cid = clientId
    if (isNew) {
      cid = actions.addClient({ name: newName.trim(), wechat: newWechat.trim() }).id
    }
    actions.addAppt({
      clientId: cid,
      serviceId,
      date,
      time,
      durationMin: svc ? svc.durationMin : 60,
      price: parseMoney(price),
      note: note.trim(),
    })
    onClose()
    // reset for next open
    setClientId(defaultClientId || '')
    setNewName('')
    setNewWechat('')
    setServiceId('')
    setPrice('')
    setNote('')
  }

  return (
    <Sheet open={open} title="新预约" onClose={onClose}>
      <div className="field">
        <label className="field-label">客户</label>
        <select className="select" value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="">选择客户…</option>
          {state.clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="__new">＋ 新客户</option>
        </select>
      </div>

      {isNew ? (
        <div className="row2">
          <div className="field">
            <label className="field-label">新客户姓名 *</label>
            <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="例：王小姐" />
          </div>
          <div className="field">
            <label className="field-label">微信号（选填）</label>
            <input className="input" value={newWechat} onChange={(e) => setNewWechat(e.target.value)} />
          </div>
        </div>
      ) : null}

      <div className="field">
        <label className="field-label">服务项目</label>
        <select className="select" value={serviceId} onChange={(e) => pickService(e.target.value)}>
          <option value="">选择服务…</option>
          {activeServices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {fmt$(s.price)} · {s.durationMin}分钟
            </option>
          ))}
        </select>
      </div>

      <div className="row2">
        <div className="field">
          <label className="field-label">日期</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">时间</label>
          <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label className="field-label">价格（$）</label>
          <input className="input" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
        </div>
        <div className="field">
          <label className="field-label">备注（选填）</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="客人偏好等" />
        </div>
      </div>

      <button className="btn btn-primary btn-block" disabled={!canSave} onClick={save}>
        保存预约
      </button>
    </Sheet>
  )
}
