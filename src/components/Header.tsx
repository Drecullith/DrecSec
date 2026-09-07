import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Mark } from './Mark'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  function close() {
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link to="/" className="brand" aria-label="DrecSec home" onClick={close}>
          <Mark />
          <span><strong>DRECSEC</strong><small>by Drecullith</small></span>
        </Link>

        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /></button>

        <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <Link to="/#about" onClick={close}>About</Link>
          <Link to="/#projects" onClick={close}>Projects</Link>
          <NavLink to="/community" onClick={close}>Community</NavLink>
          <NavLink to="/chat" onClick={close}>Live chat</NavLink>
          {user ? (
            <>
              <NavLink to="/profile" onClick={close}>Profile</NavLink>
              <button className="nav-button" type="button" onClick={() => { close(); void signOut() }}>Sign out</button>
            </>
          ) : (
            <NavLink className="nav-cta" to="/account" onClick={close}>Sign in</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
