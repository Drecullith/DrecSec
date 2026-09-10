import { useEffect, useState } from 'react'
import { Mark } from './Mark'

export function Header() {
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a href="/" className="brand" aria-label="DrecSec home" onClick={close}>
          <Mark />
          <span><strong>DRECSEC</strong><small>by Drecullith</small></span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>

        <nav id="primary-navigation" className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <a href="/#about" onClick={close}>About</a>
          <a href="/#projects" onClick={close}>Projects</a>
          <a href="/#journey" onClick={close}>Journey</a>
          <a href="https://github.com/Drecullith" target="_blank" rel="noreferrer" onClick={close}>GitHub ↗</a>
        </nav>
      </div>
    </header>
  )
}
