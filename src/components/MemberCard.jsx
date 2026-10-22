import { fmt$ } from '../util.js'

// The hero: a client's prepaid balance rendered as a physical member card —
// this is what replaces the handwritten notebook page.
export default function MemberCard({ client, balance, studioName }) {
  return (
    <div className="member-card">
      <div className="mc-deco mc-deco-1" />
      <div className="mc-deco mc-deco-2" />
      <div className="mc-top">
        <span className="mc-studio">{studioName} · 会员卡</span>
      </div>
      <div className="mc-name">{client.name}</div>
      <div className="mc-balance-label">卡内余额</div>
      <div className="mc-balance">{fmt$(balance)}</div>
      <div className="mc-meta">
        {client.wechat ? <span>微信 {client.wechat}</span> : null}
        {client.phone ? <span>{client.phone}</span> : null}
      </div>
    </div>
  )
}
