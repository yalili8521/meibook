import { NavLink } from 'react-router-dom'
import { IconSun, IconCalendar, IconUsers, IconChart, IconGear } from './Icons.jsx'

const TABS = [
  { to: '/', label: '今日', icon: IconSun, end: true },
  { to: '/schedule', label: '预约', icon: IconCalendar },
  { to: '/clients', label: '客户', icon: IconUsers },
  { to: '/revenue', label: '收入', icon: IconChart },
  { to: '/settings', label: '设置', icon: IconGear },
]

export default function TabBar() {
  return (
    <nav className="tabbar">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          <span className="tab-ico">
            <Icon size={22} />
          </span>
          <span className="tab-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
