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
          <path d="M15 10l6-3 3 5-3 5-7 1-3-4zM33 10l4 4-3 4-7-1-3-5 3-5zM38 20l4 4-4 4-5-2v-4zM33 38l-6 3-3-5 3-5 7-1 3 4zM15 38l-4-4 3-4 7 1 3 5-3 5zM10 20l5 2v4l-5 2-4-4z" />
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
      aria-label="Animated Lychnos concept: a segmented dark orb companion with a blue expressive face cycling through calm, thinking, alert, and listening states."
    >
      <span className="lychnos-concept-label">Concept</span>
      <div className="lychnos-stage" aria-hidden="true">
        <span className="lychnos-field lychnos-field-one" />
        <span className="lychnos-field lychnos-field-two" />
        <svg className="lychnos-avatar" viewBox="0 0 180 150" focusable="false">
          <defs>
            <linearGradient id="lychnos-shell-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#263347" />
              <stop offset="0.48" stopColor="#101722" />
              <stop offset="1" stopColor="#05080d" />
            </linearGradient>
            <radialGradient id="lychnos-face-gradient" cx="38%" cy="28%" r="78%">
              <stop offset="0" stopColor="#172336" />
              <stop offset="0.38" stopColor="#070b12" />
              <stop offset="1" stopColor="#010204" />
            </radialGradient>
          </defs>

          <ellipse className="lychnos-ground" cx="90" cy="132" rx="42" ry="7" />

          <g className="lychnos-avatar-body">
            <circle className="lychnos-core-shadow" cx="90" cy="65" r="47" />
            <g className="lychnos-shell">
              <path d="M54 31Q70 14 90 14t36 17l-10 13q-12-10-26-10T64 44Z" />
              <path d="M128 32q17 13 17 32 0 11-5 20l-15-6q4-7 4-14 0-14-10-22Z" />
              <path d="M140 84q-7 19-24 30l-10-15q11-7 18-22Z" />
              <path d="M116 114q-13 8-26 8t-26-8l9-16q8 5 17 5t17-5Z" />
              <path d="M64 114q-17-11-24-30l16-7q7 15 18 22Z" />
              <path d="M40 84q-5-9-5-20 0-19 17-32l9 10Q51 50 51 64q0 7 5 14Z" />
            </g>

            <circle className="lychnos-face-glass" cx="90" cy="65" r="34" />
            <path className="lychnos-face-shine" d="M67 47q11-13 28-14 10 0 18 5" />

            <g className="lychnos-face-state lychnos-face-calm">
              <path className="lychnos-eye-line" d="M69 64q7-8 14 0" />
              <path className="lychnos-eye-line" d="M97 64q7-8 14 0" />
              <path className="lychnos-mouth" d="M82 78q8 6 16 0" />
            </g>

            <g className="lychnos-face-state lychnos-face-thinking">
              <path className="lychnos-eye-line" d="M69 64h13" />
              <path className="lychnos-eye-line" d="M98 64h13" />
              <circle className="lychnos-thought-dot" cx="111" cy="74" r="2.4" />
            </g>

            <g className="lychnos-face-state lychnos-face-alert">
              <path className="lychnos-alert-eye" d="M68 61l14 5" />
              <path className="lychnos-alert-eye" d="M112 61l-14 5" />
              <path className="lychnos-alert-mouth" d="M84 79h12" />
            </g>

            <g className="lychnos-face-state lychnos-face-listening">
              <circle className="lychnos-listen-eye" cx="76" cy="64" r="4.2" />
              <circle className="lychnos-listen-eye" cx="104" cy="64" r="4.2" />
            </g>
          </g>
        </svg>

        <span className="lychnos-bubble lychnos-bubble-one">terminal 3 hit a snag</span>
        <span className="lychnos-bubble lychnos-bubble-two">want me to explain it?</span>
        <span className="lychnos-bubble lychnos-bubble-three">waiting for permission</span>

        <div className="lychnos-state-stack">
          <span className="lychnos-state lychnos-state-calm">with you · idle</span>
          <span className="lychnos-state lychnos-state-thinking">thinking</span>
          <span className="lychnos-state lychnos-state-alert">attention</span>
          <span className="lychnos-state lychnos-state-listening">listening</span>
        </div>
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
