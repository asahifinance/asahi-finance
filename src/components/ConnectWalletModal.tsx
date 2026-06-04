import { X, Wallet } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useWallet } from '../hooks/useWallet'
import { Button } from './ui'

export function ConnectWalletModal() {
  const { showConnectModal, setShowConnectModal } = useAppStore()
  const { connectWallet, isConnecting } = useWallet()

  if (!showConnectModal) return null

  const handleConnect = async () => {
    await connectWallet()
    setShowConnectModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConnectModal(false)} />
      <div className="relative bg-bg-surface border border-border rounded-2xl p-8 w-full max-w-sm animate-slide-up">
        <button
          onClick={() => setShowConnectModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-bg-elevated transition-colors"
        >
          <X size={18} className="text-text-secondary" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4">
            <Wallet size={28} className="text-white" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Connect Wallet</h2>
          <p className="text-text-secondary text-sm">Connect your wallet to access all features</p>
        </div>

        <Button className="w-full" onClick={handleConnect} loading={isConnecting}>
          Connect MetaMask
        </Button>

        <p className="text-center text-xs text-text-muted mt-4">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
