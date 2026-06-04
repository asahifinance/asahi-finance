export function shortAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(num: number, decimals = 4): string {
  if (num === 0) return '0'
  if (num < 0.0001) return '<0.0001'
  return num.toFixed(decimals)
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function getTierFromPoints(points: number) {
  if (points >= 10000) return 'Diamond'
  if (points >= 2000) return 'Platinum'
  if (points >= 500) return 'Gold'
  if (points >= 100) return 'Silver'
  return 'Bronze'
}

export function getNextTierInfo(points: number) {
  if (points >= 10000) return { next: 'Diamond', needed: 0, progress: 100 }
  if (points >= 2000) return { next: 'Diamond', needed: 10000 - points, progress: ((points - 2000) / 8000) * 100 }
  if (points >= 500) return { next: 'Platinum', needed: 2000 - points, progress: ((points - 500) / 1500) * 100 }
  if (points >= 100) return { next: 'Gold', needed: 500 - points, progress: ((points - 100) / 400) * 100 }
  return { next: 'Silver', needed: 100 - points, progress: (points / 100) * 100 }
}
