import fs from 'node:fs/promises'
import {
  buildPrUpdates,
  currentReleaseVersion,
  dedupeAndSortUpdates,
  parseChangelog,
} from './omarchy-sync-parser.mjs'

const owner = 'Drecullith'
const upstreamRepo = 'omacom/omarchy'
const contributionRepo = 'Drecullith/Omarchy-Contributions'
const contributionRef = 'main'
const standaloneToolRepos = [
  { id: 'repo:omarchy-scope', repo: 'Drecullith/omarchy-scope', ref: 'main' },
]

const snapshotOutputPath = new URL('../src/data/omarchy.generated.ts', import.meta.url)
const updatesOutputPath = new URL('../src/data/omarchy-updates.generated.ts', import.meta.url)

const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('GITHUB_TOKEN is required for the build-time sync')

const allowlistedRepos = new Set([
  contributionRepo,
  ...standaloneToolRepos.map(({ repo }) => repo),
])

function allowedFile(repo, path) {
  if (!allowlistedRepos.has(repo)) return false

  if (repo === contributionRepo) {
    return /^tools\/[^/]+\/(?:README|CHANGELOG)\.md$/.test(path)
  }

  const standalone = standaloneToolRepos.find((entry) => entry.repo === repo)
  return Boolean(standalone && path === 'README.md')
}

function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'DrecSec-portfolio-sync',
  }
}

async function apiJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...githubHeaders(),
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function graphql(query, variables) {
  const payload = await apiJson('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (Array.isArray(payload.errors) && payload.errors.length) {
    throw new Error(`GitHub GraphQL returned ${payload.errors.length} error(s)`)
  }

  return payload.data
}

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/')
}

async function readPublicFile(repo, path, ref = 'main') {
  if (!allowedFile(repo, path)) {
    throw new Error(`Refusing non-allowlisted public file read: ${repo}/${path}`)
  }

  const data = await apiJson(
    `https://api.github.com/repos/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`,
  )

  if (data.type !== 'file' || !data.content || data.encoding !== 'base64') {
    throw new Error(`Expected a base64 file response for allowlisted file ${repo}/${path}`)
  }

  return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8')
}

function toolName(readme, fallback) {
  const heading = readme.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const clean = heading ? heading.replace(/[`*_]/g, '').trim() : fallback
  return clean.replace(/\s+[—-]\s+v?\d+\.\d+\.\d+.*$/i, '').trim()
}

function toolVersion(readme) {
  const explicitVersion = readme.match(/\bversion\s+v?(\d+\.\d+\.\d+)\b/i)
  if (explicitVersion) return `v${explicitVersion[1]}`

  const headingVersion = readme.match(/^#\s+.*?\bv(\d+\.\d+\.\d+)\b.*$/im)
  if (headingVersion) return `v${headingVersion[1]}`

  const statusVersion = readme.match(/^\s*`?v?(\d+\.\d+\.\d+)`?\s+is\b/im)
  return statusVersion ? `v${statusVersion[1]}` : null
}

function toolStage(readme, version) {
  if (/\bbuild candidate\b/i.test(readme)) return 'build-candidate'
  if (/\bcomplete scope\b/i.test(readme) || version?.startsWith('v1.')) return 'released'
  return 'public'
}

function testPath(files = []) {
  return files
    .map(({ path }) => path)
    .find((path) => /(?:^|\/)test(?:s|\/|[^/]*\/).*\.(?:sh|ts|tsx|js|jsx|py)$/i.test(path)) ?? null
}

async function syncPullRequests() {
  const queryText = `repo:${upstreamRepo} is:pr author:${owner}`
  const graphQuery = `
    query DrecSecOmarchyPullRequests($query: String!, $cursor: String) {
      search(query: $query, type: ISSUE, first: 50, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          ... on PullRequest {
            number
            title
            url
            state
            createdAt
            closedAt
            mergedAt
            closingIssuesReferences(first: 5) { nodes { number } }
            files(first: 50) { nodes { path } }
          }
        }
      }
    }
  `

  const rawPullRequests = []
  let cursor = null

  do {
    const data = await graphql(graphQuery, { query: queryText, cursor })
    const search = data?.search
    const nodes = Array.isArray(search?.nodes) ? search.nodes.filter(Boolean) : []
    rawPullRequests.push(...nodes)
    cursor = search?.pageInfo?.hasNextPage ? search.pageInfo.endCursor : null
  } while (cursor)

  rawPullRequests.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const pullRequests = rawPullRequests.map((pr) => ({
    number: pr.number,
    title: pr.title,
    state: pr.mergedAt ? 'merged' : pr.state === 'CLOSED' ? 'closed' : 'open',
    createdAt: pr.createdAt,
    href: pr.url,
    issue: pr.closingIssuesReferences?.nodes?.[0]?.number
      ? `#${pr.closingIssuesReferences.nodes[0].number}`
      : null,
    test: testPath(pr.files?.nodes ?? []),
  }))

  const milestones = rawPullRequests.map((pr) => ({
    number: pr.number,
    title: pr.title,
    href: pr.url,
    createdAt: pr.createdAt,
    mergedAt: pr.mergedAt,
    closedAt: pr.closedAt,
  }))

  return { pullRequests, prUpdates: buildPrUpdates(milestones) }
}

