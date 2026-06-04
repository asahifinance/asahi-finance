import { CheckCheck, X, CheckCircle, XCircle, Gift, Bell } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useNotifications } from '../hooks/useNotifications'
import { timeAgo } from '../lib/utils'
import { Notification } from '../types'

function NotifIcon({ type }: { type: Notification['type'] }) {
  if (type === 'spot_success' || type === 'perp_filled')
    return <CheckCircle size={18} className="text-emerald flex-shrink-0" />
  if (type === 'spot_fail' || type === 'perp_liquidated')
    return <XCircle size={18} className="text-danger flex-shrink-0" />
  if (type === 'referral')
    return <Gift size={18} className="text-gold flex-shrink-0" />
  return <Bell size={18} className="text-text-secondary flex-shrink-0" />
}

export function NotificationPanel() {
  const { showNotifications, setShowNotifications, notifications } = useAppStore()
  const { markAllRead } = useNotifications()

  if (!showNotifications) return null

  return (
    <>
      <div className="panel-overlay" onClick={() => setShowNotifications(false)} />
      <div className="panel">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-bg-surface">
          <h2 className="font-display font-bold text-lg">Notifications</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold transition-colors px-2 py-1 rounded-lg hover:bg-bg-elevated"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <X size={18} className="text-text-secondary hover:text-white" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Bell size={32} className="text-text-muted" />
              <p className="text-text-secondary text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 p-4 transition-colors ${!n.is_read ? 'bg-gold/5' : ''}`}
              >
                <NotifIcon type={n.type} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!n.is_read ? 'text-white' : 'text-text-secondary'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
