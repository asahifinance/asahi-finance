import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowUpDown, ChevronDown, Info } from 'lucide-react'
import { useStore } from '../store'
import { useWallet } from '../hooks/useWallet'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import {supabase } from '../supabase'
import { CHAINS } from '../types'
import { getTier } from '../utils'
import toast from 'react-hot-toast'

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0, 2.0]

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function TokenDropdown({ tokens, selected, onSelect }: {
  tokens: Token[]
  selected: Token | null
  onSelect: (t: Token) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#161625] border border-[#1e1e35] rounded-xl px-3 py-2 text-sm font-medium hover:border-[#2a2a45] transition-colors"
      >
        {selected ? (
          <>
            {selected.logoURI && (
              <img src={selected.logoURI} alt="" className="w-5 h-5 rounded-full"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
            <span className="text-[#f0f0ff]">{selected.symbol}</span>
          </>
        ) : (
          <span className="text-[#8888aa]">Select token</span>
        )}
        <ChevronDown size={14} className="text-[#8888aa]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 w-56 bg-[#0f0f1a] border border-[#1e1e35] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tokens..."
                className="w-full bg-[#161625] border border-[#1e1e35] rounded-lg px-3 py-2 text-xs text-[#f0f0ff] placeholder-[#44445a] outline-none"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.slice(0, 50).map((t) => (
                <button
                  key={t.address}
                  onClick={() => { onSelect(t); setOpen(false); setSearch('') }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#161625] text-left transition-colors"
                >
                  {t.logoURI && (
                    <img src={t.logoURI} alt="" className="w-6 h-6 rounded-full shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#f0f0ff]">{t.symbol}</p>
                    <p className="text-xs text-[#44445a] truncate">{t.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Spot() {
  const { user, setUser } = useStore()
  const { isConnected, connect } = useWallet()
  const [selectedChain, setSelectedChain] = useState(CHAINS[0])
  const [tokens, setTokens] = useState<Token[]>([])
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [rate, setRate] = useState<string | null>(null)

  const debouncedAmount = useDebounce(fromAmount, 500)
  const apiBase = `https://api.1inch.dev/swap/v6.0/${selectedChain.id}`
  const headers = { Authorization: `Bearer ${import.meta.env.VITE_1INCH_API_KEY}` }

  useEffect(() => {
    setFromToken(null)
    setToToken(null)
    setTokens([])
    async function fetchTokens() {
      try {
        const res = await axios.get(`${apiBase}/tokens`, { headers })
        setTokens(Object.values(res.data.tokens) as Token[])
      } catch {
        toast.error('Failed to load tokens')
      }
    }
    fetchTokens()
  }, [selectedChain.id])

  useEffect(() => {
    if (!fromToken || !toToken || !debouncedAmount || parseFloat(debouncedAmount) <= 0) {
      setToAmount('')
      setRate(null)
      return
    }
    async function fetchQuote() {
      setLoadingQuote(true)
      try {
        const amountWei = BigInt(Math.floor(parseFloat(debouncedAmount) * 10 ** fromToken!.decimals)).toString()
        const res = await axios.get(`${apiBase}/quote`, {
          headers,
          params: { src: fromToken!.address, dst: toToken!.address, amount: amountWei },
        })
        const outFormatted = (parseInt(res.data.dstAmount) / 10 ** toToken!.decimals).toFixed(6)
        setToAmount(outFormatted)
        setRate(`1 ${fromToken!.symbol} = ${(parseFloat(outFormatted) / parseFloat(debouncedAmount)).toFixed(6)} ${toToken!.symbol}`)
      } catch {
        setToAmount('')
        setRate(null)
      }
      setLoadingQuote(false)
    }
    fetchQuote()
  }, [fromToken?.address, toToken?.address, debouncedAmount, selectedChain.id])

  function flip() {
    const tmp = fromToken
    setFromToken(toToken)
    setToToken(tmp)
    setFromAmount(toAmount)
    setToAmount('')
  }

  async function handleSwap() {
    if (!isConnected || !fromToken || !toToken || !fromAmount || !user) return
    setSwapping(true)
    try {
      const amountWei = BigInt(Math.floor(parseFloat(fromAmount) * 10 ** fromToken.decimals)).toString()
      const feeWallet = import.meta.env.VITE_FEE_WALLET
      const params: Record<string, string> = {
        src: fromToken.address,
        dst: toToken.address,
        amount: amountWei,
        from: user.wallet_address,
        slippage: slippage.toString(),
        fee: '0.2',
      }
      if (feeWallet) params.referrerAddress = feeWallet

      await axios.get(`${apiBase}/swap`, { headers, params })

      const usdVolume = parseFloat(fromAmount)
      const pointsEarned = Math.floor(usdVolume / 5)

      await supabase.from('trades').insert({
        user_id: user.id,
        from_token: fromToken.symbol,
        to_token: toToken.symbol,
        from_amount: parseFloat(fromAmount),
        to_amount: parseFloat(toAmount),
        usd_volume: usdVolume,
        points_earned: pointsEarned,
        tx_hash: 'pending',
        chain_id: selectedChain.id,
      })

      const newPoints = user.points + pointsEarned
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ points: newPoints, tier: getTier(newPoints) })
        .eq('id', user.id)
        .select()
        .single()
      if (updatedUser) setUser(updatedUser)

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'trade',
        message: `Swapped ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}. +${pointsEarned} pts`,
        is_read: false,
      })

      if (pointsEarned > 0) {
        const { data: referral } = await supabase
          .from('referrals')
          .select('*, referrer:referrer_id(id, points)')
          .eq('referred_id', user.id)
          .eq('first_trade_done', false)
          .maybeSingle()

        if (referral) {
          const bonusPoints = Math.floor(pointsEarned * 0.1)
          const referrerPoints = (referral.referrer?.points || 0) + bonusPoints
          await Promise.all([
            supabase.from('users').update({ points: referrerPoints, tier: getTier(referrerPoints) }).eq('id', referral.referrer_id),
            supabase.from('referrals').update({ first_trade_done: true, points_awarded: bonusPoints }).eq('id', referral.id),
            supabase.from('notifications').insert({
              user_id: referral.referrer_id,
              type: 'referral',
              message: `Your referral traded! You earned +${bonusPoints} bonus points.`,
              is_read: false,
            }),
          ])
        }
      }

      toast.success(`Swap initiated! +${pointsEarned} points earned`)
      setFromAmount('')
      setToAmount('')
    } catch (e: any) {
      toast.error(e?.response?.data?.description || 'Swap failed')
    }
    setSwapping(false)
  }

  function getButtonState() {
    if (!isConnected) return { label: 'Connect Wallet', action: connect, disabled: false }
    if (!fromToken || !toToken) return { label: 'Select Tokens', action: () => {}, disabled: true }
    if (!fromAmount || parseFloat(fromAmount) <= 0) return { label: 'Enter Amount', action: () => {}, disabled: true }
    return { label: 'Swap', action: handleSwap, disabled: false }
  }

  const btn = getButtonState()

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#f0f0ff]">Spot Swap</h2>
          <div className="flex gap-1 bg-[#080811] rounded-xl p-1">
            {CHAINS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChain(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedChain.id === c.id
                    ? 'bg-gradient-to-r from-[#e8b44b] to-[#7c3aed] text-white'
                    : 'text-[#8888aa] hover:text-white'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#161625] rounded-xl p-4 mb-2 border border-[#1e1e35]">
          <p className="text-xs text-[#8888aa] mb-2">From</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              min="0"
              className="flex-1 bg-transparent text-2xl font-semibold text-[#f0f0ff] placeholder-[#44445a] outline-none"
            />
            <TokenDropdown tokens={tokens} selected={fromToken} onSelect={setFromToken} />
          </div>
        </div>

        <div className="flex justify-center my-1">
          <button
            onClick={flip}
            className="w-8 h-8 rounded-xl bg-[#161625] border border-[#1e1e35] flex items-center justify-center hover:bg-[#1e1e35] hover:border-[#e8b44b]/40 transition-all text-[#8888aa] hover:text-[#e8b44b]"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>

        <div className="bg-[#161625] rounded-xl p-4 mb-4 border border-[#1e1e35]">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-[#8888aa]">To</p>
            {loadingQuote && <span className="text-xs text-[#8888aa] animate-pulse">Fetching quote...</span>}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold text-[#f0f0ff] placeholder-[#44445a] outline-none cursor-default"
            />
            <TokenDropdown tokens={tokens} selected={toToken} onSelect={setToToken} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4 text-xs text-[#8888aa]">
          {rate && (
            <div className="flex items-center gap-1">
              <Info size={12} />
              <span>{rate}</span>
            </div>
          )}
          <span>Fee: 0.2%</span>
          <div className="flex items-center gap-1 ml-auto">
            <span>Slippage:</span>
            {SLIPPAGE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  slippage === s ? 'bg-[#e8b44b]/20 text-[#e8b44b]' : 'hover:text-white'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>

        <Button onClick={btn.action} disabled={btn.disabled} loading={swapping} className="w-full py-3 text-base">
          {btn.label}
        </Button>
      </Card>
    </div>
  )
      }
            
