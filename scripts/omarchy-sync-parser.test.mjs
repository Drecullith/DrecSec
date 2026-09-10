import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildPrUpdates,
  currentReleaseVersion,
  dedupeAndSortUpdates,
  parseChangelog,
} from './omarchy-sync-parser.mjs'

const pluginRescue = `# Changelog

## 1.0.1 — 2026-09-10

- Serialize rescue/restore state mutation with a non-blocking \`flock\`.
- Abort rescue if \`shell.json\` changes after the snapshot but before the safe configuration is installed.

## 1.0.0 — 2026-09-06

- Initial release.
- TTY-safe third-party shell-plugin rescue without requiring Quickshell IPC.
`

test('parses every release and keeps newest release first', () => {
  const releases = parseChangelog({
    changelog: pluginRescue,
    toolId: 'contrib:plugin-rescue',
    toolName: 'Omarchy Plugin Rescue',
    href: 'https://github.com/Drecullith/Omarchy-Contributions/tree/main/tools/plugin-rescue',
  })

  assert.equal(releases.length, 2)
  assert.equal(releases[0].version, 'v1.0.1')
  assert.equal(releases[0].name, 'Omarchy Plugin Rescue')
  assert.equal(releases[1].version, 'v1.0.0')
  assert.equal(currentReleaseVersion(releases), 'v1.0.1')
  assert.deepEqual(releases[0].bullets, [
    'Serialize rescue/restore state mutation with a non-blocking flock.',
    'Abort rescue if shell.json changes after the snapshot but before the safe configuration is installed.',
  ])
})

test('supports named releases in one tool changelog without deduplicating them away', () => {
  const releases = parseChangelog({
    changelog: `# Changelog

## Guided Recovery 1.0.0 — 2026-09-10
- Added the planner.

## Rollback Check 1.0.0 — 2026-09-06
- Added the checker.
`,
    toolId: 'contrib:rollback-check',
    toolName: 'Omarchy Rollback Check + Guided Recovery',
    href: 'https://example.invalid/tool',
  })

  assert.equal(releases.length, 2)
  assert.equal(releases[0].name, 'Guided Recovery')
  assert.equal(releases[1].name, 'Rollback Check')
  assert.notEqual(releases[0].id, releases[1].id)
})

test('captures meaningful PR opened/merged/closed milestones only', () => {
  const updates = buildPrUpdates([
    { number: 3, title: 'Open', href: 'https://example.invalid/3', createdAt: '2026-09-10T10:00:00Z', mergedAt: null, closedAt: null },
    { number: 2, title: 'Merged', href: 'https://example.invalid/2', createdAt: '2026-09-08T10:00:00Z', mergedAt: '2026-09-10T11:00:00Z', closedAt: '2026-09-10T11:00:00Z' },
    { number: 1, title: 'Closed', href: 'https://example.invalid/1', createdAt: '2026-09-07T10:00:00Z', mergedAt: null, closedAt: '2026-09-09T11:00:00Z' },
  ])

  assert.deepEqual(
    updates.map(({ id }) => id),
    ['pr:2:merged', 'pr:3:opened', 'pr:1:closed', 'pr:2:opened', 'pr:1:opened'],
  )
  assert.equal(updates.some(({ id }) => id.includes('commit')), false)
})

test('deduplicates stable update ids', () => {
  const duplicate = { id: 'pr:9:opened', kind: 'pr', date: '2026-09-10', event: 'opened', prNumber: 9, title: 'x', href: 'https://example.invalid' }
  assert.equal(dedupeAndSortUpdates([duplicate, duplicate]).length, 1)
})
