import { useEffect } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { omarchyPullRequests } from '../data/omarchy.generated'

const details: Record<number, { summary: string; issue?: string; test?: string }> = {
  10623: {
    summary: 'Corrects the public on/off semantics for the bar while preserving the underlying negated bar-off state flag and normal toggle behavior.',
    issue: '#10621',
    test: 'test/shell.d/toggle-test.sh',
  },
  10535: {
    summary: 'Keeps terminal text paste behavior unchanged while letting image-aware applications receive staged image clipboard data correctly.',
    issue: '#10526',
    test: 'test/shell.d/clipboard-file-paste-test.sh',
  },
  10513: {
    summary: 'Prevents browser-specific codec preload variables from leaking into yt-dlp, ffmpeg, and other helpers spawned by the Chromium native messaging host.',
    issue: '#10469',
    test: 'test/shell.d/chromium-ytdlp-preload-test.sh',
  },
  10501: {
    summary: 'Keeps discovery, pairing, connecting, and forgetting on the same Bluetooth controller on multi-adapter systems.',
    issue: '#10479',
    test: 'test/shell.d/bluetooth-multi-adapter-test.sh',
  },
  10497: {
    summary: 'Moves delayed GVfs recovery into a transient systemd unit so the recovery survives sleep-hook cgroup teardown after resume.',
    issue: '#10450',
    test: 'test/shell.d/unmount-fuse-test.sh',
  },
  10490: {
    summary: 'Separates class-wide privacy protection from generic floating geometry so fixed-size browser unlock popups are not forced into main-window dimensions.',
    issue: '#9904',
    test: 'test/shell.d/hyprland-1password-rules-test.sh',
  },
}

const tools = [
  {
    name: 'Omarchy Plugin Rescue',
    version: 'v1.0.0',
    command: 'omrescue',
    description: 'A TTY-safe recovery utility that temporarily removes only third-party shell-plugin references from shell.json, preserves unrelated configuration, and can restore the exact original file afterward.',
    points: ['No sudo or daemon', 'Atomic config replacement', 'Byte-for-byte restore snapshot', 'Never executes plugin code'],
    href: 'https://github.com/Drecullith/Omarchy-Contributions/tree/main/tools/plugin-rescue',
  },
  {
    name: 'Omarchy Rollback Check',
    version: 'v1.0.0',
    command: 'omrollback-check',
    description: 'A read-only diagnostic for root/home migration-ledger drift after a root snapshot restore, with conservative CONFIRMED and POTENTIAL evidence classes.',
    points: ['Read-only by design', 'No migration replay', 'No snapshot changes', 'No network or telemetry'],
    href: 'https://github.com/Drecullith/Omarchy-Contributions/tree/main/tools/rollback-check',
  },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}

function effectiveIssue(number: number, generated: string | null) {
  return generated ?? details[number]?.issue ?? null
}

function effectiveTest(number: number, generated: string | null) {
  return generated ?? details[number]?.test ?? null
}

