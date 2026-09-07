import { useState } from 'react'
import { Mark } from './Mark'

export function Header() {
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a href="/" className="brand" aria-label="DrecSec home" onClick={close}>
          <Mark />
          <span><strong>DRECSEC</strong><small>by Drecullith</small></span>
        </a>

        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /></button>

        <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <a href="#about" onClick={close}>About</a>
          <a href="#projects" onClick={close}>Projects</a>
          <a href="#journey" onClick={close}>Journey</a>
          <a href="https://github.com/Drecullith" target="_blank" rel="noreferrer" onClick={close}>GitHub ↗</a>
        </nav>
      </div>
    </header>
  )
}
