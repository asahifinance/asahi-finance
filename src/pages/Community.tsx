import { ExternalLink } from 'lucide-react'

interface SocialCard {
  emoji: string
  platform: string
  description: string
  envKey: keyof ImportMetaEnv
  cta: string
  color: string
}

const SOCIALS: SocialCard[] = [
  {
    emoji: '𝕏',
    platform: 'Twitter / X',
    description: 'Follow us for the latest updates, announcements, and trading insights.',
    envKey: 'VITE_SOCIAL_TWITTER',
    cta: 'Follow @AsahiFinance',
    color: '#1DA1F2',
  },
  {
    emoji: '💬',
    platform: 'Discord',
    description: 'Join our community, get support, and chat with fellow traders.',
    envKey: 'VITE_SOCIAL_DISCORD',
    cta: 'Join Discord',
    color: '#5865F2',
  },
  {
    emoji: '✍️',
    platform: 'Medium',
    description: 'Read deep dives, strategy guides, and protocol updates on our blog.',
    envKey: 'VITE_SOCIAL_MEDIUM',
    cta: 'Read on Medium',
    color: '#00ab6c',
  },
  {
    emoji: '🎵',
    platform: 'TikTok',
    description: 'Short videos on DeFi strategies, market moves, and platform features.',
    envKey: 'VITE_SOCIAL_TIKTOK',
    cta: 'Watch on TikTok',
    color: '#ff0050',
  },
  {
    emoji: '📸',
    platform: 'Instagram',
    description: 'Visual content, infographics, and community highlights.',
    envKey: 'VITE_SOCIAL_INSTAGRAM',
    cta: 'Follow on Instagram',
    color: '#E1306C',
  },
]

export default function Community() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0ff] mb-1">Community</h1>
        <p className="text-[#8888aa]">Connect with the Asahi Finance community across all platforms.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOCIALS.map((s) => {
          const url = import.meta.env[s.envKey]
          return (
            <div
              key={s.platform}
              className="card group cursor-pointer transition-all duration-300 relative overflow-hidden"
              onClick={() => url && window.open(url, '_blank')}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="font-semibold text-[#f0f0ff] mb-1">{s.platform}</h3>
                <p className="text-sm text-[#8888aa] mb-4 leading-relaxed">{s.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: s.color }}>
                  <span>{s.cta}</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </div>
          )
        })}

        <div className="card border-dashed border-[#2a2a45] flex flex-col items-center justify-center text-center py-8 opacity-60">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-semibold text-[#8888aa] mb-1">More Coming Soon</h3>
          <p className="text-sm text-[#44445a]">New channels and platforms on the way.</p>
        </div>
      </div>
    </div>
  )
}
