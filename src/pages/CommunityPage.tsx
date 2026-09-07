import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

type ProfileSummary = {
  id: string
  username: string
  display_name: string | null
  skill_level: string
  focus: string[] | null
  role: string
}

type Post = {
  id: number
  body: string
  created_at: string
  author_id: string
  profiles: {
    username: string
    display_name: string | null
    role: string
  } | null
}

export function CommunityPage() {
  const { configured, user } = useAuth()
  const [members, setMembers] = useState<ProfileSummary[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(configured)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCommunity = useCallback(async () => {
    if (!supabase) return
    setError(null)

    const [profilesResult, postsResult] = await Promise.all([
      supabase.from('profiles').select('id, username, display_name, skill_level, focus, role').order('created_at', { ascending: true }).limit(24),
      supabase.from('posts').select('id, body, created_at, author_id, profiles!posts_author_id_fkey(username, display_name, role)').order('created_at', { ascending: false }).limit(40),
    ])

    if (profilesResult.error) setError(profilesResult.error.message)
    else setMembers((profilesResult.data ?? []) as ProfileSummary[])

    if (postsResult.error) setError(postsResult.error.message)
    else setPosts((postsResult.data ?? []) as unknown as Post[])

    setLoading(false)
  }, [])

  useEffect(() => {
    if (!configured) return
    void loadCommunity()
  }, [configured, loadCommunity])

  async function publish(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user || !body.trim()) return
    setPosting(true)
    setError(null)

    const clean = body.trim()
    const { error: insertError } = await supabase.from('posts').insert({ author_id: user.id, body: clean })

    if (insertError) setError(insertError.message)
    else {
      setBody('')
      await loadCommunity()
    }
    setPosting(false)
  }

  const memberCount = useMemo(() => members.length, [members])

  if (!configured) {
    return (
      <main className="app-main shell community-page">
        <section className="page-heading"><span className="kicker">COMMUNITY / STAGING</span><h1>The room is built. The backend is next.</h1><p>Profiles, discussions and live rooms are already wired into the frontend. They stay disabled until the database and authentication rules are connected.</p></section>
        <div className="community-beta-grid">
          <div className="system-card"><h2>What switches on with Supabase</h2><ul className="check-list"><li>Verified member accounts</li><li>Public member profiles</li><li>Authenticated discussion posts</li><li>Row-level security on every write</li><li>Real-time channel messages</li></ul></div>
          <div className="system-card"><span className="kicker">SECURITY FIRST</span><h2>No fake demo identities.</h2><p>DrecSec will not pretend accounts or live messages exist before the real backend exists.</p><Link className="button secondary" to="/account">Account status</Link></div>
        </div>
      </main>
    )
  }

  return (
    <main className="app-main shell community-page">
      <section className="page-heading split-heading">
        <div><span className="kicker">COMMUNITY / BETA</span><h1>Learn together. Prove the work.</h1><p>Permission-based security learning, open source, CTF methodology and project building.</p></div>
        <div className="community-stat"><strong>{memberCount}</strong><span>members loaded</span></div>
      </section>

      {error && <div className="form-message error community-error">{error}</div>}

      <div className="community-layout">
        <section className="feed-column">
          <div className="section-inline-heading"><div><span className="kicker">DISCUSSIONS</span><h2>Build log</h2></div><Link className="button secondary compact" to="/chat">Live rooms →</Link></div>

          {user ? (
            <form className="composer" onSubmit={publish}>
              <textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} rows={4} placeholder="Share a lesson, project update, lab takeaway, or question…" required />
              <div><small>{body.length}/2000</small><button className="button primary" type="submit" disabled={posting || !body.trim()}>{posting ? 'Posting…' : 'Publish'}</button></div>
            </form>
          ) : (
            <div className="sign-in-nudge">Want to post? <Link to="/account">Sign in or create an account →</Link></div>
          )}

          <div className="post-list">
            {loading ? <div className="system-card">Loading community…</div> : posts.length === 0 ? <div className="empty-state">No posts yet. The first member gets bragging rights.</div> : posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-head">
                  <Link to={`/u/${post.profiles?.username ?? 'member'}`}><strong>{post.profiles?.display_name || post.profiles?.username || 'Member'}</strong><span>@{post.profiles?.username || 'member'}</span></Link>
                  <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>
                </div>
                <p>{post.body}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="members-column">
          <div className="section-inline-heading"><div><span className="kicker">MEMBERS</span><h2>Directory</h2></div></div>
          <div className="member-list">
            {members.map((member) => (
              <Link className="member-card" to={`/u/${member.username}`} key={member.id}>
                <div className="avatar-placeholder small">{(member.display_name || member.username).slice(0, 2).toUpperCase()}</div>
                <div><strong>{member.display_name || member.username}</strong><span>@{member.username}</span><small>{member.skill_level}</small></div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
