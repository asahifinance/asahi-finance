import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { BottomNav } from './components/BottomNav'
import { NotificationPanel } from './components/NotificationPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { UsernameModal } from './components/UsernameModal'
import { ConnectWalletModal } from './components/ConnectWalletModal'
import { Toast } from './components/ui'
import Dashboard from './pages/Dashboard'
import Spot from './pages/Spot'
import Perp from './pages/Perp'
import Community from './pages/Community'
import Docs from './pages/Docs'

// Handle referral redirect
function RefHandler() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  useEffect(() => {
    if (code) {
      localStorage.setItem('ref_code', code)
    }
    navigate('/', { replace: true })
  }, [code, navigate])
  return null
}

function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <TopBar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-56 p-4 md:p-6 pb-24 md:pb-6 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/spot" element={<Spot />} />
            <Route path="/perp" element={<Perp />} />
            <Route path="/community" element={<Community />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/ref/:code" element={<RefHandler />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
      <NotificationPanel />
      <SettingsPanel />
      <UsernameModal />
      <ConnectWalletModal />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
