import { useState } from 'react'
import { User } from 'lucide-react'
import { useStore } from '../store'
import { useUser } from '../hooks/useUser'
import { Button } from './Button'
import toast from 'react-hot-toast'

export function UsernameModal() {
  const { showUsernameModal, setShowUsernameModal } = useStore()
  const { updateUser } = useUser()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)

  if (!showUsernameModal) return null

  async function save() {
    if (!username.trim()) return
    setSaving(true)
    await updateUser({ username: username.trim() })
    setShowUsernameModal(false)
    toast.success(`Welcome, ${username}!`)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0f1a] border border-[#1e1e35] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e8b44b] to-[#7c3aed] flex items-center justify-center mb-4">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#f0f0ff] mb-1">Welcome to Asahi Finance</h2>
          <p className="text-sm text-[#8888aa]">Set a username to get started, or skip for now.</p>
        </div>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder="Enter username..."
          maxLength={20}
          className="w-full bg-[#161625] border border-[#1e1e35] rounded-xl px-4 py-3 text-sm text-[#f0f0ff] placeholder-[#44445a] outline-none focus:border-[#e8b44b]/50 transition-colors mb-4"
        />

        <div className="flex gap-3">
          <Button onClick={save} loading={saving} disabled={!username.trim()} className="flex-1">
            Set Username
          </Button>
          <Button variant="ghost" onClick={() => setShowUsernameModal(false)} className="flex-1">
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}
