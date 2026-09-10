import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './portfolio.css'
import './highlights.css'
import './updates.css'
import './home-visuals.css'
import './polish.css'
import './lychnos-mascot.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
