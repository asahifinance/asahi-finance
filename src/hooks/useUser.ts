import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'
import { getTierFromPoints } from '../lib/utils'
import toast from 'react-hot-toast'

export function useUser() {
  const { user, setUser, walletAddress } = useAppStore()

  const updateUsername = useCallback(async (username: string) => {
    if (!user) return
    const { data, error } = await supabase
      .from('users')
      .update({ username })
      .eq('id', user.id)
      .select()
      .single()
    if (error) {
      toast.error('Username already taken or invalid')
      return false
    }
    setUser({ ...data, tier: getTierFromPoints(data.points) })
    toast.success('Username updated!')
    return true
  }, [user, setUser])

  const updateTheme = useCallback(async (theme: 'dark' | 'light') => {
    if (!user) return
    await supabase.from('users').update({ theme }).eq('id', user.id)
    setUser({ ...user, theme })
  }, [user, setUser])

  const deleteAccount = useCallback(async () => {
    if (!user) return
    await supabase.from('users').delete().eq('id', user.id)
    setUser(null)
    toast.success('Account deleted')
  }, [user, setUser])

  const refreshUser = useCallback(async () => {
    if (!walletAddress) return
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()
    if (data) setUser({ ...data, tier: getTierFromPoints(data.points) })
  }, [walletAddress, setUser])

  return { user, updateUsername, updateTheme, deleteAccount, refreshUser }
}
