import { ExternalLink } from 'lucide-react'

const SOCIALS = [
  {
    name: 'X (Twitter)',
    handle: '@asahifinance',
    desc: 'Latest updates, announcements & alpha',
    emoji: '𝕏',
    color: '#1DA1F2',
    envKey: 'VITE_SOCIAL_TWITTER',
    cta: 'Follow us',
  },
  {
    name: 'Discord',
    handle: 'Join our server',
    desc: 'Community discussions, support & giveaways',
    emoji: '💬',
    color: '#5865F2',
    envKey: 'VITE_SOCIAL_DISCORD',
    cta: 'Join Discord',
  },
  {
    name: 'Medium',
    handle: '@asahifinance',
    desc: 'In-depth articles, tutorials & research',
    emoji: '✍️',
    color: '#00D4A1',
    envKey: 'VITE_SOCIAL_MEDIUM',
    cta: 'Read blog',
  },
  {
    name: 'TikTok',
    handle: '@asahifinance',
    desc: 'Short-form trading tips & highlights',
    emoji: '🎵',
    color: '#FF0050',
    envKey: 'VITE_SOCIAL_TIKTOK',
    cta: 'Watch videos',
  },
  {
    name: 'Instagram',
    handle: '@asahifinance',
    desc: 'Visual content, infographics & updates',
    emoji: '📸',
    color: '#E1306C',
    envKey: 'VITE_SOCIAL_INSTAGRAM',
    cta: 'Follow us',
  },
  {
    name: 'More coming soon',
    handle: 'Stay tuned',
    desc: 'We\'re expanding to more platforms',
    emoji: '🚀',
    color: '#F5A623',
    envKey: null,
    cta: null,
  },
]

export default function Community() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl">Community</h1>
        <p className="text-text-secondary text-sm mt-1">Join the Asahi Finance community across all platforms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOCIALS.map((social) => {
          const url = social.envKey
            ? (import.meta.env as Record<string, string>)[social.envKey]
            : null

          return (
            <div
              key={social.name}
              className="group relative rounded-2xl bg-bg-surface border border-border p-5 transition-all duration-300 hover:border-transparent overflow-hidden"
              style={{
                ['--hover-color' as string]: social.color,
              }}
            >
              {/* Hover gradient border effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{ background: `linear-gradient(135deg, ${social.color}40, transparent)`, padding: '1px' }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${social.color}20`, color: social.color }}
                >
                  {social.emoji}
                </div>
                {url && (
                  <ExternalLink size={16} className="text-text-muted group-hover:text-white transition-colors" />
                )}
              </div>

              <h3 className="font-display font-bold text-lg mb-0.5" style={{ color: url ? 'white' : social.color }}>
                {social.name}
              </h3>
              <p className="text-sm font-medium mb-2" style={{ color: social.color }}>
                {social.handle}
              </p>
              <p className="text-text-secondary text-sm mb-4">{social.desc}</p>

              {url && social.cta ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
                  style={{ color: social.color }}
                >
                  {social.cta} →
                </a>
              ) : !url && social.cta === null ? (
                <span className="text-sm text-text-muted">Coming soon...</span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
