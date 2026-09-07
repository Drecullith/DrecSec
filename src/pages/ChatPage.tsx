import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

type Channel = { id: number; slug: string; name: string; description: string | null }
type Message = {
  id: number
  body: string
  created_at: string
  author_id: string
  profiles: { username: string; display_name: string | null; role: string } | null
}

export function ChatPage() {
  const { configured, user } = useAuth()
  const [channels, setChannels] = useState<Channel[]>([])
  const [active, setActive] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const loadMessages = useCallback(async (channelId: number) => {
    if (!supabase) return
    const { data, error: queryError } = await supabase
      .from('messages')
      .select('id, body, created_at, author_id, profiles!messages_author_id_fkey(username, display_name, role)')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (queryError) setError(queryError.message)
    else setMessages((data ?? []) as unknown as Message[])
  }, [])

  useEffect(() => {
    if (!supabase || !configured) return
    void supabase.from('channels').select('id, slug, name, description').eq('is_archived', false).order('sort_order').then(({ data, error: queryError }) => {
      if (queryError) setError(queryError.message)
      else {
        const nextChannels = (data ?? []) as Channel[]
        setChannels(nextChannels)
        setActive(nextChannels[0] ?? null)
      }
    })
  }, [configured])

  useEffect(() => {
    if (!supabase || !active) return
    void loadMessages(active.id)

    const subscription = supabase
      .channel(`drecsec:${active.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${active.id}` }, () => {
        void loadMessages(active.id)
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(subscription)
    }
  }, [active, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user || !active || !draft.trim()) return
    setSending(true)
    setError(null)

    const { error: insertError } = await supabase.from('messages').insert({ channel_id: active.id, author_id: user.id, body: draft.trim() })
    if (insertError) setError(insertError.message)
    else setDraft('')
    setSending(false)
  }

  if (!configured) return <main className="app-main shell"><div className="system-card"><span className="kicker">LIVE CHAT / STAGING</span><h1>Real-time rooms are coded, not connected.</h1><p>DrecSec chat will use authenticated Supabase Realtime messages with database row-level security. No anonymous posting.</p><Link className="button secondary" to="/community">Back to community</Link></div></main>

  return (
    <main className="app-main shell chat-page">
      <section className="page-heading"><span className="kicker">LIVE / COMMUNITY</span><h1>DrecSec rooms.</h1><p>Real-time, account-bound discussion. Keep it legal, useful, and human.</p></section>
      {error && <div className="form-message error">{error}</div>}
      <div className="chat-shell">
        <aside className="chat-channels">
          <div className="chat-brand">DRECSEC <span>/ rooms</span></div>
          {channels.map((channel) => <button key={channel.id} type="button" className={active?.id === channel.id ? 'active' : ''} onClick={() => setActive(channel)}><span>#</span>{channel.name}</button>)}
        </aside>
        <section className="chat-room">
          <header><div><strong># {active?.name ?? 'room'}</strong><span>{active?.description}</span></div><span className="realtime-badge">REALTIME</span></header>
          <div className="message-list">
            {messages.length === 0 ? <div className="empty-state">Nothing here yet. Say hello without saying “first”.</div> : messages.map((message) => (
              <article className="message-row" key={message.id}>
                <div className="avatar-placeholder tiny">{(message.profiles?.display_name || message.profiles?.username || 'M').slice(0, 2).toUpperCase()}</div>
                <div><div className="message-meta"><Link to={`/u/${message.profiles?.username ?? 'member'}`}>{message.profiles?.display_name || message.profiles?.username || 'Member'}</Link><time>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div><p>{message.body}</p></div>
              </article>
            ))}
            <div ref={bottomRef} />
          </div>
          {user ? <form className="chat-composer" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1000} placeholder={`Message #${active?.name ?? 'room'}`} aria-label="Chat message" /><button className="button primary" type="submit" disabled={sending || !draft.trim()}>{sending ? '…' : 'Send'}</button></form> : <div className="chat-auth"><Link to="/account">Sign in to join the conversation →</Link></div>}
        </section>
      </div>
    </main>
  )
}
