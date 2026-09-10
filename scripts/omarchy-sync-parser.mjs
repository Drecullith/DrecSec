function cleanInlineMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\([^\s)]+(?:\s+"[^"]*")?\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'release'
}

function releaseBodyItems(lines) {
  const items = []
  let inFence = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence || /^#{1,6}\s/.test(line)) continue

    const bullet = line.match(/^[-*+]\s+(.+)$/)
    if (bullet) {
      const cleaned = cleanInlineMarkdown(bullet[1])
      if (cleaned) items.push(cleaned)
      continue
    }

    if (/^\d+[.)]\s+/.test(line) || line.startsWith('>') || line.startsWith('|')) continue

    const cleaned = cleanInlineMarkdown(line)
    if (cleaned) items.push(cleaned)
  }

  return [...new Set(items)]
}

export function parseChangelog({ changelog, toolId, toolName, href }) {
  const lines = changelog.replace(/\r\n?/g, '\n').split('\n')
  const updates = []

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^##\s+(.+?)\s+[—–-]\s+(\d{4}-\d{2}-\d{2})\s*$/)
    if (!heading || !validIsoDate(heading[2])) continue

    const headingText = cleanInlineMarkdown(heading[1])
    const versionMatch = [...headingText.matchAll(/\bv?(\d+\.\d+\.\d+)\b/gi)].at(-1)
    if (!versionMatch) continue

    const version = `v${versionMatch[1]}`
    const prefix = headingText.slice(0, versionMatch.index).replace(/[—–-]+\s*$/, '').trim()
    const releaseName = prefix || toolName

    let end = index + 1
    while (end < lines.length && !/^##\s+/.test(lines[end])) end += 1

    updates.push({
      id: `release:${toolId}:${slug(releaseName)}:${version.toLowerCase()}:${heading[2]}`,
      kind: 'release',
      date: heading[2],
      name: releaseName,
      version,
      bullets: releaseBodyItems(lines.slice(index + 1, end)),
      href,
    })

    index = end - 1
  }

  return dedupeAndSortUpdates(updates)
}

export function buildPrUpdates(pullRequests) {
  const updates = []

  for (const pr of pullRequests) {
    const base = {
      kind: 'pr',
      prNumber: pr.number,
      title: pr.title,
      href: pr.href,
    }

    if (pr.createdAt) {
      updates.push({
        ...base,
        id: `pr:${pr.number}:opened`,
        date: pr.createdAt.slice(0, 10),
        event: 'opened',
      })
    }

    if (pr.mergedAt) {
      updates.push({
        ...base,
        id: `pr:${pr.number}:merged`,
        date: pr.mergedAt.slice(0, 10),
        event: 'merged',
      })
    } else if (pr.closedAt) {
      updates.push({
        ...base,
        id: `pr:${pr.number}:closed`,
        date: pr.closedAt.slice(0, 10),
        event: 'closed',
      })
    }
  }

  return dedupeAndSortUpdates(updates)
}

export function dedupeAndSortUpdates(updates) {
  const unique = new Map()
  for (const update of updates) {
    if (!unique.has(update.id)) unique.set(update.id, update)
  }

  const kindRank = { release: 0, pr: 1 }
  const prEventRank = { merged: 0, closed: 1, opened: 2 }

  return [...unique.values()].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date)
    if (byDate) return byDate

    const byKind = (kindRank[a.kind] ?? 9) - (kindRank[b.kind] ?? 9)
    if (byKind) return byKind

    if (a.kind === 'pr' && b.kind === 'pr') {
      const byEvent = (prEventRank[a.event] ?? 9) - (prEventRank[b.event] ?? 9)
      if (byEvent) return byEvent
      return b.prNumber - a.prNumber
    }

    return a.id.localeCompare(b.id)
  })
}

export function currentReleaseVersion(releases) {
  return releases[0]?.version ?? null
}
