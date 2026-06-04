import { useState, useEffect } from 'react'
import { Copy, Share2, TrendingUp, Star, Users, CheckCircle } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../lib/supabase'
import { formatUSD, getNextTierInfo } from '../lib/utils'
import { Card } from '../components/ui'
import { Button } from '../components/ui'
import { TIERS } from '../types'
import toast from 'react-hot-toast'

const TIER_EMOJI: Record<string, string> = {
  Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', Diamond: '👑',
}

export default function Dashboard() {
  const { user, walletAddress } = useAppStore()
  const [spotVolume, setSpotVolume] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    async function load() {
      const [{ data: trades }, { data: refs }] = await Promise.all([
        supabase.from('trades').select('usd_volume').eq('user_id', user!.id),
        supabase.from('referrals').select('id').eq('referrer_id', user!.id),
      ])
      setSpotVolume(trades?.reduce((s, t) => s + (t.usd_volume || 0), 0) || 0)
      setReferralCount(refs?.length || 0)
      setLoading(false)
    }
    load()
  }, [user])

  const copyReferral = () => {
    if (!user?.referral_code) return
    navigator.clipboard.writeText(`https://asahifinance.xyz/ref/${user.referral_code}`)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = () => {
    if (!user?.referral_code) return
    const url = `https://asahifinance.xyz/ref/${user.referral_code}`
    if (navigator.share) {
      navigator.share({ title: 'Join Asahi Finance', text: 'Trade on Asahi Finance and earn points!', url })
    } else {
      copyReferral()
    }
  }

  const points = user?.points || 0
  const tierInfo = getNextTierInfo(points)
  const currentTierData = TIERS.find(t => t.name === (user?.tier || 'Bronze'))!

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-brand flex items-center justify-center text-3xl">🔥</div>
        <h2 className="font-display font-bold text-2xl">Welcome to Asahi Finance</h2>
        <p className="text-text-secondary max-w-sm">Connect your wallet to view your dashboard, start trading, and earn points.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome back{user?.username ? `, @${user.username}` : ''}! 👋</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
        ) : (
          <>
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Spot Volume</p>
                  <p className="font-display font-bold text-2xl mt-1 number">{formatUSD(spotVolume)}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-gold" />
                </div>
              </div>
            </Card>
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Points</p>
                  <p className="font-display font-bold text-2xl mt-1 number text-gold">{points.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Star size={18} className="text-gold" />
                </div>
              </div>
            </Card>
            <Card glow>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Referrals</p>
                  <p className="font-display font-bold text-2xl mt-1 number">{referralCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                  <Users size={18} className="text-violet" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Referral Panel */}
      <Card>
        <h3 className="font-display font-semibold text-lg mb-1">Refer & Earn</h3>
        <p className="text-text-secondary text-sm mb-4">Share your link and earn <span className="text-gold font-semibold">+10 points</span> for each friend who trades</p>
        <div className="flex items-center gap-2 bg-bg-primary rounded-xl px-4 py-3 mb-3">
          <code className="flex-1 text-gold font-mono text-sm truncate">
            asahifinance.xyz/ref/{user?.referral_code || '—'}
          </code>
          <button
            onClick={copyReferral}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
          >
            {copied ? <CheckCircle size={14} className="text-emerald" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={copyReferral}>
            <Copy size={15} /> Copy Link
          </Button>
          <Button className="flex-1" onClick={shareReferral}>
            <Share2 size={15} /> Share
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex gap-4 text-sm">
          <div><span className="text-text-secondary">Referrals: </span><span className="text-white font-semibold">{referralCount}</span></div>
          <div><span className="text-text-secondary">Points from refs: </span><span className="text-gold font-semibold">{referralCount * 10}</span></div>
        </div>
      </Card>

      {/* Points & Tier */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg">Points & Tier</h3>
            <p className="text-text-secondary text-sm">$10 traded = 1 point</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-bold gradient-text">{points.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">total points</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span style={{ color: currentTierData.color }}>{TIER_EMOJI[user?.tier || 'Bronze']} {user?.tier || 'Bronze'}</span>
            {tierInfo.needed > 0 && <span>{tierInfo.needed} pts to {tierInfo.next}</span>}
          </div>
          <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${Math.min(tierInfo.progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Tier badges */}
        <div className="grid grid-cols-5 gap-2">
          {TIERS.map((tier) => {
            const isActive = tier.name === (user?.tier || 'Bronze')
            const isPassed = points >= tier.min
            return (
              <div
                key={tier.name}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all
                  ${isActive ? 'border-gold bg-gold/10 shadow-glow-gold' : isPassed ? 'border-border-light' : 'border-border opacity-40'}`}
              >
                <span className="text-lg">{TIER_EMOJI[tier.name]}</span>
                <span className="text-[10px] font-medium" style={{ color: tier.color }}>{tier.name}</span>
                <span className="text-[9px] text-text-muted">{tier.min === 0 ? '0' : `${tier.min}+`}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
