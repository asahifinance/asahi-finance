import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Copy, Share2, Zap, TrendingUp, Users, Check } from 'lucide-react'
import { useStore } from '../store'
import { useWallet } from '../hooks/useWallet'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { supabase } from '../supabase' // ✅ SUDAH DIPERBAIKI (Tanpa Bolt & Tanpa Spasi)
import { CHAINS, TIERS } from '../types'
import { fmtUSD, getNextTier, getTier } from '../utils'
import toast from 'react-hot-toast'

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]

const TOP_TOKENS: Record<number, { address: string; symbol: string }[]> = {
  1: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' },
  ],
  42161: [
    { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT' },
  ],
  10: [{ address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', symbol: 'USDC' }],
  137: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT' },
  ],
  8453: [{ address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC' }],
}

interface TokenBalance { symbol: string; amount: string }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export default function Dashboard() {
  const { user } = useStore()
  const { isConnected, address } = useWallet()
  const [selectedChain, setSelectedChain] = useState(CHAINS[0])
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [loadingBalances, setLoadingBalances] = useState(false)
  const [totalVolume, setTotalVolume] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    async function loadStats() {
      // ✅ SUDAH DIPERBAIKI (Memakai variabel 'supabase' yang benar)
      const [tradesRes, referralsRes] = await Promise.all([
        supabase.from('trades').select('usd_volume').eq('user_id', user!.id),
        supabase.from('referrals').select('id').eq('referrer_id', user!.id),
      ])
      if (tradesRes.data) setTotalVolume(tradesRes.data.reduce((s, t) => s + (t.usd_volume || 0), 0))
      if (referralsRes.data) setReferralCount(referralsRes.data.length)
    }
    loadStats()
  }, [user?.id])

  useEffect(() => {
    if (!isConnected || !address) return
    async function fetchBalances() {
      setLoadingBalances(true)
      try {
        const provider = new ethers.JsonRpcProvider(selectedChain.rpc)
        const native = await provider.getBalance(address!)
        const nativeAmount = parseFloat(ethers.formatEther(native))
        const result: TokenBalance[] = [{ symbol: selectedChain.symbol, amount: nativeAmount.toFixed(4) }]
        const tokens = TOP_TOKENS[selectedChain.id] || []
        await Promise.all(
          tokens.map(async (t) => {
            try {
              const contract = new ethers.Contract(t.address, ERC20_ABI, provider)
              const [bal, dec] = await Promise.all([contract.balanceOf(address!), contract.decimals()])
              const amt = parseFloat(ethers.formatUnits(bal, dec))
              if (amt > 0.001) result.push({ symbol: t.symbol, amount: amt.toFixed(4) })
            } catch {}
          })
        )
        setBalances(result)
      } catch {
        toast.error('Failed to fetch balances')
      }
      setLoadingBalances(false)
    }
    fetchBalances()
  }, [isConnected, address, selectedChain])

  function copyRefLink() {
    const link = `https://asahifinance.xyz/ref/${user?.referral_code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied!')
  }

  function shareRefLink() {
    const link = `https://asahifinance.xyz/ref/${user?.referral_code}`
    if (navigator.share) {
      navigator.share({ title: 'Asahi Finance', text: 'Join me on Asahi Finance!', url: link })
    } else {
      copyRefLink()
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#e8b44b] to-[#7c3aed] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(232,180,75,0.3)]">
          <Zap size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          <span className="grad-text">Trade. Earn. Grow.</span>
        </h1>
        <p className="text-[#8888aa] text-lg mb-8 max-w-md">
          Connect your wallet to start trading, earn points, and climb the leaderboard on Asahi Finance.
        </p>
        <appkit-button />
      </div>
    )
  }

  const pts = user?.points || 0
  const { next, progress, needed } = getNextTier(pts)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card glow>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#10d9a0]/15 flex items-center justify-center">
              <TrendingUp size={18} className="text-[#10d9a0]" />
            </div>
            <span className="text-sm text-[#8888aa]">Total Spot Volume</span>
          </div>
          <p className="text-2xl font-bold text-[#f0f0ff]">{fmtUSD(totalVolume)}</p>
        </Card>

        <Card glow>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#e8b44b]/15 flex items-center justify-center">
              <Zap size={18} className="text-[#e8b44b]" />
            </div>
            <span className="text-sm text-[#8888aa]">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-[#f0f0ff]">{pts.toLocaleString()}</p>
        </Card>

        <Card glow>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#a855f7]/15 flex items-center justify-center">
              <Users size={18} className="text-[#a855f7]" />
            </div>
            <span className="text-sm text-[#8888aa]">Total Referrals</span>
          </div>
          <p className="text-2xl font-bold text-[#f0f0ff]">{referralCount}</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#f0f0ff]">Wallet Balances</h2>
          <div className="flex gap-1 bg-[#080811] rounded-xl p-1 overflow-x-auto">
            {CHAINS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChain(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedChain.id === c.id
                    ? 'bg-gradient-to-r from-[#e8b44b] to-[#7c3aed] text-white'
                    : 'text-[#8888aa] hover:text-white'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </div>
        </div>
        {loadingBalances ? (
          <div className="flex items-center justify-center py-8 text-[#8888aa]">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading balances...
          </div>
        ) : balances.length === 0 ? (
          <p className="text-[#44445a] text-sm text-center py-6">No balances found</p>
        ) : (
          <div className="flex flex-col gap-2">
            {balances.map((b) => (
              <div key={b.symbol} className="flex items-center justify-between px-3 py-2.5 bg-[#161625] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8b44b] to-[#7c3aed] flex items-center justify-center text-xs font-bold text-white">
                    {b.symbol[0]}
                  </div>
                  <span className="font-medium text-sm text-[#f0f0ff]">{b.symbol}</span>
                </div>
                <span className="text-sm text-[#f0f0ff] font-mono">{b.amount}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold text-[#f0f0ff] mb-4">Referral Program</h2>
        <div className="flex items-center gap-3 bg-[#161625] rounded-xl px-4 py-3 mb-4 border border-[#1e1e35]">
          <code className="flex-1 text-[#e8b44b] font-mono text-sm tracking-widest">{user?.referral_code}</code>
          <button
            onClick={copyRefLink}
            className="p-1.5 rounded-lg hover:bg-[#1e1e35] transition-colors text-[#8888aa] hover:text-white"
          >
            {copied ? <Check size={16} className="text-[#10d9a0]" /> : <Copy size={16} />}
          </button>
        </div>
        <div className="flex gap-3 mb-4">
          <Button onClick={copyRefLink} variant="secondary" className="flex-1 text-sm py-2">
            <Copy size={14} /> Copy Link
          </Button>
          <Button onClick={shareRefLink} className="flex-1 text-sm py-2">
            <Share2 size={14} /> Share
          </Button>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-[#8888aa]">Referrals</span>
          <span className="text-[#f0f0ff] font-semibold">{referralCount}</span>
        </div>
        <p className="text-xs text-[#44445a] bg-[#161625] rounded-xl px-3 py-2 border border-[#1e1e35]">
          Earn <span className="text-[#e8b44b]">10% of points</span> your referrals earn, forever.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-[#f0f0ff] mb-1">Points & Tier</h2>
        <p className="text-xs text-[#8888aa] mb-4">$5 traded = 1 point</p>
        <div className="mb-6">
          <p className="text-4xl font-bold grad-text">{pts.toLocaleString()}</p>
          <p className="text-sm text-[#8888aa] mt-1">
            Current Tier:{' '}
            <span style={{ color: TIERS.find((t) => t.name === getTier(pts))?.color }}>{getTier(pts)}</span>
          </p>
        </div>
        {pts < 10000 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#8888aa] mb-2">
              <span>Progress to {next}</span>
              <span>{needed.toLocaleString()} pts needed</span>
            </div>
            <div className="h-2 bg-[#161625] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e8b44b] to-[#a855f7] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-5 gap-2">
          {TIERS.map((tier) => {
            const active = getTier(pts) === tier.name
            return (
              <div
                key={tier.name}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all"
                style={active
                  ? { borderColor: tier.color, color: tier.color, backgroundColor: `${tier.color}15` }
                  : { borderColor: '#1e1e35', color: '#44445a' }
                }
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: active ? `${tier.color}25` : '#161625', color: active ? tier.color : '#44445a' }}
                >
                  {tier.name[0]}
                </div>
                <span className="text-[10px] font-semibold">{tier.name}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
