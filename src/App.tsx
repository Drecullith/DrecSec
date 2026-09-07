import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <div className="page">
      <Header />
      <HomePage />
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
