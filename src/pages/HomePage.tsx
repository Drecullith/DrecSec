import { useState } from 'react'
import { Mark } from '../components/Mark'
import { SectionHeading } from '../components/SectionHeading'
import { omarchyUpdates } from '../data/omarchy-updates.generated'
import { journey, projects } from '../data/site'

type ProjectMarkName = 'drecsec' | 'lychnos' | 'omarchy' | 'ctf'

function ProjectMark({ name }: { name: ProjectMarkName }) {
  return (
    <span className={`project-identity project-identity--${name}`} aria-hidden="true">
      {name === 'drecsec' ? (
        <Mark size={38} />
      ) : name === 'omarchy' ? (
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M10 10h11v11H10zM27 10h11v11H27zM10 27h11v11H10zM27 27h11v11H27z" />
          <path d="M21 15.5h6M21 32.5h6M15.5 21v6M32.5 21v6" />
        </svg>
      ) : name === 'lychnos' ? (
        <svg viewBox="0 0 48 48" focusable="false">
          <circle cx="24" cy="24" r="9" />
          <path d="M24 7v6M24 35v6M7 24h6M35 24h6M12 12l4.5 4.5M31.5 31.5 36 36M36 12l-4.5 4.5M16.5 31.5 12 36" />
        </svg>
      ) : (
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M14 39V9M15 11h19l-5 7 5 7H15" />
          <path d="M12 39h11" />
        </svg>
      )}
    </span>
  )
}

function LychnosPreview() {
  return (
    <div
      className="lychnos-preview"
      role="img"
      aria-label="Animated concept of Lychnos as a small ambient orb that notices a system problem, explains it, and asks permission before acting."
    >
      <div className="lychnos-stage" aria-hidden="true">
        <span className="lychnos-orbit lychnos-orbit-one" />
        <span className="lychnos-orbit lychnos-orbit-two" />
        <span className="lychnos-orb">
          <i className="lychnos-eye lychnos-eye-left" />
          <i className="lychnos-eye lychnos-eye-right" />
        </span>
        <span className="lychnos-bubble lychnos-bubble-one">terminal 3 hit a snag</span>
        <span className="lychnos-bubble lychnos-bubble-two">explain → propose → ask permission</span>
        <span className="lychnos-state">ambient · local-first</span>
      </div>
    </div>
  )
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export function HomePage() {
  const [copied, setCopied] = useState(false)
  const latestActivity = omarchyUpdates.slice(0, 3)

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
          <div className="status-pill"><span /> DrecSec v0.4 — project depth</div>
          <p className="hero-kicker">CYBERSECURITY • OPEN SOURCE • CTF</p>
          <h1 id="hero-title">
            Learn the system.<br />
            <em>Break assumptions.</em><br />
            Build it better.
          </h1>
          <p className="hero-lede">
            DrecSec is the cybersecurity home of <strong>Drecullith</strong> — a living portfolio of practical learning,
            open-source work, ethical labs, CTF methodology, and the projects built along the way.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">Explore the work</a>
            <a className="button secondary" href="https://github.com/Drecullith" target="_blank" rel="noreferrer">GitHub ↗</a>
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
  "deployment": "GitHub → Vercel",
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
          <article className="principle-card"><span>01</span><h3>Evidence over buzzwords</h3><p>Projects, commits, write-ups, reproducible labs, and clear explanations matter more than a wall of vague skill badges.</p></article>
          <article className="principle-card"><span>02</span><h3>Legal & permission-based</h3><p>Security work belongs in systems you own, intentionally vulnerable labs, CTFs, and environments where testing is explicitly authorized.</p></article>
          <article className="principle-card"><span>03</span><h3>Learn in public</h3><p>Progress stays visible. Beginner questions, review feedback, failed attempts, and improved methodology are part of the record.</p></article>
        </div>
      </section>

      <section id="projects" className="section shell">
        <SectionHeading kicker="02 / Projects" title="The workbench." body="Active projects and the systems around them. Verified activity and write-ups keep this portfolio grounded in real work." />
        <div className="project-grid">
          {projects.map((project) => {
            const classes = [
              'project-card',
              project.href ? 'project-card-link' : '',
              project.featured ? 'project-card--featured' : '',
              project.planned ? 'project-card--planned' : '',
              project.mark === 'lychnos' ? 'project-card--lychnos' : '',
            ].filter(Boolean).join(' ')

            const content = (
              <>
                <div className="project-meta">
                  <span>{project.eyebrow}</span>
                  <span className="project-status">{project.status}</span>
                </div>
                <div className="project-title-row">
                  <ProjectMark name={project.mark as ProjectMarkName} />
                  <div>
                    {project.featured ? <span className="project-featured-label">Featured case study</span> : null}
                    <h3>{project.title}</h3>
                  </div>
                </div>
                <p>{project.description}</p>
                {project.mark === 'lychnos' ? <LychnosPreview /> : null}
                <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {project.href ? <span className="project-card-cta">View case study <span aria-hidden="true">→</span></span> : null}
              </>
            )

            return project.href ? (
              <a className={classes} href={project.href} key={project.title} aria-label={`Open ${project.title} case study`}>
                {content}
              </a>
            ) : (
              <article className={classes} key={project.title}>
                {content}
              </article>
            )
          })}
        </div>

        <div className="activity-strip" aria-labelledby="latest-activity-title">
          <div className="activity-strip-head">
            <div>
              <span className="kicker mini">Latest verified activity</span>
              <h3 id="latest-activity-title">Recent public milestones.</h3>
            </div>
            <a href="/projects/omarchy-contributions#updates">Full history <span aria-hidden="true">→</span></a>
          </div>
          <div className="activity-grid">
            {latestActivity.map((update) => (
              <a className={`activity-card activity-card--${update.kind}`} href={update.href} target="_blank" rel="noreferrer" key={update.id}>
                <div className="activity-card-top">
                  <span>{update.kind === 'release' ? `Release · ${update.version}` : `PR #${update.prNumber} · ${update.event}`}</span>
                  <time dateTime={update.date}>{formatActivityDate(update.date)}</time>
                </div>
                <strong>{update.kind === 'release' ? update.name : update.title}</strong>
                <span className="activity-card-link">Verified source ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="section shell journey-section">
        <SectionHeading kicker="03 / Journey" title="The roadmap is part of the portfolio." body="DrecSec shows growth instead of pretending the destination came first." />
        <div className="timeline">
          {journey.map((step, index) => (
            <article key={step.title} className="timeline-item">
              <div className="timeline-index">0{index + 1}</div>
              <div><span className="kicker mini">{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell final-cta">
        <div><span className="kicker">04 / FOLLOW THE WORK</span><h2>Follow the work.</h2><p className="hero-lede">Projects, contributions, labs, and write-ups stay connected to the work itself — so the evidence is always one click away.</p></div>
        <a className="button primary" href="https://github.com/Drecullith" target="_blank" rel="noreferrer">Follow Drecullith on GitHub ↗</a>
      </section>
    </main>
  )
}
