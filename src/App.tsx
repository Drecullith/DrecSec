import { useEffect } from 'react'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OmarchyContributionsPage } from './pages/OmarchyContributionsPage'

const productionOrigin = 'https://drecsec-portfolio.vercel.app'

function setPropertyMeta(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.append(element)
  }
  element.content = content
}

function setDescription(content: string) {
  let element = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!element) {
    element = document.createElement('meta')
    element.name = 'description'
    document.head.append(element)
  }
  element.content = content
}

function setCanonical(path: string | null) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const existingOgUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]')

  if (!path) {
    existing?.remove()
    existingOgUrl?.remove()
    return
  }

  const url = `${productionOrigin}${path}`
  const link = existing ?? document.createElement('link')
  link.rel = 'canonical'
  link.href = url
  if (!existing) document.head.append(link)
  setPropertyMeta('og:url', url)
}

function setManagedRobots(noIndex: boolean) {
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"][data-drecsec-managed="true"]')
  if (!noIndex) {
    existing?.remove()
    return
  }

  const element = existing ?? document.createElement('meta')
  element.name = 'robots'
  element.content = 'noindex,follow'
  element.dataset.drecsecManaged = 'true'
  if (!existing) document.head.append(element)
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const isHome = path === '/'
  const isOmarchy = path === '/projects/omarchy-contributions'

  const content = isHome
    ? <HomePage />
    : isOmarchy
      ? <OmarchyContributionsPage />
      : <NotFoundPage />

  useEffect(() => {
    const title = isHome
      ? 'DrecSec — Drecullith'
      : isOmarchy
        ? 'Omarchy Contributions — DrecSec'
        : 'Page not found — DrecSec'
    const description = isHome
      ? 'A public cybersecurity portfolio documenting projects, open-source work, ethical labs, and learning in public.'
      : isOmarchy
        ? 'A public record of upstream Omarchy fixes, regression tests, tools, and release milestones by Drecullith.'
        : 'The requested DrecSec page could not be found.'

    document.title = title
    setDescription(description)
    setPropertyMeta('og:title', title)
    setPropertyMeta('og:description', description)
    setCanonical(isHome ? '/' : isOmarchy ? '/projects/omarchy-contributions' : null)
    setManagedRobots(!isHome && !isOmarchy)
  }, [isHome, isOmarchy])

  return (
    <div className="page">
      <Header />
      {content}
      <footer className="footer">
        <div className="shell footer-inner">
          <div><strong>DRECSEC</strong><span>Cybersecurity portfolio by Drecullith</span></div>
          <p>© {new Date().getFullYear()} Drecullith. Built in public.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
