import fs from 'node:fs/promises'

const owner = 'Drecullith'
const upstreamRepo = 'omacom/omarchy'
const contributionRepo = 'Drecullith/Omarchy-Contributions'
const standaloneToolRepos = [
  { id: 'repo:omarchy-scope', repo: 'Drecullith/omarchy-scope', ref: 'main' },
]
const outputPath = new URL('../src/data/omarchy.generated.ts', import.meta.url)

const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('GITHUB_TOKEN is required for the build-time sync')

async function apiJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'DrecSec-portfolio-sync',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} ${response.statusText} for ${url}`)
  }

  return response.json()
}

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/')
}

async function readPublicFile(repo, path, ref = 'main') {
  const data = await apiJson(
    `https://api.github.com/repos/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`,
  )

  if (data.type !== 'file' || !data.content || data.encoding !== 'base64') {
    throw new Error(`Expected a base64 file response for ${repo}/${path}`)
  }

  return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8')
}

function linkedIssue(body = '') {
  const match = body.match(/(?:fix(?:e[sd]?|ing)?|close[sd]?|resolve[sd]?)\s+#(\d+)/i)
  return match ? `#${match[1]}` : null
}

function regressionTest(body = '') {
  const matches = [...body.matchAll(/`([^`\n]*test[^`\n]*\.(?:sh|ts|tsx|js|jsx|py))`/gi)]
  return matches[0]?.[1] ?? null
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

async function syncPullRequests() {
  const query = new URLSearchParams({
    q: `repo:${upstreamRepo} type:pr author:${owner}`,
    sort: 'created',
    order: 'desc',
    per_page: '100',
  })

  const payload = await apiJson(`https://api.github.com/search/issues?${query}`)
  const items = Array.isArray(payload.items) ? payload.items : []

  return items.map((item) => ({
    number: item.number,
    title: item.title,
    state: item.pull_request?.merged_at ? 'merged' : item.state === 'closed' ? 'closed' : 'open',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    href: item.html_url,
    issue: linkedIssue(item.body ?? ''),
    test: regressionTest(item.body ?? ''),
  }))
}

async function syncContributionTools() {
  const tree = await apiJson(
    `https://api.github.com/repos/${contributionRepo}/git/trees/main?recursive=1`,
  )

  const readmePaths = (Array.isArray(tree.tree) ? tree.tree : [])
    .filter((item) => item.type === 'blob' && /^tools\/[^/]+\/README\.md$/.test(item.path))
    .map((item) => item.path)

  return Promise.all(
    readmePaths.map(async (path) => {
      const slug = path.split('/')[1]
      const readme = await readPublicFile(contributionRepo, path)
      const version = toolVersion(readme)
      return {
        id: `contrib:${slug}`,
        name: toolName(readme, slug),
        version,
        stage: toolStage(readme, version),
        href: `https://github.com/${contributionRepo}/tree/main/tools/${slug}`,
        sourceRepo: contributionRepo,
      }
    }),
  )
}

async function syncStandaloneTools() {
  return Promise.all(
    standaloneToolRepos.map(async ({ id, repo, ref }) => {
      const readme = await readPublicFile(repo, 'README.md', ref)
      const version = toolVersion(readme)
      return {
        id,
        name: toolName(readme, repo.split('/').at(-1)),
        version,
        stage: toolStage(readme, version),
        href: `https://github.com/${repo}`,
        sourceRepo: repo,
      }
    }),
  )
}

const [prs, contributionTools, standaloneTools] = await Promise.all([
  syncPullRequests(),
  syncContributionTools(),
  syncStandaloneTools(),
])

const preferredToolOrder = new Map([
  ['contrib:plugin-rescue', 10],
  ['contrib:rollback-check', 20],
  ['contrib:migration-check', 30],
  ['repo:omarchy-scope', 40],
])

const tools = [...contributionTools, ...standaloneTools].sort((a, b) => {
  const aRank = preferredToolOrder.get(a.id) ?? 1000
  const bRank = preferredToolOrder.get(b.id) ?? 1000
  return aRank - bRank || a.name.localeCompare(b.name)
})

const generated = `// Generated by scripts/sync-omarchy.mjs from PUBLIC GitHub PR/tool metadata.\n// Sources are explicitly limited; do not place secrets or private-account data in this file.\n\nexport type OmarchyPullRequest = {\n  number: number\n  title: string\n  state: 'open' | 'merged' | 'closed'\n  createdAt: string\n  updatedAt: string\n  href: string\n  issue: string | null\n  test: string | null\n}\n\nexport type OmarchyTool = {\n  id: string\n  name: string\n  version: string | null\n  stage: 'released' | 'build-candidate' | 'public'\n  href: string\n  sourceRepo: string\n}\n\nexport const omarchyPullRequests: OmarchyPullRequest[] = ${JSON.stringify(prs, null, 2)}\n\nexport const omarchyTools: OmarchyTool[] = ${JSON.stringify(tools, null, 2)}\n`

await fs.writeFile(outputPath, generated)
console.log(`Synced ${prs.length} public Omarchy pull request(s) and ${tools.length} public tool/project source(s).`)
