import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, TrendingUp, Users, BookOpen } from 'lucide-react'

const NAV = [
  { label: 'Home', path: '/', icon: LayoutDashboard },
  { label: 'Spot', path: '/spot', icon: ArrowLeftRight },
  { label: 'Perp', path: '/perp', icon: TrendingUp },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Docs', path: '/docs', icon: BookOpen },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-bg-primary/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-2 py-3">
        {NAV.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200
              ${isActive ? 'text-gold' : 'text-text-secondary'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={isActive ? 'text-gold' : ''} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-gold" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
