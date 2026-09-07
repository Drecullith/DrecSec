const target = process.env.PRODUCTION_URL || 'https://drecsec-portfolio.vercel.app'
const attempts = Number(process.env.SECURITY_CHECK_ATTEMPTS || 20)
const delayMs = Number(process.env.SECURITY_CHECK_DELAY_MS || 15000)

const requiredExact = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
}

const requiredContains = {
  'strict-transport-security': ['max-age=31536000'],
  'permissions-policy': ['camera=()', 'microphone=()', 'geolocation=()', 'payment=()', 'usb=()'],
  'content-security-policy': [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "connect-src 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'none'",
  ],
}

function validate(headers) {
  const problems = []
  for (const [name, expected] of Object.entries(requiredExact)) {
    const actual = headers.get(name)
    if (actual !== expected) problems.push(`${name}: expected ${expected}, got ${actual ?? '<missing>'}`)
  }
  for (const [name, fragments] of Object.entries(requiredContains)) {
    const actual = headers.get(name) ?? ''
    for (const fragment of fragments) {
      if (!actual.includes(fragment)) problems.push(`${name}: missing ${fragment}`)
    }
  }
  const csp = headers.get('content-security-policy') ?? ''
  if (csp.includes("'unsafe-inline'")) problems.push("content-security-policy: contains 'unsafe-inline'")
  if (csp.includes("'unsafe-eval'")) problems.push("content-security-policy: contains 'unsafe-eval'")
  return problems
}

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const response = await fetch(target, { redirect: 'follow', cache: 'no-store' })
    const problems = response.ok ? validate(response.headers) : [`HTTP ${response.status}`]
    if (problems.length === 0) {
      console.log(`Production security check passed for ${target} (HTTP ${response.status}).`)
      process.exit(0)
    }
    console.log(`Attempt ${attempt}/${attempts} not ready: ${problems.join('; ')}`)
  } catch (error) {
    console.log(`Attempt ${attempt}/${attempts} failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs))
}

throw new Error(`Production security check failed for ${target}`)
