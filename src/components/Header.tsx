import { useState } from 'react'
import { navigation } from '../data/site'
import { Mark } from './Mark'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a href="#top" className="brand" aria-label="DrecSec home" onClick={() => setOpen(false)}>
          <Mark />
          <span>
            <strong>DRECSEC</strong>
            <small>by Drecullith</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="https://github.com/Drecullith" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
