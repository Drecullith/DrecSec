import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  skill_level: string
  focus: string[] | null
  github_url: string | null
  avatar_url: string | null
  role: string
}

const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,24}$/

export function ProfilePage() {
  const { configured, loading: authLoading, user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !user) return
    setLoading(true)
    void supabase
      .from('profiles')
      .select('id, username, display_name, bio, skill_level, focus, github_url, avatar_url, role')
      .eq('id', user.id)
      .single()
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message)
        else setProfile(data as Profile)
        setLoading(false)
      })
  }, [user])

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user || !profile) return
    setError(null)
    setMessage(null)

    if (!USERNAME_PATTERN.test(profile.username)) {
      setError('Username must be 3–24 characters using letters, numbers, or underscores.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        display_name: profile.display_name?.trim() || null,
        bio: profile.bio?.trim() || null,
        skill_level: profile.skill_level,
        focus: profile.focus ?? [],
        github_url: profile.github_url?.trim() || null,
        avatar_url: profile.avatar_url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) setError(updateError.message)
    else setMessage('Profile saved.')
    setSaving(false)
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user?.email) return

    setPasswordError(null)
    setPasswordMessage(null)

    if (newPassword.length < 12) {
      setPasswordError('Use a new password of at least 12 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('The new passwords do not match.')
      return
    }

    if (newPassword === currentPassword) {
      setPasswordError('Your new password must be different from your current password.')
      return
    }

    setPasswordSaving(true)

    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (verifyError) {
        setPasswordError('Current password is incorrect.')
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Password changed successfully.')
    } catch (caught) {
      setPasswordError(caught instanceof Error ? caught.message : 'Password change failed. Please try again.')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (authLoading) return <main className="app-main shell"><div className="system-card">Loading identity…</div></main>

  if (!configured) {
    return <main className="app-main shell"><div className="system-card"><span className="kicker">PROFILE / WAITING</span><h1>Profile backend not connected yet.</h1><p>The UI and database rules are in the build. Supabase needs to be connected before member data can exist.</p><Link className="button secondary" to="/">Back home</Link></div></main>
  }

  if (!user) {
    return <main className="app-main shell"><div className="system-card"><span className="kicker">PROFILE / AUTH REQUIRED</span><h1>Your DrecSec profile lives behind your account.</h1><p>Sign in or create an account first.</p><Link className="button primary" to="/account">Open account</Link></div></main>
  }

  if (loading) return <main className="app-main shell"><div className="system-card">Loading profile…</div></main>
  if (!profile) return <main className="app-main shell"><div className="system-card"><h1>Profile unavailable.</h1><p>{error ?? 'The profile row could not be loaded.'}</p></div></main>

  return (
    <main className="app-main shell profile-page">
      <section className="page-heading"><span className="kicker">IDENTITY / MEMBER</span><h1>Edit profile.</h1><p>This is the public identity other DrecSec members will see.</p></section>
      <form className="profile-layout" onSubmit={save}>
        <aside className="profile-preview">
          <div className="avatar-placeholder">{(profile.display_name || profile.username).slice(0, 2).toUpperCase()}</div>
          <span className="role-badge">{profile.role}</span>
          <h2>{profile.display_name || profile.username}</h2>
          <p>@{profile.username}</p>
          <small>{profile.skill_level}</small>
        </aside>
        <div className="form-stack system-card">
          <label><span>Username</span><input value={profile.username} onChange={(event) => setProfile({ ...profile, username: event.target.value })} required /></label>
          <label><span>Display name</span><input value={profile.display_name ?? ''} onChange={(event) => setProfile({ ...profile, display_name: event.target.value })} maxLength={60} /></label>
          <label><span>Bio</span><textarea value={profile.bio ?? ''} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} maxLength={280} rows={5} /></label>
          <label><span>Level</span><select value={profile.skill_level} onChange={(event) => setProfile({ ...profile, skill_level: event.target.value })}><option value="learning">Learning</option><option value="practitioner">Practitioner</option><option value="experienced">Experienced</option></select></label>
          <label><span>Focus areas</span><input value={(profile.focus ?? []).join(', ')} onChange={(event) => setProfile({ ...profile, focus: event.target.value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 8) })} placeholder="Linux, CTF, Web Security" /></label>
          <label><span>GitHub URL</span><input type="url" value={profile.github_url ?? ''} onChange={(event) => setProfile({ ...profile, github_url: event.target.value })} placeholder="https://github.com/username" /></label>
          <label><span>Avatar image URL</span><input type="url" value={profile.avatar_url ?? ''} onChange={(event) => setProfile({ ...profile, avatar_url: event.target.value })} placeholder="https://…" /></label>
          {error && <div className="form-message error">{error}</div>}
          {message && <div className="form-message success">{message}</div>}
          <button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
        </div>
      </form>

      <section className="page-heading"><span className="kicker">ACCOUNT / SECURITY</span><h2>Change password.</h2><p>Use a unique password generated by a password manager. DrecSec never stores the plaintext password.</p></section>
      <form className="form-stack system-card" onSubmit={changePassword}>
        <label><span>Current password</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /></label>
        <label><span>New password</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={12} required /><small>Minimum 12 characters. A unique password-manager-generated password is strongly recommended.</small></label>
        <label><span>Confirm new password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} required /></label>
        {passwordError && <div className="form-message error" role="alert">{passwordError}</div>}
        {passwordMessage && <div className="form-message success" role="status">{passwordMessage}</div>}
        <button className="button primary" type="submit" disabled={passwordSaving}>{passwordSaving ? 'Changing…' : 'Change password'}</button>
      </form>
    </main>
  )
}
