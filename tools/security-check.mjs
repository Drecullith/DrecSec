import fs from 'node:fs'
import path from 'node:path'

const fail = (message) => {
  console.error(`SECURITY CHECK FAILED: ${message}`)
  process.exitCode = 1
}

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
const configuredHeaders = new Map(
  (vercel.headers?.[0]?.headers ?? []).map(({ key, value }) => [key.toLowerCase(), value]),
)

const requiredHeaders = [
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'content-security-policy',
]

for (const header of requiredHeaders) {
  if (!configuredHeaders.has(header)) fail(`missing ${header}`)
}

const csp = configuredHeaders.get('content-security-policy') ?? ''
const requiredCsp = [
  "default-src 'none'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self'",
  "style-src-attr 'none'",
  "connect-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
]

for (const directive of requiredCsp) {
  if (!csp.includes(directive)) fail(`CSP missing: ${directive}`)
}

for (const unsafeToken of ["'unsafe-inline'", "'unsafe-eval'"]) {
  if (csp.includes(unsafeToken)) fail(`CSP contains ${unsafeToken}`)
}

const dangerousPatterns = [
  ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML/],
  ['eval()', /\beval\s*\(/],
  ['new Function()', /\bnew\s+Function\s*\(/],
  ['document.write()', /\bdocument\.write\s*\(/],
  ['innerHTML assignment', /\.innerHTML\s*=/],
  ['javascript: URL', /javascript\s*:/i],
]

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return /\.(?:ts|tsx|js|jsx)$/.test(entry.name) ? [fullPath] : []
  })
}

for (const file of walk('src')) {
  const content = fs.readFileSync(file, 'utf8')
  for (const [name, pattern] of dangerousPatterns) {
    if (pattern.test(content)) fail(`${name} found in ${file}`)
  }
}

if (!process.exitCode) {
  console.log('Security configuration checks passed.')
}
