import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, TrendingUp, Users, BookOpen, ExternalLink } from 'lucide-react'

const NAV = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Spot', path: '/spot', icon: ArrowLeftRight },
  { label: 'Perp', path: '/perp', icon: TrendingUp, external: true },
  { label: 'Community', path: '/community', icon: Users },
  { label: 'Docs', path: '/docs', icon: BookOpen },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-bg-primary border-r border-border hidden md:flex flex-col py-6 px-3 z-20">
      <nav className="flex flex-col gap-1">
        {NAV.map(({ label, path, icon: Icon, external }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? 'text-white bg-bg-elevated shadow-glow-gold/20'
                : 'text-text-secondary hover:text-white hover:bg-bg-elevated'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-brand rounded-r-full" />
                )}
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-gold' : 'text-text-secondary group-hover:text-white'}`} />
                <span>{label}</span>
                {external && <ExternalLink size={12} className="ml-auto text-text-muted" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom branding */}
      <div className="mt-auto px-4">
        <div className="text-xs text-text-muted">
          <div className="gradient-text font-display font-semibold text-sm mb-1">Asahi Finance</div>
          <div>v1.0.0 — DeFi Hub</div>
        </div>
      </div>
    </aside>
  )
}
