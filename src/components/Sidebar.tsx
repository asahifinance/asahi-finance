import { NavLink } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, Activity, Users, BookOpen } from 'lucide-react'

const NAV = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/spot', label: 'Spot', icon: TrendingUp },
  { path: '/perp', label: 'Perp', icon: Activity },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/docs', label: 'Docs', icon: BookOpen },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-[220px] bg-[#080811] border-r border-[#1e1e35] py-4 z-20">
      <nav className="flex flex-col gap-1 px-3">
        {NAV.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-white bg-[#161625]'
                  : 'text-[#8888aa] hover:text-white hover:bg-[#161625]/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r bg-gradient-to-b from-[#e8b44b] to-[#a855f7]" />
                )}
                <Icon size={18} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
