import { useState } from 'react'
import { X, User, Twitter, MessageSquare, Sun, Moon, Trash2, Calendar, Wallet } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useUser } from '../hooks/useUser'
import { useWallet } from '../hooks/useWallet'
import { shortAddress } from '../lib/utils'
import { Button } from './ui'

export function SettingsPanel() {
  const { showSettings, setShowSettings, user, walletAddress } = useAppStore()
  const { updateUsername, updateTheme, deleteAccount } = useUser()
  const { disconnectWallet } = useWallet()
  const [newUsername, setNewUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!showSettings) return null

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) return
    setSaving(true)
    await updateUsername(newUsername.trim())
    setSaving(false)
    setNewUsername('')
  }

  const handleDelete = async () => {
    await deleteAccount()
    disconnectWallet()
    setShowSettings(false)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="panel-overlay" onClick={() => setShowSettings(false)} />
      <div className="panel">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-bg-surface">
          <h2 className="font-display font-bold text-lg">Settings</h2>
          <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Profile */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-gold" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-secondary">Profile</h3>
            </div>
            <div className="space-y-3">
              {user?.username && (
                <div className="bg-bg-primary rounded-xl px-4 py-3 text-sm">
                  Current: <span className="text-gold font-semibold">@{user.username}</span>
                </div>
              )}
              <input
                className="input text-sm"
                placeholder="Set username..."
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
              />
              <Button onClick={handleSaveUsername} loading={saving} disabled={!newUsername.trim()} className="w-full">
                Save Username
              </Button>
            </div>
          </section>

          {/* Social */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Twitter size={16} className="text-gold" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-secondary">Social</h3>
            </div>
            <div className="space-y-2">
              <a
                href={import.meta.env.VITE_SOCIAL_TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-bg-primary rounded-xl px-4 py-3 hover:bg-bg-elevated transition-colors"
              >
                <Twitter size={16} className="text-[#1DA1F2]" />
                <span className="text-sm">Connect X (Twitter)</span>
                <div className={`ml-auto w-2 h-2 rounded-full ${user?.twitter_connected ? 'bg-emerald' : 'bg-text-muted'}`} />
              </a>
              <a
                href={import.meta.env.VITE_SOCIAL_DISCORD}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-bg-primary rounded-xl px-4 py-3 hover:bg-bg-elevated transition-colors"
              >
                <MessageSquare size={16} className="text-[#5865F2]" />
                <span className="text-sm">Connect Discord</span>
                <div className={`ml-auto w-2 h-2 rounded-full ${user?.discord_connected ? 'bg-emerald' : 'bg-text-muted'}`} />
              </a>
            </div>
          </section>

          {/* Theme */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sun size={16} className="text-gold" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-secondary">Appearance</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all
                  ${user?.theme === 'dark' ? 'border-gold bg-gold/10 text-gold' : 'border-border text-text-secondary hover:border-border-light'}`}
              >
                <Moon size={15} /> Dark
              </button>
              <button
                onClick={() => updateTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all
                  ${user?.theme === 'light' ? 'border-gold bg-gold/10 text-gold' : 'border-border text-text-secondary hover:border-border-light'}`}
              >
                <Sun size={15} /> Light
              </button>
            </div>
          </section>

          {/* Account Info */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={16} className="text-gold" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-secondary">Account</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 bg-bg-primary rounded-xl px-4 py-3">
                <Calendar size={15} className="text-text-secondary" />
                <span className="text-text-secondary">Joined</span>
                <span className="ml-auto text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-bg-primary rounded-xl px-4 py-3">
                <Wallet size={15} className="text-text-secondary" />
                <span className="text-text-secondary">Wallet</span>
                <span className="ml-auto text-white font-mono text-xs">
                  {walletAddress ? shortAddress(walletAddress) : '—'}
                </span>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trash2 size={16} className="text-danger" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-danger">Danger Zone</h3>
            </div>
            {!showDeleteConfirm ? (
              <Button variant="danger" className="w-full" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={15} /> Delete Account
              </Button>
            ) : (
              <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 space-y-3">
                <p className="text-sm text-danger">Are you sure? This action cannot be undone.</p>
                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
