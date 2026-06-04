import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useUser } from '../hooks/useUser'
import { Button } from './ui'

export function UsernameModal() {
  const { showUsernameModal, setShowUsernameModal } = useAppStore()
  const { updateUsername } = useUser()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)

  if (!showUsernameModal) return null

  const handleSave = async () => {
    if (!username.trim()) return
    setSaving(true)
    const ok = await updateUsername(username.trim())
    setSaving(false)
    if (ok) setShowUsernameModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-bg-surface border border-border rounded-2xl p-8 w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">Welcome to Asahi Finance!</h2>
          <p className="text-text-secondary text-sm">Set a username to personalize your experience</p>
        </div>
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Choose a username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowUsernameModal(false)}>
              Skip
            </Button>
            <Button className="flex-1" loading={saving} disabled={!username.trim()} onClick={handleSave}>
              Let's Go! 🔥
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
