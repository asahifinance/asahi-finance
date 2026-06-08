import React from 'react'
import ReactDOM from 'react-dom/client'
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum, optimism, polygon, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'demo-project-id'

// Dibikin variabel konstan pakai 'as const' biar lolos validasi tipe data TypeScript pas build di Vercel
const supportedNetworks = [mainnet, arbitrum, optimism, polygon, base] as const

createAppKit({
  adapters: [new EthersAdapter()],
  networks: supportedNetworks,
  projectId,
  metadata: {
    name: 'Asahi Finance',
    description: 'DeFi Trading Platform',
    url: 'https://asahifinance.xyz',
    icons: ['/asahi.png'],
  },
  features: { analytics: false },
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
