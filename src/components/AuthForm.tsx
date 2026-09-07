import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,24}$/

export function AuthForm() {
  const { configured } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!supabase || !configured) {
      setError('The DrecSec authentication backend is not connected yet.')
      return
    }

    if (mode === 'signup' && !USERNAME_PATTERN.test(username)) {
      setError('Username must be 3–24 characters using letters, numbers, or underscores.')
      return
    }

    if (password.length < 8) {
      setError('Use a password of at least 8 characters.')
      return
    }

    setBusy(true)

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        navigate('/profile')
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
          data: { username },
        },
      })

      if (signUpError) throw signUpError

      if (data.session) {
        navigate('/profile')
      } else {
        setMessage('Account created. Check your email to confirm it, then sign in.')
        setMode('signin')
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!configured) {
    return (
      <div className="system-card auth-offline">
        <span className="kicker">BACKEND / WAITING</span>
        <h2>Accounts are being wired up.</h2>
        <p>The public portfolio is live. Authentication will switch on as soon as the DrecSec Supabase project is connected.</p>
        <Link className="button secondary" to="/">Back to portfolio</Link>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs" role="tablist" aria-label="Account action">
        <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Sign in</button>
        <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Create account</button>
      </div>

      <form onSubmit={submit} className="form-stack">
        <div>
          <span className="kicker">DRECSEC / IDENTITY</span>
          <h1>{mode === 'signin' ? 'Welcome back.' : 'Join the build.'}</h1>
          <p>{mode === 'signin' ? 'Sign in to manage your profile and take part in DrecSec.' : 'Create a community identity. No anonymous chaos pit required.'}</p>
        </div>

        {mode === 'signup' && (
          <label>
            <span>Username</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="Drecullith" required />
            <small>3–24 characters: letters, numbers, underscores.</small>
          </label>
        )}

        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" required />
        </label>

        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required />
          {mode === 'signup' && <small>Minimum 8 characters. A password manager is strongly recommended.</small>}
        </label>

        {error && <div className="form-message error" role="alert">{error}</div>}
        {message && <div className="form-message success" role="status">{message}</div>}

        <button className="button primary" type="submit" disabled={busy}>{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      </form>
    </div>
  )
}
