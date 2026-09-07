import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import { ProfilePage } from './pages/ProfilePage'
import { PublicProfilePage } from './pages/PublicProfilePage'
import { CommunityPage } from './pages/CommunityPage'
import { ChatPage } from './pages/ChatPage'

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 0)
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location])

  return null
}

function App() {
  return (
    <div className="page">
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/u/:username" element={<PublicProfilePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="footer">
        <div className="shell footer-inner">
          <div><strong>DRECSEC</strong><span>Cybersecurity portfolio & community project</span></div>
          <p>© {new Date().getFullYear()} Drecullith. Built in public.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
