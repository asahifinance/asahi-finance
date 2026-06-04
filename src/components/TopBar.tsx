import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Settings, X, Wallet } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useWallet } from '../hooks/useWallet'
import { shortAddress } from '../lib/utils'

const SEARCH_ITEMS = [
  { label: 'Dashboard', path: '/', icon: '🏠' },
  { label: 'Spot Trading', path: '/spot', icon: '🔄' },
  { label: 'Perp Trading', path: '/perp', icon: '📈' },
  { label: 'Community', path: '/community', icon: '🌐' },
  { label: 'Documentation', path: '/docs', icon: '📄' },
]

export function TopBar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { walletAddress, unreadCount, setShowNotifications, setShowSettings } = useAppStore()
  const { connectWallet, isConnecting } = useWallet()

  const filtered = SEARCH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-bg-primary/80 backdrop-blur-xl border-b border-border flex items-center px-4 gap-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center overflow-hidden">
          <img src="/asahi.jpg" alt="Asahi" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
        <span className="font-display font-bold text-lg gradient-text hidden sm:block">Asahi Finance</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div ref={searchRef} className="relative hidden md:block">
        <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-xl px-3 py-2 w-52 focus-within:border-gold/50 transition-colors">
          <Search size={15} className="text-text-secondary flex-shrink-0" />
          <input
            className="bg-transparent text-sm text-white placeholder-text-secondary outline-none w-full"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true) }}
            onFocus={() => setShowSearch(true)}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowSearch(false) }}>
              <X size={13} className="text-text-secondary hover:text-white" />
            </button>
          )}
        </div>
        {showSearch && searchQuery && (
          <div className="absolute top-full mt-2 w-full bg-bg-surface border border-border rounded-xl overflow-hidden shadow-xl z-50">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-text-secondary text-sm">No results</div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.path}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated text-left transition-colors"
                  onClick={() => { navigate(item.path); setShowSearch(false); setSearchQuery('') }}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm text-white">{item.label}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Notification Bell */}
      <button
        className="relative p-2 rounded-xl hover:bg-bg-elevated transition-colors"
        onClick={() => setShowNotifications(true)}
      >
        <Bell size={20} className="text-text-secondary hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Wallet / Username */}
      {walletAddress ? (
        <div className="flex items-center gap-2 bg-bg-surface border border-border rounded-xl px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald animate-pulse-slow" />
          <span className="text-sm font-medium text-white hidden sm:block">
            {shortAddress(walletAddress)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-gradient-brand text-white text-sm font-semibold rounded-xl px-4 py-2 hover:scale-[1.02] hover:shadow-glow-gold transition-all disabled:opacity-50"
        >
          <Wallet size={15} />
          <span className="hidden sm:block">{isConnecting ? 'Connecting...' : 'Connect'}</span>
        </button>
      )}

      {/* Settings */}
      <button
        className="p-2 rounded-xl hover:bg-bg-elevated transition-colors"
        onClick={() => setShowSettings(true)}
      >
        <Settings size={20} className="text-text-secondary hover:text-white transition-colors" />
      </button>
    </header>
  )
}
