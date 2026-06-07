import { useState } from 'react'
import { X, ExternalLink, Trash2, Moon, Sun, Copy, Check } from 'lucide-react'
import { useStore } from '../store'
import { useUser } from '../hooks/useUser'
import { useWallet } from '../hooks/useWallet'
import { Button } from './Button'
import { shortAddr } from '../utils'
import toast from 'react-hot-toast'

export function SettingsPanel() {
  const { showSettings, setShowSettings } = useStore()
  const { user, updateUser, deleteAccount } = useUser()
  const { address } = useWallet()
  const [username, setUsername] = useState(user?.username || '')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!showSettings) return null

  async function saveUsername() {
    if (!username.trim()) return
    setSaving(true)
    await updateUser({ username: username.trim() })
    toast.success('Username saved!')
    setSaving(false)
  }

  async function toggleDiscord() {
    if (!user) return
    const newVal = !user.discord_connected
    if (newVal) {
      const discordUrl = import.meta.env.VITE_SOCIAL_DISCORD
      if (discordUrl) window.open(discordUrl, '_blank')
    }
    await updateUser({ discord_connected: newVal })
    toast.success(newVal ? 'Discord connected!' : 'Discord disconnected')
  }

  async function toggleTheme() {
    if (!user) return
    const newTheme = user.theme === 'dark' ? 'light' : 'dark'
    await updateUser({ theme: newTheme })
  }

  async function handleDelete() {
    await deleteAccount()
    setShowDeleteConfirm(false)
    setShowSettings(false)
    toast.success('Account deleted')
  }

  function copyAddress() {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
      <div className="fixed right-4 top-20 w-80 bg-[#0f0f1a] border border-[#1e1e35] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[80vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e35]">
          <span className="font-semibold text-sm">Settings</span>
          <button onClick={() => setShowSettings(false)} className="text-[#8888aa] hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          <section>
            <p className="text-xs text-[#8888aa] font-semibold uppercase tracking-wider mb-2">Username</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={user?.username || 'Set username...'}
                className="flex-1 bg-[#161625] border border-[#1e1e35] rounded-xl px-3 py-2 text-sm text-[#f0f0ff] placeholder-[#44445a] outline-none focus:border-[#e8b44b]/50 transition-colors"
              />
              <Button onClick={saveUsername} loading={saving} className="px-3 py-2 text-sm">
                Save
              </Button>
            </div>
          </section>

          <section>
            <p className="text-xs text-[#8888aa] font-semibold uppercase tracking-wider mb-2">Discord</p>
            <button
              onClick={toggleDiscord}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                user?.discord_connected
                  ? 'border-[#10d9a0]/30 bg-[#10d9a0]/10 text-[#10d9a0]'
                  : 'border-[#1e1e35] text-[#8888aa] hover:border-[#2a2a45] hover:text-white'
              }`}
            >
              <span>{user?.discord_connected ? 'Connected' : 'Connect Discord'}</span>
              <ExternalLink size={14} />
            </button>
          </section>

          <section>
            <p className="text-xs text-[#8888aa] font-semibold uppercase tracking-wider mb-2">Theme</p>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-[#1e1e35] text-sm font-medium hover:border-[#2a2a45] transition-colors"
            >
              <span className="text-[#f0f0ff]">{user?.theme === 'dark' ? 'Dark' : 'Light'}</span>
              {user?.theme === 'dark'
                ? <Moon size={16} className="text-[#8888aa]" />
                : <Sun size={16} className="text-[#e8b44b]" />
              }
            </button>
          </section>

          {user && (
            <section>
              <p className="text-xs text-[#8888aa] font-semibold uppercase tracking-wider mb-2">Account</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8888aa]">Member since</span>
                  <span className="text-[#f0f0ff]">
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {address && (
                  <button
                    onClick={copyAddress}
                    className="flex justify-between items-center text-sm hover:bg-[#161625] px-2 py-1 rounded-lg transition-colors"
                  >
                    <span className="text-[#8888aa]">Wallet</span>
                    <span className="flex items-center gap-1 text-[#f0f0ff] font-mono text-xs">
                      {shortAddr(address)}
                      {copied ? <Check size={12} className="text-[#10d9a0]" /> : <Copy size={12} />}
                    </span>
                  </button>
                )}
              </div>
            </section>
          )}

          <section className="border-t border-[#1e1e35] pt-4">
            <p className="text-xs text-[#f43f5e] font-semibold uppercase tracking-wider mb-2">Danger Zone</p>
            {!showDeleteConfirm ? (
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="w-full text-sm py-2">
                <Trash2 size={14} />
                Delete Account
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-[#f43f5e]">This will permanently delete your account and all data.</p>
                <div className="flex gap-2">
                  <Button variant="danger" onClick={handleDelete} className="flex-1 text-sm py-2">Confirm</Button>
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1 text-sm py-2">Cancel</Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
