import { useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import { useStore } from '../store'
import type { Notification } from '../types'

export function useNotifications() {
  const { user, notifications, setNotifications, unreadCount, setUnreadCount } = useStore()
  const notificationsRef = useRef(notifications)
  const unreadRef = useRef(unreadCount)
  notificationsRef.current = notifications
  unreadRef.current = unreadCount

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    async function load() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        setNotifications(data as Notification[])
        setUnreadCount(data.filter((n) => !n.is_read).length)
      }
    }

    load()

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications([payload.new as Notification, ...notificationsRef.current])
          setUnreadCount(unreadRef.current + 1)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  async function markAllRead() {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) {
      setNotifications(data as Notification[])
      setUnreadCount(0)
    }
  }

  return { markAllRead }
}
