import Sheet from './Sheet.jsx'
import { useStore, clientById, serviceById, balanceOf } from '../store.jsx'
import { fmt$ } from '../util.js'
import { IconCard, IconCash, IconSend } from './Icons.jsx'

// Choose how the finished appointment was paid. 扣卡 writes a ledger entry.
export default function CompleteSheet({ appt, onClose }) {
  const { state, actions } = useStore()
  if (!appt) return null
  const client = clientById(state, appt.clientId)
  const service = serviceById(state, appt.serviceId)
  const balance = balanceOf(state, appt.clientId)
  const enough = balance >= appt.price

  const pay = (method) => {
    actions.completeAppt(appt.id, method)
    onClose()
  }

  return (
    <Sheet open={!!appt} title="完成服务 · 收款" onClose={onClose}>
      <div className="pay-summary">
        <div className="pay-who">
          {client?.name} · {service?.name}
        </div>
        <div className="pay-amt">{fmt$(appt.price)}</div>
      </div>

      <button className="pay-btn pay-card" disabled={!enough} onClick={() => pay('card')}>
        <IconCard />
        <span className="pay-btn-main">
          扣会员卡
          <small>
            {enough
              ? `余额 ${fmt$(balance)} → 扣后 ${fmt$(balance - appt.price)}`
              : `余额不足（当前 ${fmt$(balance)}）— 先充值或选其他方式`}
          </small>
        </span>
      </button>
      <button className="pay-btn" onClick={() => pay('cash')}>
        <IconCash />
        <span className="pay-btn-main">
          现金<small>当面收款</small>
        </span>
      </button>
      <button className="pay-btn" onClick={() => pay('transfer')}>
        <IconSend />
        <span className="pay-btn-main">
          转账<small>Zelle / Venmo / 微信转账</small>
        </span>
      </button>
    </Sheet>
  )
}
