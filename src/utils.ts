export const shortAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

export const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export const timeAgo = (d: string) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export const genCode = () =>
  Array.from(
    { length: 8 },
    () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
  ).join('')

export const getTier = (pts: number) =>
  pts >= 10000 ? 'Diamond' : pts >= 2000 ? 'Platinum' : pts >= 500 ? 'Gold' : pts >= 100 ? 'Silver' : 'Bronze'

export const getNextTier = (pts: number) => {
  if (pts >= 10000) return { next: 'Diamond', progress: 100, needed: 0 }
  if (pts >= 2000) return { next: 'Diamond', progress: (pts - 2000) / 80, needed: 10000 - pts }
  if (pts >= 500) return { next: 'Platinum', progress: (pts - 500) / 15, needed: 2000 - pts }
  if (pts >= 100) return { next: 'Gold', progress: (pts - 100) / 4, needed: 500 - pts }
  return { next: 'Silver', progress: pts, needed: 100 - pts }
}
