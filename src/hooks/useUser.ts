import { useEffect } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { Bolt Database } from '../supabase'
import { useStore } from '../store'
import { genCode, getTier } from '../utils'
import type { User } from '../types'

export function useUser() {
  const { address, isConnected } = useAppKitAccount()
  const { user, setUser, setShowUsernameModal } = useStore()

  useEffect(() => {
    if (!isConnected || !address) {
      setUser(null)
      return
    }

    async function loadOrCreateUser() {
      const { data: existing } = await Bolt Database
        .from('users')
        .select('*')
        .eq('wallet_address', address!.toLowerCase())
        .maybeSingle()

      if (existing) {
        setUser(existing as User)
        return
      }

      const refCode = localStorage.getItem('ref_code')
      const newUser = {
        wallet_address: address!.toLowerCase(),
        referral_code: genCode(),
        referred_by: refCode || null,
        points: 0,
        tier: 'Bronze',
        discord_connected: false,
        theme: 'dark',
      }

      const { data: created } = await Bolt Database
        .from('users')
        .insert(newUser)
        .select()
        .single()

      if (created) {
        setUser(created as User)
        setShowUsernameModal(true)

        if (refCode) {
          const { data: referrer } = await Bolt Database
            .from('users')
            .select('id')
            .eq('referral_code', refCode)
            .maybeSingle()

          if (referrer) {
            await supabase.from('referrals').insert({
              referrer_id: referrer.id,
              referred_id: created.id,
              points_awarded: 0,
              first_trade_done: false,
            })
          }
          localStorage.removeItem('ref_code')
        }
      }
    }

    loadOrCreateUser()
  }, [isConnected, address])

  async function updateUser(updates: Partial<User>) {
    if (!user) return
    const newPoints = updates.points ?? user.points
    const { data } = await Bolt Database
      .from('users')
      .update({ ...updates, tier: getTier(newPoints) })
      .eq('id', user.id)
      .select()
      .single()
    if (data) setUser(data as User)
  }

  async function deleteAccount() {
    if (!user) return
    await supabase.from('users').delete().eq('id', user.id)
    setUser(null)
  }

  return { user, updateUser, deleteAccount }
}
