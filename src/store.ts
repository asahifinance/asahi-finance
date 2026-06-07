import { create } from 'zustand'
import type { User, Notification } from './types'

interface Store {
  user: User | null
  setUser: (u: User | null) => void
  notifications: Notification[]
  setNotifications: (n: Notification[]) => void
  unreadCount: number
  setUnreadCount: (n: number) => void
  showNotif: boolean
  setShowNotif: (v: boolean) => void
  showSettings: boolean
  setShowSettings: (v: boolean) => void
  showUsernameModal: boolean
  setShowUsernameModal: (v: boolean) => void
  theme: string
  setTheme: (t: string) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  unreadCount: 0,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  showNotif: false,
  setShowNotif: (showNotif) => set({ showNotif }),
  showSettings: false,
  setShowSettings: (showSettings) => set({ showSettings }),
  showUsernameModal: false,
  setShowUsernameModal: (showUsernameModal) => set({ showUsernameModal }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}))
