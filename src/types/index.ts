export interface User {
  id: string
  wallet_address: string
  username: string | null
  referral_code: string
  referred_by: string | null
  points: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  twitter_connected: boolean
  discord_connected: boolean
  theme: 'dark' | 'light'
  created_at: string
}

export interface Trade {
  id: string
  user_id: string
  trade_type: 'spot' | 'perp'
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
  type: 'spot_success' | 'spot_fail' | 'perp_filled' | 'perp_liquidated' | 'referral'
  message: string
  is_read: boolean
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  points_awarded: number
  first_trade_completed: boolean
  created_at: string
}

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export interface Chain {
  id: number
  name: string
  symbol: string
  rpc: string
  explorer: string
}

export const CHAINS: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
  },
  {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpc: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
  },
  {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
  },
]

export const TIERS = [
  { name: 'Bronze', min: 0, max: 99, color: '#CD7F32' },
  { name: 'Silver', min: 100, max: 499, color: '#C0C0C0' },
  { name: 'Gold', min: 500, max: 1999, color: '#F5A623' },
  { name: 'Platinum', min: 2000, max: 9999, color: '#00D4A1' },
  { name: 'Diamond', min: 10000, max: Infinity, color: '#8E44AD' },
]
