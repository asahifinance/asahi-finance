import { NavLink } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, Activity, Users, BookOpen } from 'lucide-react'

const NAV = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/spot', label: 'Spot', icon: TrendingUp },
  { path: '/perp', label: 'Perp', icon: Activity },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/docs', label: 'Docs', icon: BookOpen },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#080811]/95 backdrop-blur border-t border-[#1e1e35] z-30 flex items-center justify-around px-2 py-2">
      {NAV.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              isActive ? 'text-[#e8b44b]' : 'text-[#8888aa]'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
