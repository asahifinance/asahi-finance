import { ExternalLink, TrendingUp, Zap, Globe } from 'lucide-react'
import { Card } from '../components/ui'
import { Button } from '../components/ui'

const STATS = [
  { label: 'Trading Pairs', value: '20+', icon: '📊' },
  { label: 'Max Leverage', value: '20x', icon: '⚡' },
  { label: 'Liquidity', value: 'Omnichain', icon: '🌐' },
]

export default function Perp() {
  const perpUrl = import.meta.env.VITE_PERP_DEX_URL || 'https://dex.orderly.network'

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl">Perpetual Trading</h1>
        <p className="text-text-secondary text-sm mt-1">Trade with leverage on Asahi Perp</p>
      </div>

      {/* Main card */}
      <Card className="text-center py-10 px-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-brand flex items-center justify-center mx-auto mb-6">
          <TrendingUp size={36} className="text-white" />
        </div>
        <h2 className="font-display font-bold text-3xl mb-2">Trade Perpetuals</h2>
        <p className="text-text-secondary mb-2">Powered by <span className="text-white font-semibold">Orderly Network</span></p>
        <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
          Access institutional-grade perpetual trading with deep omnichain liquidity, advanced order types, and up to 20x leverage.
        </p>
        <Button
          className="text-lg px-10 py-4 mx-auto"
          onClick={() => window.open(perpUrl, '_blank')}
        >
          Open Perp DEX <ExternalLink size={18} />
        </Button>
        <p className="text-xs text-text-muted mt-4">Opens in new tab</p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map(stat => (
          <Card key={stat.label} className="text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-xl gradient-text">{stat.value}</div>
            <div className="text-text-secondary text-xs mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <Card>
        <h3 className="font-display font-semibold mb-4">Why trade on Asahi Perp?</h3>
        <div className="space-y-3">
          {[
            { icon: <Zap size={16} className="text-gold" />, title: 'Deep Liquidity', desc: 'Shared omnichain order book for best fills' },
            { icon: <Globe size={16} className="text-gold" />, title: 'Multi-chain', desc: 'Trade across Arbitrum, Optimism, Base & more' },
            { icon: <TrendingUp size={16} className="text-gold" />, title: 'Up to 20x Leverage', desc: 'Trade BTC, ETH, SOL and 20+ pairs' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">{f.icon}</div>
              <div>
                <div className="font-medium text-sm">{f.title}</div>
                <div className="text-text-secondary text-xs">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <ExternalLink size={12} />
        <span>Perpetual trading powered by Orderly Network infrastructure</span>
      </div>
    </div>
  )
}
