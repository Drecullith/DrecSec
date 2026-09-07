import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type PublicProfile = {
  username: string
  display_name: string | null
  bio: string | null
  skill_level: string
  focus: string[] | null
  github_url: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

export function PublicProfilePage() {
  const { username } = useParams()
  const { configured } = useAuth()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(configured)

  useEffect(() => {
    if (!supabase || !username) return
    void supabase.from('profiles').select('username, display_name, bio, skill_level, focus, github_url, avatar_url, role, created_at').ilike('username', username).single().then(({ data }) => {
      setProfile(data as PublicProfile | null)
      setLoading(false)
    })
  }, [username])

  if (!configured) return <main className="app-main shell"><div className="system-card"><h1>Member profiles are not online yet.</h1><p>The frontend is ready; the backend is waiting for its Supabase connection.</p></div></main>
  if (loading) return <main className="app-main shell"><div className="system-card">Loading member…</div></main>
  if (!profile) return <main className="app-main shell"><div className="system-card"><h1>Member not found.</h1><Link className="button secondary" to="/community">Back to community</Link></div></main>

  return (
    <main className="app-main shell public-profile-page">
      <section className="public-profile-card">
        {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="profile-avatar-image" /> : <div className="avatar-placeholder large">{(profile.display_name || profile.username).slice(0, 2).toUpperCase()}</div>}
        <span className="role-badge">{profile.role}</span>
        <h1>{profile.display_name || profile.username}</h1>
        <p className="username">@{profile.username}</p>
        <p className="public-bio">{profile.bio || 'No bio yet.'}</p>
        <div className="tags">{(profile.focus ?? []).map((item) => <span key={item}>{item}</span>)}</div>
        <div className="profile-meta"><span>{profile.skill_level}</span><span>Joined {new Date(profile.created_at).toLocaleDateString()}</span></div>
        {profile.github_url && <a className="button secondary" href={profile.github_url} target="_blank" rel="noreferrer">GitHub ↗</a>}
      </section>
    </main>
  )
}
