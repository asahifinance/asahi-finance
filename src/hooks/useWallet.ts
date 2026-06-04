import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../lib/supabase'
import { generateReferralCode, getTierFromPoints } from '../lib/utils'
import toast from 'react-hot-toast'

export function useWallet() {
  const {
    walletAddress,
    chainId,
    ethBalance,
    isConnecting,
    setWalletAddress,
    setChainId,
    setEthBalance,
    setIsConnecting,
    setUser,
    setShowUsernameModal,
  } = useAppStore()

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to connect your wallet')
      return
    }

    setIsConnecting(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]
      const network = await provider.getNetwork()
      const balance = await provider.getBalance(address)

      setWalletAddress(address)
      setChainId(Number(network.chainId))
      setEthBalance(ethers.formatEther(balance).slice(0, 8))

      // Check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single()

      if (existingUser) {
        setUser({
          ...existingUser,
          tier: getTierFromPoints(existingUser.points),
        })
      } else {
        // New user — check for referral in localStorage
        const referredBy = localStorage.getItem('ref_code')
        const referralCode = generateReferralCode()

        const { data: newUser } = await supabase
          .from('users')
          .insert({
            wallet_address: address.toLowerCase(),
            referral_code: referralCode,
            referred_by: referredBy || null,
            points: 0,
            tier: 'Bronze',
            theme: 'dark',
          })
          .select()
          .single()

        if (newUser) {
          setUser({ ...newUser, tier: 'Bronze' })
          // If referred, create referral record
          if (referredBy) {
            const { data: referrer } = await supabase
              .from('users')
              .select('id')
              .eq('referral_code', referredBy)
              .single()
            if (referrer) {
              await supabase.from('referrals').insert({
                referrer_id: referrer.id,
                referred_id: newUser.id,
                first_trade_completed: false,
              })
            }
            localStorage.removeItem('ref_code')
          }
        }
        setShowUsernameModal(true)
      }

      // Listen for account/chain changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setWalletAddress(accounts[0])
        }
      })

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16))
      })

      toast.success('Wallet connected!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet'
      toast.error(message)
    } finally {
      setIsConnecting(false)
    }
  }, [setWalletAddress, setChainId, setEthBalance, setIsConnecting, setUser, setShowUsernameModal])

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null)
    setUser(null)
    setEthBalance('0')
    toast.success('Wallet disconnected')
  }, [setWalletAddress, setUser, setEthBalance])

  const switchChain = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (err) {
      toast.error('Failed to switch network')
    }
  }, [])

  return { walletAddress, chainId, ethBalance, isConnecting, connectWallet, disconnectWallet, switchChain }
}