async function contributionToolSlugs() {
  const items = await apiJson(
    `https://api.github.com/repos/${contributionRepo}/contents/tools?ref=${encodeURIComponent(contributionRef)}`,
  )

  if (!Array.isArray(items)) throw new Error('Expected allowlisted tools directory listing')

  return items
    .filter((item) => item.type === 'dir' && /^[a-z0-9][a-z0-9-]*$/.test(item.name))
    .map((item) => item.name)
    .sort()
}

async function syncContributionTools() {
  const slugs = await contributionToolSlugs()
  const tools = []
  const releases = []

  for (const slug of slugs) {
    const id = `contrib:${slug}`
    const href = `https://github.com/${contributionRepo}/tree/${contributionRef}/tools/${slug}`
    const readmePath = `tools/${slug}/README.md`
    const changelogPath = `tools/${slug}/CHANGELOG.md`

    const [readme, changelog] = await Promise.all([
      readPublicFile(contributionRepo, readmePath, contributionRef),
      readPublicFile(contributionRepo, changelogPath, contributionRef),
    ])

    const name = toolName(readme, slug)
    const parsedReleases = parseChangelog({ changelog, toolId: id, toolName: name, href })
    const version = currentReleaseVersion(parsedReleases) ?? toolVersion(readme)

    tools.push({
      id,
      name,
      version,
      stage: toolStage(readme, version),
      href,
    })
    releases.push(...parsedReleases)
  }

  return { tools, releaseUpdates: releases }
}

async function syncStandaloneTools() {
  const tools = []

  for (const { id, repo, ref } of standaloneToolRepos) {
    const readme = await readPublicFile(repo, 'README.md', ref)
    const version = toolVersion(readme)
    tools.push({
      id,
      name: toolName(readme, repo.split('/').at(-1)),
      version,
      stage: toolStage(readme, version),
      href: `https://github.com/${repo}`,
    })
  }

  return tools
}

const [{ pullRequests, prUpdates }, { tools: contributionTools, releaseUpdates }, standaloneTools] = await Promise.all([
  syncPullRequests(),
  syncContributionTools(),
  syncStandaloneTools(),
])

const preferredToolOrder = new Map([
  ['contrib:plugin-rescue', 10],
  ['contrib:rollback-check', 20],
  ['contrib:migration-check', 30],
  ['contrib:context-snapshot', 40],
  ['repo:omarchy-scope', 50],
])

const tools = [...contributionTools, ...standaloneTools].sort((a, b) => {
  const aRank = preferredToolOrder.get(a.id) ?? 1000
  const bRank = preferredToolOrder.get(b.id) ?? 1000
  return aRank - bRank || a.name.localeCompare(b.name)
})

const updates = dedupeAndSortUpdates([...releaseUpdates, ...prUpdates])

const snapshotGenerated = `// Generated by scripts/sync-omarchy.mjs from allowlisted PUBLIC GitHub metadata.\n// Current snapshots only; historical release/activity data lives in omarchy-updates.generated.ts.\n\nexport type OmarchyPullRequest = {\n  number: number\n  title: string\n  state: 'open' | 'merged' | 'closed'\n  createdAt: string\n  href: string\n  issue: string | null\n  test: string | null\n}\n\nexport type OmarchyTool = {\n  id: string\n  name: string\n  version: string | null\n  stage: 'released' | 'build-candidate' | 'public'\n  href: string\n}\n\nexport const omarchyPullRequests: OmarchyPullRequest[] = ${JSON.stringify(pullRequests, null, 2)}\n\nexport const omarchyTools: OmarchyTool[] = ${JSON.stringify(tools, null, 2)}\n`

const updatesGenerated = `// Generated by scripts/sync-omarchy.mjs from allowlisted PUBLIC GitHub milestones.\n// Release history comes only from Drecullith/Omarchy-Contributions tools/*/CHANGELOG.md.\n// No commit messages, profiles, emails, secrets, environment values, or arbitrary repository files are stored here.\n\nexport type OmarchyReleaseUpdate = {\n  id: string\n  kind: 'release'\n  date: string\n  name: string\n  version: string\n  bullets: string[]\n  href: string\n}\n\nexport type OmarchyPrUpdate = {\n  id: string\n  kind: 'pr'\n  date: string\n  event: 'opened' | 'merged' | 'closed'\n  prNumber: number\n  title: string\n  href: string\n}\n\nexport type OmarchyUpdate = OmarchyReleaseUpdate | OmarchyPrUpdate\n\nexport const omarchyUpdates: OmarchyUpdate[] = ${JSON.stringify(updates, null, 2)}\n`

await Promise.all([
  fs.writeFile(snapshotOutputPath, snapshotGenerated),
  fs.writeFile(updatesOutputPath, updatesGenerated),
])

console.log(
  `Synced ${pullRequests.length} public Omarchy PR snapshot(s), ${tools.length} current public tool/project snapshot(s), and ${updates.length} meaningful update milestone(s).`,
)
