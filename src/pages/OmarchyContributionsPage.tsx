import { useEffect } from 'react'
import { SectionHeading } from '../components/SectionHeading'

const pullRequests = [
  {
    number: 10623,
    date: '7 Sep 2026',
    title: 'Fix explicit bar toggle direction',
    summary: 'Corrects the public on/off semantics for the bar while preserving the underlying negated bar-off state flag and normal toggle behavior.',
    test: 'test/shell.d/toggle-test.sh',
    issue: '#10621',
    href: 'https://github.com/omacom/omarchy/pull/10623',
  },
  {
    number: 10535,
    date: '6 Sep 2026',
    title: 'Use Ctrl+V for clipboard image paste',
    summary: 'Keeps terminal text paste behavior unchanged while letting image-aware applications receive staged image clipboard data correctly.',
    test: 'test/shell.d/clipboard-file-paste-test.sh',
    issue: '#10526',
    href: 'https://github.com/omacom/omarchy/pull/10535',
  },
  {
    number: 10513,
    date: '6 Sep 2026',
    title: 'Drop browser codec preloads from yt-dlp host',
    summary: 'Prevents browser-specific codec preload variables from leaking into yt-dlp, ffmpeg, and other helpers spawned by the Chromium native messaging host.',
    test: 'test/shell.d/chromium-ytdlp-preload-test.sh',
    issue: '#10469',
    href: 'https://github.com/omacom/omarchy/pull/10513',
  },
  {
    number: 10501,
    date: '6 Sep 2026',
    title: 'Keep Bluetooth device actions on the panel adapter',
    summary: 'Keeps discovery, pairing, connecting, and forgetting on the same Bluetooth controller on multi-adapter systems.',
    test: 'test/shell.d/bluetooth-multi-adapter-test.sh',
    issue: '#10479',
    href: 'https://github.com/omacom/omarchy/pull/10501',
  },
  {
    number: 10497,
    date: '6 Sep 2026',
    title: 'Restore GVfs mounts after system resume',
    summary: 'Moves delayed GVfs recovery into a transient systemd unit so the recovery survives sleep-hook cgroup teardown after resume.',
    test: 'test/shell.d/unmount-fuse-test.sh',
    issue: '#10450',
    href: 'https://github.com/omacom/omarchy/pull/10497',
  },
  {
    number: 10490,
    date: '6 Sep 2026',
    title: 'Scope 1Password floating geometry to main window',
    summary: 'Separates class-wide privacy protection from generic floating geometry so fixed-size browser unlock popups are not forced into main-window dimensions.',
    test: 'test/shell.d/hyprland-1password-rules-test.sh',
    issue: '#9904',
    href: 'https://github.com/omacom/omarchy/pull/10490',
  },
]

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

export function OmarchyContributionsPage() {
  useEffect(() => {
    document.title = 'Omarchy Contributions — DrecSec'
  }, [])

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
          <div className="case-stat"><strong>6</strong><span>upstream PRs submitted</span></div>
          <div className="case-stat"><strong>2</strong><span>finished public utilities</span></div>
          <div className="case-stat"><strong>6</strong><span>regression-tested fixes</span></div>
        </div>
      </section>

      <section id="upstream" className="section shell case-section">
        <SectionHeading
          kicker="01 / Upstream"
          title="Real issues. Focused fixes."
          body="Each pull request starts from a concrete reported failure and includes a regression test aimed at the behavior being changed. The links below go straight to the upstream review record."
        />
        <div className="case-pr-list">
          {pullRequests.map((pr) => (
            <a className="case-pr-card" href={pr.href} target="_blank" rel="noreferrer" key={pr.number}>
              <div className="case-pr-id"><strong>PR #{pr.number}</strong><span>{pr.date}</span></div>
              <div className="case-pr-copy">
                <h3>{pr.title}</h3>
                <p>{pr.summary}</p>
                <div className="case-pr-meta"><span>Issue {pr.issue}</span><code>{pr.test}</code></div>
              </div>
              <span className="case-pr-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
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
