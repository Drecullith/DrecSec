import { Link } from 'react-router-dom'
import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { channels, journey, projects } from '../data/site'

export function HomePage() {
  const [copied, setCopied] = useState(false)

  async function copyHandle() {
    try {
      await navigator.clipboard.writeText('Drecullith')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main>
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="status-pill"><span /> DrecSec v0.2 — backend connected</div>
          <p className="hero-kicker">CYBERSECURITY • OPEN SOURCE • CTF</p>
          <h1 id="hero-title">
            Learn the system.<br />
            <em>Break assumptions.</em><br />
            Build it better.
          </h1>
          <p className="hero-lede">
            DrecSec is the cybersecurity home of <strong>Drecullith</strong> — a living portfolio of practical learning,
            open-source work, ethical labs, and the community being built around them.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">Explore the work</a>
            <Link className="button secondary" to="/community">Enter community</Link>
          </div>
          <div className="identity-strip" aria-label="Profile summary">
            <button type="button" onClick={copyHandle} className="handle-button">
              <span className="prompt">$</span> whoami <strong>Drecullith</strong>
              <span className="copy-state">{copied ? 'copied' : 'copy'}</span>
            </button>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Current focus">
          <div className="panel-topline">
            <span>current_focus.json</span>
            <span className="live-dot">LIVE</span>
          </div>
          <pre>{`{
  "identity": "Drecullith",
  "project": "DrecSec",
  "focus": [
    "Linux / Omarchy",
    "open-source contribution",
    "ethical hacking",
    "CTF methodology"
  ],
  "principle": "permission first",
  "status": "learning in public"
}`}</pre>
          <div className="signal-line"><i /><i /><i /><i /><i /></div>
        </aside>
      </section>

      <section id="about" className="section shell about-section">
        <SectionHeading
          kicker="01 / About"
          title="A portfolio that earns its claims."
          body="No invented expert persona. DrecSec records the real work: what was built, what failed, what changed, what was learned, and what can be demonstrated."
        />
        <div className="principles-grid">
          <article><span>01</span><h3>Evidence over buzzwords</h3><p>Projects, commits, write-ups, reproducible labs, and clear explanations matter more than a wall of vague skill badges.</p></article>
          <article><span>02</span><h3>Legal & permission-based</h3><p>Security work belongs in systems you own, intentionally vulnerable labs, CTFs, and environments where testing is explicitly authorized.</p></article>
          <article><span>03</span><h3>Learn in public</h3><p>Progress stays visible. Beginner questions, review feedback, failed attempts, and improved methodology are part of the record.</p></article>
        </div>
      </section>

      <section id="projects" className="section shell">
        <SectionHeading kicker="02 / Projects" title="The workbench." body="Active projects and the systems around them. This section will later pull verified activity directly from GitHub." />
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-meta"><span>{project.eyebrow}</span><span className="project-status">{project.status}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="journey" className="section shell journey-section">
        <SectionHeading kicker="03 / Journey" title="The roadmap is part of the portfolio." body="DrecSec should show growth instead of pretending the destination came first." />
        <div className="timeline">
          {journey.map((step, index) => (
            <article key={step.title} className="timeline-item">
              <div className="timeline-index">0{index + 1}</div>
              <div><span className="kicker mini">{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="community" className="section shell community-section">
        <div className="community-card">
          <div className="community-copy">
            <span className="kicker">04 / Community</span>
            <h2>DrecSec grows beyond one profile.</h2>
            <p>Accounts, member profiles, moderated discussions and real-time rooms are being built on the same foundation — without turning the site into an anonymous chaos pit.</p>
            <div className="roadmap-pills"><span>Auth backend connected</span><span>Profiles beta</span><span>Community beta</span><span>Live chat beta</span></div>
            <div className="community-actions"><Link className="button primary" to="/community">Open community</Link><Link className="button secondary" to="/account">Create account</Link></div>
          </div>
          <div className="channel-window" aria-label="Channel preview">
            <div className="window-bar"><i /><i /><i /><span>drecsec / community</span></div>
            <div className="channel-body">
              {channels.map((channel, index) => (
                <div className={index === 1 ? 'channel active' : 'channel'} key={channel}><span>#</span>{channel}<small>{index === 1 ? 'mentor-safe help' : 'community'}</small></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section shell final-cta">
        <div><span className="kicker">DRECSEC / BUILDING IN PUBLIC</span><h2>Built by doing the work.</h2></div>
        <a className="button primary" href="https://github.com/Drecullith" target="_blank" rel="noreferrer">Follow Drecullith on GitHub ↗</a>
      </section>
    </main>
  )
}
