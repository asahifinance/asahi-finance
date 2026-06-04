import { useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'
import { Notification } from '../types'

export function useNotifications() {
  const { user, notifications, setNotifications, setUnreadCount } = useAppStore()

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) {
      setNotifications(data as Notification[])
      setUnreadCount(data.filter((n) => !n.is_read).length)
    }
  }, [user, setNotifications, setUnreadCount])

  const markAllRead = useCallback(async () => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }, [user, notifications, setNotifications, setUnreadCount])

  const addNotification = useCallback(async (
    type: Notification['type'],
    message: string
  ) => {
    if (!user) return
    await supabase.from('notifications').insert({
      user_id: user.id,
      type,
      message,
      is_read: false,
    })
    await fetchNotifications()
  }, [user, fetchNotifications])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { notifications, markAllRead, addNotification, fetchNotifications }
}
