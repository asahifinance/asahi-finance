import { X, Bell, CheckCheck, Zap, TrendingUp, Gift, AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStore } from '../store'
import { useNotifications } from '../hooks/useNotifications'
import { timeAgo } from '../utils'

const TYPE_ICONS: Record<string, ReactNode> = {
  trade: <TrendingUp size={16} className="text-[#10d9a0]" />,
  points: <Zap size={16} className="text-[#e8b44b]" />,
  referral: <Gift size={16} className="text-[#a855f7]" />,
  system: <AlertCircle size={16} className="text-[#8888aa]" />,
}

export function NotificationPanel() {
  const { showNotif, setShowNotif, notifications, unreadCount } = useStore()
  const { markAllRead } = useNotifications()

  if (!showNotif) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
      <div className="fixed right-4 top-20 w-80 bg-[#0f0f1a] border border-[#1e1e35] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[70vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e35]">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#e8b44b]" />
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-[#f43f5e] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-[#8888aa] hover:text-white transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button onClick={() => setShowNotif(false)} className="text-[#8888aa] hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#44445a]">
              <Bell size={32} className="mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-[#1e1e35] transition-colors ${
                  !n.is_read ? 'bg-[#161625]' : 'hover:bg-[#161625]/50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {TYPE_ICONS[n.type] ?? TYPE_ICONS.system}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f0f0ff] leading-snug">{n.message}</p>
                  <p className="text-xs text-[#44445a] mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#e8b44b] shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
