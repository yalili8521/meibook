import { useState } from 'react'
import Sheet from './Sheet.jsx'
import { useStore } from '../store.jsx'

// Add or edit a client. Pass `client` for edit mode.
export default function ClientForm({ open, onClose, client }) {
  const { actions } = useStore()
  const [name, setName] = useState(client?.name || '')
  const [wechat, setWechat] = useState(client?.wechat || '')
  const [phone, setPhone] = useState(client?.phone || '')
  const [note, setNote] = useState(client?.note || '')

  const save = () => {
    if (!name.trim()) return
    if (client) {
      actions.updateClient({ id: client.id, name: name.trim(), wechat: wechat.trim(), phone: phone.trim(), note: note.trim() })
    } else {
      actions.addClient({ name: name.trim(), wechat: wechat.trim(), phone: phone.trim(), note: note.trim() })
      setName('')
      setWechat('')
      setPhone('')
      setNote('')
    }
    onClose()
  }

  return (
    <Sheet open={open} title={client ? '编辑客户' : '添加客户'} onClose={onClose}>
      <div className="field">
        <label className="field-label">姓名 *</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="客户怎么称呼" />
      </div>
      <div className="row2">
        <div className="field">
          <label className="field-label">微信号</label>
          <input className="input" value={wechat} onChange={(e) => setWechat(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">电话</label>
          <input className="input" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label className="field-label">备注（过敏 / 偏好 / 来源…）</label>
        <textarea className="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <button className="btn btn-primary btn-block" disabled={!name.trim()} onClick={save}>
        保存
      </button>
    </Sheet>
  )
}
