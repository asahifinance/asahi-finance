import { useState, useEffect, useCallback } from 'react'
import { ArrowUpDown, Settings2, ChevronDown, ExternalLink } from 'lucide-react'
import { ethers } from 'ethers'
import axios from 'axios'
import { useAppStore } from '../store/useAppStore'
import { useNotifications } from '../hooks/useNotifications'
import { supabase } from '../lib/supabase'
import { Card } from '../components/ui'
import { Button } from '../components/ui'
import { CHAINS } from '../types'
import toast from 'react-hot-toast'

const SLIPPAGE_OPTIONS = ['0.1', '0.5', '1.0']

interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export default function Spot() {
  const { walletAddress, chainId, user, setShowConnectModal } = useAppStore()
  const { addNotification } = useNotifications()
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null)
  const [toToken, setToToken] = useState<TokenInfo | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [slippage, setSlippage] = useState('0.5')
  const [customSlippage, setCustomSlippage] = useState('')
  const [showSlippage, setShowSlippage] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [rate, setRate] = useState('')
  const [priceImpact, setPriceImpact] = useState('')
  const [showFromList, setShowFromList] = useState(false)
  const [showToList, setShowToList] = useState(false)
  const [tokenSearch, setTokenSearch] = useState('')

  const selectedChain = CHAINS.find(c => c.id === chainId) || CHAINS[0]

  // Load tokens from 1inch
  useEffect(() => {
    async function loadTokens() {
      try {
        const { data } = await axios.get(
          `https://api.1inch.dev/swap/v6.0/${chainId}/tokens`,
          { headers: { Authorization: `Bearer ${import.meta.env.VITE_1INCH_API_KEY}` } }
        )
        const list = Object.values(data.tokens) as TokenInfo[]
        setTokens(list.slice(0, 200))
        setFromToken(list.find(t => t.symbol === 'ETH' || t.symbol === 'WETH') || list[0])
        setToToken(list.find(t => t.symbol === 'USDC') || list[1])
      } catch {
        // fallback tokens
        setTokens([
          { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
          { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
          { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', name: 'Tether', decimals: 6 },
        ])
      }
    }
    loadTokens()
  }, [chainId])

  // Get quote
  const getQuote = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('')
      return
    }
    setQuoteLoading(true)
    try {
      const amount = ethers.parseUnits(fromAmount, fromToken.decimals).toString()
      const { data } = await axios.get(
        `https://api.1inch.dev/swap/v6.0/${chainId}/quote`,
        {
          params: { src: fromToken.address, dst: toToken.address, amount },
          headers: { Authorization: `Bearer ${import.meta.env.VITE_1INCH_API_KEY}` },
        }
      )
      const out = parseFloat(ethers.formatUnits(data.dstAmount, toToken.decimals))
      setToAmount(out.toFixed(6))
      setRate(`1 ${fromToken.symbol} = ${(out / parseFloat(fromAmount)).toFixed(4)} ${toToken.symbol}`)
      setPriceImpact(data.estimatedGas ? `~${(data.estimatedGas / 100000).toFixed(2)}%` : '<0.1%')
    } catch {
      setToAmount('')
      setRate('')
    } finally {
      setQuoteLoading(false)
    }
  }, [fromToken, toToken, fromAmount, chainId])

  useEffect(() => {
    const timer = setTimeout(getQuote, 500)
    return () => clearTimeout(timer)
  }, [getQuote])

  const handleSwap = async () => {
    if (!walletAddress || !fromToken || !toToken || !fromAmount) return
    if (!window.ethereum) { toast.error('MetaMask required'); return }
    setSwapping(true)
    try {
      const amount = ethers.parseUnits(fromAmount, fromToken.decimals).toString()
      const feeWallet = import.meta.env.VITE_FEE_WALLET
      const { data } = await axios.get(
        `https://api.1inch.dev/swap/v6.0/${chainId}/swap`,
        {
          params: {
            src: fromToken.address,
            dst: toToken.address,
            amount,
            from: walletAddress,
            slippage: parseFloat(customSlippage || slippage),
            fee: 0.2,
            referrerAddress: feeWallet,
          },
          headers: { Authorization: `Bearer ${import.meta.env.VITE_1INCH_API_KEY}` },
        }
      )
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const tx = await signer.sendTransaction({
        to: data.tx.to,
        data: data.tx.data,
        value: BigInt(data.tx.value || '0'),
        gasLimit: BigInt(Math.floor(data.tx.gas * 1.2)),
      })
      const receipt = await tx.wait()

      // Calculate USD value (rough estimate)
      const usdVolume = parseFloat(fromAmount) * 2000 // simplified
      const pointsEarned = Math.floor(usdVolume / 10)

      // Save to Supabase
      if (user) {
        await supabase.from('trades').insert({
          user_id: user.id,
          trade_type: 'spot',
          from_token: fromToken.symbol,
          to_token: toToken.symbol,
          from_amount: parseFloat(fromAmount),
          to_amount: parseFloat(toAmount),
          usd_volume: usdVolume,
          points_earned: pointsEarned,
          tx_hash: receipt?.hash,
          chain_id: chainId,
        })
        await supabase.from('users').update({ points: (user.points || 0) + pointsEarned }).eq('id', user.id)

        // Check referral first trade
        const { data: ref } = await supabase
          .from('referrals')
          .select('*')
          .eq('referred_id', user.id)
          .eq('first_trade_completed', false)
          .single()
        if (ref) {
          await supabase.from('referrals').update({ first_trade_completed: true }).eq('id', ref.id)
          await supabase.from('users').update({ points: supabase.rpc('increment', { x: 10 }) }).eq('id', ref.referrer_id)
        }

        await addNotification('spot_success', `Swapped ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}. Earned +${pointsEarned} pts!`)
      }

      toast.success(
        <div>
          Swap successful! +{pointsEarned} pts 🔥
          <a href={`${selectedChain.explorer}/tx/${receipt?.hash}`} target="_blank" rel="noopener noreferrer"
            className="block text-xs text-gold mt-1">View on explorer ↗</a>
        </div>
      )
      setFromAmount('')
      setToAmount('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Swap failed'
      await addNotification('spot_fail', `Swap failed: ${fromToken.symbol} → ${toToken.symbol}`)
      toast.error(message.includes('user rejected') ? 'Transaction rejected' : 'Swap failed')
    } finally {
      setSwapping(false)
    }
  }

  const flipTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount('')
  }

  const filteredTokens = tokens.filter(t =>
    t.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.name.toLowerCase().includes(tokenSearch.toLowerCase())
  )

  const swapReady = walletAddress && fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl">Spot Trading</h1>
        <p className="text-text-secondary text-sm mt-1">Swap tokens with best rates via 1inch</p>
      </div>

      {/* Chain selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CHAINS.map(chain => (
          <button key={chain.id}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${chainId === chain.id ? 'border-gold bg-gold/10 text-gold' : 'border-border text-text-secondary hover:border-border-light hover:text-white'}`}
          >
            {chain.name}
          </button>
        ))}
      </div>

      {/* Swap Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-semibold">Swap</span>
          <button onClick={() => setShowSlippage(!showSlippage)} className="p-2 rounded-xl hover:bg-bg-elevated transition-colors">
            <Settings2 size={16} className="text-text-secondary hover:text-white" />
          </button>
        </div>

        {/* Slippage Settings */}
        {showSlippage && (
          <div className="mb-4 p-3 bg-bg-primary rounded-xl">
            <p className="text-xs text-text-secondary mb-2">Slippage Tolerance</p>
            <div className="flex gap-2">
              {SLIPPAGE_OPTIONS.map(s => (
                <button key={s}
                  onClick={() => setSlippage(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${slippage === s ? 'border-gold bg-gold/10 text-gold' : 'border-border text-text-secondary hover:border-border-light'}`}
                >{s}%</button>
              ))}
              <input
                className="flex-1 bg-bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-gold min-w-0"
                placeholder="Custom %"
                value={customSlippage}
                onChange={e => setCustomSlippage(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* From */}
        <div className="bg-bg-primary rounded-xl p-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">From</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowFromList(true); setTokenSearch('') }}
              className="flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2 hover:bg-bg-elevated transition-colors flex-shrink-0"
            >
              {fromToken?.logoURI && <img src={fromToken.logoURI} className="w-5 h-5 rounded-full" alt="" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />}
              <span className="font-semibold text-sm">{fromToken?.symbol || 'Select'}</span>
              <ChevronDown size={14} className="text-text-secondary" />
            </button>
            <input
              className="flex-1 bg-transparent text-xl font-display font-bold text-right outline-none placeholder-text-muted"
              placeholder="0.0"
              value={fromAmount}
              onChange={e => setFromAmount(e.target.value)}
              type="number"
            />
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={flipTokens}
            className="w-9 h-9 rounded-xl bg-bg-elevated border border-border hover:border-gold hover:bg-gold/10 flex items-center justify-center transition-all"
          >
            <ArrowUpDown size={16} className="text-text-secondary hover:text-gold" />
          </button>
        </div>

        {/* To */}
        <div className="bg-bg-primary rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">To</span>
            {quoteLoading && <span className="text-xs text-text-secondary animate-pulse">Getting quote...</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowToList(true); setTokenSearch('') }}
              className="flex items-center gap-2 bg-bg-surface rounded-xl px-3 py-2 hover:bg-bg-elevated transition-colors flex-shrink-0"
            >
              {toToken?.logoURI && <img src={toToken.logoURI} className="w-5 h-5 rounded-full" alt="" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />}
              <span className="font-semibold text-sm">{toToken?.symbol || 'Select'}</span>
              <ChevronDown size={14} className="text-text-secondary" />
            </button>
            <div className="flex-1 text-xl font-display font-bold text-right text-text-secondary">
              {toAmount || '0.0'}
            </div>
          </div>
        </div>

        {/* Swap Info */}
        {rate && (
          <div className="mt-3 p-3 bg-bg-primary rounded-xl space-y-1.5 text-xs text-text-secondary">
            <div className="flex justify-between"><span>Rate</span><span className="text-white">{rate}</span></div>
            <div className="flex justify-between"><span>Price Impact</span><span className="text-emerald">{priceImpact}</span></div>
            <div className="flex justify-between"><span>Platform Fee</span><span className="text-white">0.2%</span></div>
            <div className="flex justify-between"><span>Slippage</span><span className="text-white">{customSlippage || slippage}%</span></div>
          </div>
        )}

        {/* Swap Button */}
        <div className="mt-4">
          {!walletAddress ? (
            <Button className="w-full" onClick={() => setShowConnectModal(true)}>Connect Wallet</Button>
          ) : !fromToken || !toToken ? (
            <Button className="w-full" disabled>Select Tokens</Button>
          ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
            <Button className="w-full" disabled>Enter Amount</Button>
          ) : (
            <Button className="w-full" onClick={handleSwap} loading={swapping} disabled={!swapReady}>
              Swap {fromToken?.symbol} → {toToken?.symbol}
            </Button>
          )}
        </div>
      </Card>

      {/* Token list modals */}
      {(showFromList || showToList) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => { setShowFromList(false); setShowToList(false) }} />
          <div className="relative bg-bg-surface border border-border rounded-2xl w-full max-w-sm max-h-[70vh] flex flex-col animate-slide-up">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold mb-3">Select Token</h3>
              <input
                className="input text-sm"
                placeholder="Search token..."
                value={tokenSearch}
                onChange={e => setTokenSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredTokens.slice(0, 50).map(token => (
                <button
                  key={token.address}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors text-left"
                  onClick={() => {
                    if (showFromList) setFromToken(token)
                    else setToToken(token)
                    setShowFromList(false)
                    setShowToList(false)
                  }}
                >
                  {token.logoURI && <img src={token.logoURI} className="w-8 h-8 rounded-full" alt="" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />}
                  <div>
                    <div className="font-semibold text-sm">{token.symbol}</div>
                    <div className="text-xs text-text-secondary">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <ExternalLink size={12} />
        <span>Powered by 1inch — best rates aggregated from 300+ DEXes</span>
      </div>
    </div>
  )
}
