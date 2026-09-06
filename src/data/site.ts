export const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Community', href: '#community' },
]

export const projects = [
  {
    eyebrow: 'Platform',
    title: 'DrecSec',
    description:
      'The site you are looking at: a public cybersecurity portfolio designed to grow into a community for ethical hacking, CTFs, open-source work, and learning in public.',
    status: 'Building now',
    tags: ['React', 'TypeScript', 'Security by design'],
  },
  {
    eyebrow: 'Ambient AI',
    title: 'Lychnos',
    description:
      'A local-first assistant project for Linux and Omarchy: explain system events, surface problems clearly, and keep the user in control of every meaningful action.',
    status: 'In development',
    tags: ['Rust', 'Linux', 'Local-first'],
  },
  {
    eyebrow: 'Open source',
    title: 'Omarchy Contributions',
    description:
      'Learning Linux and software engineering by contributing upstream: reproducing issues, preparing focused fixes, and working through real review cycles.',
    status: 'Active',
    tags: ['Git', 'GitHub', 'Linux'],
  },
  {
    eyebrow: 'Security learning',
    title: 'CTF Field Notes',
    description:
      'A future home for sanitized challenge notes, methodology, defensive takeaways, and legal lab write-ups as the cybersecurity journey develops.',
    status: 'Next up',
    tags: ['CTF', 'Write-ups', 'Methodology'],
  },
]

export const journey = [
  {
    label: 'Now',
    title: 'Build in public',
    body: 'Turn real learning, open-source contributions, labs, and write-ups into an evidence-backed portfolio instead of a page full of buzzwords.',
  },
  {
    label: 'Next',
    title: 'CTFs & ethical labs',
    body: 'Document repeatable methodology across enumeration, web, Linux, networking, privilege escalation, and defensive lessons in legal environments.',
  },
  {
    label: 'Then',
    title: 'Community',
    body: 'Open DrecSec to member profiles, discussions, live rooms, project showcases, collaborative learning, and sensible moderation.',
  },
]

export const channels = ['general', 'ctf-help', 'linux', 'web-security', 'open-source', 'homelab']
