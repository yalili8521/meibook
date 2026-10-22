import { useState } from 'react'
import Sheet from './Sheet.jsx'
import { useStore } from '../store.jsx'
import { parseMoney, fmt$ } from '../util.js'

const QUICK = [10000, 20000, 30000, 50000]

// mode='topup': money received + optional bonus. mode='adjust': signed correction
// (e.g. importing an old notebook balance, or fixing a mistake) — note required.
export default function TopUpSheet({ open, onClose, client, mode }) {
  const { actions } = useStore()
  const [amount, setAmount] = useState('')
  const [bonus, setBonus] = useState('')
  const [note, setNote] = useState('')

  const isTopup = mode === 'topup'
  const amt = parseMoney(amount)
  const bon = parseMoney(bonus || '0') || 0
  const canSave = amt !== null && amt !== 0 && (isTopup ? amt > 0 : note.trim().length > 0)

  const save = () => {
    if (!canSave) return
    if (isTopup) {
      actions.topup({
        clientId: client.id,
        amount: amt,
        bonus: bon,
        note: note.trim() || (bon > 0 ? `充${amt / 100}送${bon / 100}` : '充值'),
      })
    } else {
      actions.adjust({ clientId: client.id, amount: amt, note: note.trim() })
    }
    setAmount('')
    setBonus('')
    setNote('')
    onClose()
  }

  return (
    <Sheet open={open} title={isTopup ? `给 ${client?.name} 充值` : `调整 ${client?.name} 的余额`} onClose={onClose}>
      {isTopup ? (
        <div className="chips-row">
          {QUICK.map((q) => (
            <button key={q} className={'chip-btn' + (amt === q ? ' sel' : '')} onClick={() => setAmount(String(q / 100))}>
              {fmt$(q)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="row2">
        <div className="field">
          <label className="field-label">{isTopup ? '实收金额（$）*' : '调整金额（$，可负）*'}</label>
          <input
            className="input"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={isTopup ? '300' : '例：120 或 -20'}
          />
        </div>
        {isTopup ? (
          <div className="field">
            <label className="field-label">赠送金额（$）</label>
            <input className="input" inputMode="decimal" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="0" />
          </div>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label">{isTopup ? '备注（选填）' : '原因 *（例：旧本子余额导入）'}</label>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      {isTopup && amt > 0 ? (
        <div className="note-text">
          到账余额 +{fmt$(amt + bon)}（实收 {fmt$(amt)}{bon > 0 ? ` + 赠送 ${fmt$(bon)}` : ''}）
        </div>
      ) : null}

      <button className="btn btn-primary btn-block" disabled={!canSave} onClick={save}>
        {isTopup ? '确认充值' : '确认调整'}
      </button>
    </Sheet>
  )
}
