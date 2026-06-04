import { ExternalLink, BookOpen, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui'
import { Button } from '../components/ui'

const SECTIONS = [
  { icon: '🚀', title: 'Getting Started', desc: 'Connect your wallet and start trading in minutes' },
  { icon: '🔄', title: 'How to Swap', desc: 'Step-by-step guide to spot trading with 1inch' },
  { icon: '📈', title: 'Perpetual Trading', desc: 'Trade with leverage using Orderly Network' },
  { icon: '⭐', title: 'Points & Referrals', desc: 'Earn points, climb tiers, and get rewarded' },
  { icon: '❓', title: 'FAQ', desc: 'Frequently asked questions and answers' },
]

export default function Docs() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl">Documentation</h1>
        <p className="text-text-secondary text-sm mt-1">Everything you need to know about Asahi Finance</p>
      </div>

      {/* Main CTA */}
      <Card className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4">
          <BookOpen size={28} className="text-white" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Asahi Finance Docs</h2>
        <p className="text-text-secondary mb-6 max-w-md mx-auto text-sm">
          Full documentation, guides, API references, and tutorials for Asahi Finance platform.
        </p>
        <Button
          className="mx-auto"
          onClick={() => window.open('https://docs.asahifinance.xyz', '_blank')}
        >
          Open Full Docs <ExternalLink size={16} />
        </Button>
      </Card>

      {/* Sections preview */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-lg mb-3">What's in the docs</h3>
        {SECTIONS.map((section) => (
          <a
            key={section.title}
            href="https://docs.asahifinance.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-bg-surface border border-border hover:border-border-light hover:bg-bg-elevated transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-xl flex-shrink-0">
              {section.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{section.title}</div>
              <div className="text-text-secondary text-xs mt-0.5">{section.desc}</div>
            </div>
            <ArrowRight size={16} className="text-text-muted group-hover:text-gold transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <ExternalLink size={12} />
        <span>docs.asahifinance.xyz</span>
      </div>
    </div>
  )
}
