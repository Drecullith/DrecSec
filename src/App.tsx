import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { OmarchyContributionsPage } from './pages/OmarchyContributionsPage'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const content = path === '/projects/omarchy-contributions' ? <OmarchyContributionsPage /> : <HomePage />

  return (
    <div className="page">
      <Header />
      {content}
      <footer className="footer">
        <div className="shell footer-inner">
          <div><strong>DRECSEC</strong><span>Cybersecurity portfolio by Drecullith</span></div>
          <p>© {new Date().getFullYear()} Drecullith. Built in public.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
