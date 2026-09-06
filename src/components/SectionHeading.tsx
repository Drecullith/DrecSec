type SectionHeadingProps = {
  kicker: string
  title: string
  body?: string
}

export function SectionHeading({ kicker, title, body }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  )
}
