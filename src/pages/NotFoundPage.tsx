export function NotFoundPage() {
  return (
    <main className="case-study">
      <section className="case-hero shell" aria-labelledby="not-found-title">
        <span className="kicker">404 / NOT FOUND</span>
        <h1 id="not-found-title">Route<br /><em>not found.</em></h1>
        <p className="case-lede">
          That path is not part of DrecSec. It may be an old link, a typo, or a page that has not been published.
        </p>
        <div className="case-actions">
          <a className="button primary" href="/">Return home</a>
          <a className="button secondary" href="/#projects">Browse projects</a>
        </div>
      </section>
    </main>
  )
}
