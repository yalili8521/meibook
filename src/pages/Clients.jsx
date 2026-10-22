import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, balanceOf, lastVisitOf } from '../store.jsx'
import { fmt$, dateLabel } from '../util.js'
import ClientForm from '../components/ClientForm.jsx'
import { IconPlus, IconSearch, IconChevR } from '../components/Icons.jsx'

export default function Clients() {
  const { state } = useStore()
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)

  const list = state.clients
    .filter((c) => {
      const needle = q.trim().toLowerCase()
      if (!needle) return true
      return (
        c.name.toLowerCase().includes(needle) ||
        (c.wechat || '').toLowerCase().includes(needle) ||
        (c.phone || '').includes(needle)
      )
    })
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'zh'))

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">客户</h1>
        <div className="page-sub">{state.clients.length} 位客户</div>
      </header>

      <div className="search">
        <IconSearch size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜姓名 / 微信 / 电话" />
      </div>

      <div className="card list-card">
        {list.length === 0 ? (
          <div className="empty">{q ? '没找到匹配的客户' : '还没有客户 — 点右下角 ＋ 添加'}</div>
        ) : (
          list.map((c) => {
            const bal = balanceOf(state, c.id)
            const last = lastVisitOf(state, c.id)
            return (
              <Link key={c.id} to={`/clients/${c.id}`} className="client-row">
                <span className="avatar">{c.name.slice(0, 1)}</span>
                <span className="cr-main">
                  <span className="cr-name">{c.name}</span>
                  <span className="cr-sub">{last ? `上次到店 ${dateLabel(last.date)}` : '还没来过'}</span>
                </span>
                {bal !== 0 ? <span className={'balance-pill' + (bal < 0 ? ' neg' : '')}>{fmt$(bal)}</span> : null}
                <IconChevR size={18} />
              </Link>
            )
          })
        )}
      </div>

      <button className="fab" aria-label="添加客户" onClick={() => setAdding(true)}>
        <IconPlus size={26} />
      </button>

      {adding ? <ClientForm open onClose={() => setAdding(false)} /> : null}
    </div>
  )
}
