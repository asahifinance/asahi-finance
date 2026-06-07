export interface User {
  id: string
  wallet_address: string
  username: string | null
  referral_code: string
  referred_by: string | null
  points: number
  tier: string
  discord_connected: boolean
  theme: string
  created_at: string
}

export interface Trade {
  id: string
  user_id: string
  from_token: string
  to_token: string
  from_amount: number
  to_amount: number
  usd_volume: number
  points_earned: number
  tx_hash: string
  chain_id: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  is_read: boolean
  created_at: string
}

export const CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH', rpc: 'https://eth.llamarpc.com' },
  { id: 42161, name: 'Arbitrum', symbol: 'ARB', rpc: 'https://arb1.arbitrum.io/rpc' },
  { id: 10, name: 'Optimism', symbol: 'OP', rpc: 'https://mainnet.optimism.io' },
  { id: 137, name: 'Polygon', symbol: 'POL', rpc: 'https://polygon-rpc.com' },
  { id: 8453, name: 'Base', symbol: 'BASE', rpc: 'https://mainnet.base.org' },
]

export const TIERS = [
  { name: 'Bronze', min: 0, color: '#cd7f32' },
  { name: 'Silver', min: 100, color: '#c0c0c0' },
  { name: 'Gold', min: 500, color: '#e8b44b' },
  { name: 'Platinum', min: 2000, color: '#10d9a0' },
  { name: 'Diamond', min: 10000, color: '#a855f7' },
]
