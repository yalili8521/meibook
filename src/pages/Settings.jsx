import { useRef, useState } from 'react'
import { useStore } from '../store.jsx'
import { fmt$, parseMoney, todayStr } from '../util.js'
import Sheet from '../components/Sheet.jsx'
import { IconDownload, IconUpload, IconPlus } from '../components/Icons.jsx'

function ServiceSheet({ service, onClose }) {
  const { actions } = useStore()
  const [name, setName] = useState(service?.name || '')
  const [price, setPrice] = useState(service ? String(service.price / 100) : '')
  const [duration, setDuration] = useState(service ? String(service.durationMin) : '60')
  const [active, setActive] = useState(service ? service.active : true)

  const canSave = name.trim() && parseMoney(price) !== null && parseInt(duration, 10) > 0

  const save = () => {
    if (!canSave) return
    const data = { name: name.trim(), price: parseMoney(price), durationMin: parseInt(duration, 10), active }
    if (service) actions.updateService({ id: service.id, ...data })
    else actions.addService(data)
    onClose()
  }

  return (
    <Sheet open title={service ? '编辑服务' : '添加服务'} onClose={onClose}>
      <div className="field">
        <label className="field-label">服务名称 *</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：美甲 · 单色" />
      </div>
      <div className="row2">
        <div className="field">
          <label className="field-label">价格（$）*</label>
          <input className="input" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">时长（分钟）*</label>
          <input className="input" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
      </div>
      <label className="check-row">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        在预约表单中可选
      </label>
      <button className="btn btn-primary btn-block" disabled={!canSave} onClick={save}>
        保存
      </button>
    </Sheet>
  )
}

export default function Settings() {
  const { state, actions } = useStore()
  const [editingSvc, setEditingSvc] = useState(null) // service object | 'new' | null
  const fileRef = useRef(null)

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `meibook-backup-${todayStr()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importBackup = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        const ok =
          data && data.schema === 1 && Array.isArray(data.clients) && Array.isArray(data.appointments) && Array.isArray(data.ledger)
        if (!ok) throw new Error('bad shape')
        if (confirm('导入会覆盖当前全部数据，确定？（建议先导出一份备份）')) {
          actions.importState(data)
          alert('导入成功 ✓')
        }
      } catch {
        alert('文件格式不对 — 请选择美簿导出的 .json 备份文件')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">设置</h1>
        <div className="page-sub">美簿 MeiBook v0.1</div>
      </header>

      <section className="section">
        <h2 className="section-title">我的店</h2>
        <div className="card pad-card">
          <div className="field">
            <label className="field-label">店名（出现在提醒消息里）</label>
            <input
              className="input"
              value={state.settings.studioName}
              onChange={(e) => actions.setSettings({ studioName: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-label">提醒消息模板</label>
            <textarea
              className="textarea"
              rows={4}
              value={state.settings.remindTemplate}
              onChange={(e) => actions.setSettings({ remindTemplate: e.target.value })}
            />
            <div className="note-text">可用变量：{'{客户} {日期} {时间} {服务} {店名}'}</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">服务项目与价目</h2>
        <div className="card list-card">
          {state.services.map((s) => (
            <button key={s.id} className="svc-row" onClick={() => setEditingSvc(s)}>
              <span className={'svc-name' + (s.active ? '' : ' svc-off')}>{s.name}</span>
              <span className="svc-meta">
                {fmt$(s.price)} · {s.durationMin}分钟{s.active ? '' : ' · 已停用'}
              </span>
            </button>
          ))}
          <button className="svc-row svc-add" onClick={() => setEditingSvc('new')}>
            <IconPlus size={16} /> 添加服务
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">数据</h2>
        <div className="card pad-card">
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={exportBackup}>
              <IconDownload size={17} /> 导出备份
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <IconUpload size={17} /> 导入备份
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) importBackup(e.target.files[0])
                e.target.value = ''
              }}
            />
          </div>
          <div className="note-text">
            数据只保存在这台手机/电脑的浏览器里（v0.1 没有云端）。请每周「导出备份」一次，文件存到微信收藏或网盘。
          </div>
          <button
            className="btn btn-danger btn-block"
            onClick={() => {
              if (confirm(state.settings.demo ? '清空示例数据，从零开始？' : '⚠️ 清空全部数据？建议先导出备份！')) {
                actions.resetBlank()
              }
            }}
          >
            {state.settings.demo ? '清空示例数据，开始使用' : '清空全部数据'}
          </button>
        </div>
      </section>

      <div className="footer-note">美簿 MeiBook · Auctura AI · 给一人美业工作室的小账本</div>

      {editingSvc ? <ServiceSheet service={editingSvc === 'new' ? null : editingSvc} onClose={() => setEditingSvc(null)} /> : null}
    </div>
  )
}
