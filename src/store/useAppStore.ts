import { create } from 'zustand'
import { User, Notification } from '../types'

interface AppStore {
  // Wallet
  walletAddress: string | null
  chainId: number
  ethBalance: string
  isConnecting: boolean
  setWalletAddress: (address: string | null) => void
  setChainId: (chainId: number) => void
  setEthBalance: (balance: string) => void
  setIsConnecting: (v: boolean) => void

  // User
  user: User | null
  setUser: (user: User | null) => void

  // UI
  showNotifications: boolean
  showSettings: boolean
  showUsernameModal: boolean
  showConnectModal: boolean
  setShowNotifications: (v: boolean) => void
  setShowSettings: (v: boolean) => void
  setShowUsernameModal: (v: boolean) => void
  setShowConnectModal: (v: boolean) => void

  // Notifications
  notifications: Notification[]
  setNotifications: (n: Notification[]) => void
  unreadCount: number
  setUnreadCount: (n: number) => void

  // Theme
  theme: 'dark' | 'light'
  setTheme: (t: 'dark' | 'light') => void
}

export const useAppStore = create<AppStore>((set) => ({
  walletAddress: null,
  chainId: 1,
  ethBalance: '0',
  isConnecting: false,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setChainId: (chainId) => set({ chainId }),
  setEthBalance: (ethBalance) => set({ ethBalance }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),

  user: null,
  setUser: (user) => set({ user }),

  showNotifications: false,
  showSettings: false,
  showUsernameModal: false,
  showConnectModal: false,
  setShowNotifications: (showNotifications) => set({ showNotifications }),
  setShowSettings: (showSettings) => set({ showSettings }),
  setShowUsernameModal: (showUsernameModal) => set({ showUsernameModal }),
  setShowConnectModal: (showConnectModal) => set({ showConnectModal }),

  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  unreadCount: 0,
  setUnreadCount: (unreadCount) => set({ unreadCount }),

  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}))