export function OmarchyContributionsPage() {
  useEffect(() => {
    document.title = 'Omarchy Contributions — DrecSec'
  }, [])

  const testedFixes = omarchyPullRequests.filter((pr) => effectiveTest(pr.number, pr.test)).length

  return (
    <main className="case-study">
      <section className="case-hero shell" aria-labelledby="case-title">
        <a className="case-back" href="/#projects">← Back to projects</a>
        <span className="kicker">OPEN SOURCE / OMARCHY</span>
        <h1 id="case-title">Omarchy<br /><em>Contributions.</em></h1>
        <p className="case-lede">
          A traceable record of small upstream fixes, regression tests, and finished utilities built around real Omarchy problems. The goal is simple: understand the failure, make the smallest defensible change, and leave evidence behind.
        </p>
        <div className="case-actions">
          <a className="button primary" href="https://github.com/Drecullith/Omarchy-Contributions" target="_blank" rel="noreferrer">Contribution repo ↗</a>
          <a className="button secondary" href="#upstream">See upstream PRs ↓</a>
        </div>
        <div className="case-stat-grid" aria-label="Contribution snapshot">
          <div className="case-stat"><strong>{omarchyPullRequests.length}</strong><span>upstream PRs submitted</span></div>
          <div className="case-stat"><strong>{tools.length}</strong><span>finished public utilities</span></div>
          <div className="case-stat"><strong>{testedFixes}</strong><span>regression-tested fixes</span></div>
        </div>
      </section>

      <section id="upstream" className="section shell case-section">
        <SectionHeading
          kicker="01 / Upstream"
          title="Real issues. Focused fixes."
          body="The PR list and status come from public GitHub metadata. Technical summaries stay curated so automation never invents claims or republishes unnecessary account data."
        />
        <div className="case-pr-list">
          {omarchyPullRequests.map((pr) => {
            const detail = details[pr.number]
            const issue = effectiveIssue(pr.number, pr.issue)
            const test = effectiveTest(pr.number, pr.test)

            return (
              <a className="case-pr-card" href={pr.href} target="_blank" rel="noreferrer" key={pr.number}>
                <div className="case-pr-id"><strong>PR #{pr.number}</strong><span>{formatDate(pr.createdAt)}</span></div>
                <div className="case-pr-copy">
                  <h3>{pr.title}</h3>
                  <p>{detail?.summary ?? 'Public upstream contribution by Drecullith. Open the review trail for the issue context, diff, tests, and maintainer discussion.'}</p>
                  <div className="case-pr-meta">
                    <span>{pr.state.toUpperCase()}</span>
                    {issue ? <span>Issue {issue}</span> : null}
                    {test ? <code>{test}</code> : null}
                  </div>
                </div>
                <span className="case-pr-arrow" aria-hidden="true">↗</span>
              </a>
            )
          })}
        </div>
      </section>

      <section className="section shell case-section">
        <SectionHeading
          kicker="02 / Finished tools"
          title="Small tools with hard boundaries."
          body="The companion repository follows a strict rule: research first, define a finish line, build it, test it, ship it. These two utilities are intentionally narrow rather than growing into vague repair suites."
        />
        <div className="case-tool-grid">
          {tools.map((tool) => (
            <a className="case-tool-card" href={tool.href} target="_blank" rel="noreferrer" key={tool.name}>
              <div className="case-tool-top"><span>{tool.version}</span><span>View source ↗</span></div>
              <h3>{tool.name}</h3>
              <code className="case-command">$ {tool.command}</code>
              <p>{tool.description}</p>
              <div className="case-tool-points">{tool.points.map((point) => <span key={point}>{point}</span>)}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="section shell case-section">
        <SectionHeading
          kicker="03 / Method"
          title="The workflow is part of the evidence."
          body="The contribution itself matters, but so does the process used to get there. That process stays deliberately repeatable."
        />
        <div className="case-method-grid">
          <article><span>01</span><h3>Research first</h3><p>Read the issue, inspect upstream behavior, check for overlapping fixes, and understand the boundary before changing code.</p></article>
          <article><span>02</span><h3>Reproduce & isolate</h3><p>Reduce the problem to the smallest behavior that can be reasoned about and tested without dragging unrelated code into the fix.</p></article>
          <article><span>03</span><h3>Patch narrowly</h3><p>Prefer a focused change that preserves existing callers and semantics everywhere outside the reported failure.</p></article>
          <article><span>04</span><h3>Leave a regression test</h3><p>Make the intended behavior executable so future changes have a concrete signal when the same bug tries to return.</p></article>
        </div>
      </section>

      <section className="section shell case-closing">
        <div>
          <span className="kicker">04 / Evidence</span>
          <h2>Follow the review trail.</h2>
          <p>Nothing on this page requires taking the portfolio's word for it. The fixes, tests, commits, and review history are public.</p>
        </div>
        <div className="case-actions">
          <a className="button primary" href="https://github.com/Drecullith/Omarchy-Contributions" target="_blank" rel="noreferrer">Open repository ↗</a>
          <a className="button secondary" href="https://github.com/omacom/omarchy/pulls?q=is%3Apr+author%3ADrecullith" target="_blank" rel="noreferrer">Upstream PRs ↗</a>
        </div>
      </section>
    </main>
  )
}
