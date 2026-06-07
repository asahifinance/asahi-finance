import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Settings, Search } from 'lucide-react'
import { useStore } from '../store'

const SEARCH_ITEMS = [
  { label: 'Dashboard', path: '/', desc: 'Portfolio & stats' },
  { label: 'Spot', path: '/spot', desc: 'Swap tokens' },
  { label: 'Perp', path: '/perp', desc: 'Perpetual trading' },
  { label: 'Community', path: '/community', desc: 'Social links' },
  { label: 'Docs', path: '/docs', desc: 'Documentation' },
]

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export function TopBar() {
  const { unreadCount, setShowNotif, setShowSettings, showNotif, showSettings } = useStore()
  const [searchVal, setSearchVal] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const filtered = SEARCH_ITEMS.filter(
    (i) =>
      searchVal &&
      (i.label.toLowerCase().includes(searchVal.toLowerCase()) ||
        i.desc.toLowerCase().includes(searchVal.toLowerCase()))
  )

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-[#080811]/80 backdrop-blur border-b border-[#1e1e35] h-16 fixed top-0 left-0 right-0 z-30 flex items-center px-4 gap-3">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img
          src="/asahi.png"
          alt="Asahi"
          className="w-8 h-8 rounded-full"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <span className="grad-text font-bold text-lg hidden sm:block">Asahi Finance</span>
      </Link>

      <div className="flex-1" />

      <div ref={searchRef} className="relative hidden md:block w-64">
        <div className="flex items-center gap-2 bg-[#0f0f1a] border border-[#1e1e35] rounded-xl px-3 py-2">
          <Search size={14} className="text-[#8888aa]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); setShowSearch(true) }}
            onFocus={() => setShowSearch(true)}
            className="bg-transparent text-sm text-[#f0f0ff] placeholder-[#44445a] outline-none w-full"
          />
        </div>
        {showSearch && filtered.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-[#0f0f1a] border border-[#1e1e35] rounded-xl overflow-hidden shadow-xl z-50">
            {filtered.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setShowSearch(false); setSearchVal('') }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#161625] text-left transition-colors"
              >
                <span className="text-sm font-medium text-[#f0f0ff]">{item.label}</span>
                <span className="text-xs text-[#8888aa]">{item.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => { setShowNotif(!showNotif); setShowSettings(false) }}
        className="relative p-2 rounded-xl hover:bg-[#161625] transition-colors text-[#8888aa] hover:text-white"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#f43f5e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <appkit-button />

      <button
        onClick={() => { setShowSettings(!showSettings); setShowNotif(false) }}
        className="hidden sm:flex p-2 rounded-xl hover:bg-[#161625] transition-colors text-[#8888aa] hover:text-white"
      >
        <Settings size={18} />
      </button>
    </header>
  )
}
