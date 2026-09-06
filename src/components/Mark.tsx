type MarkProps = {
  size?: number
}

export function Mark({ size = 38 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="DrecSec mark"
      className="brand-mark"
    >
      <path d="M8 7h15c10.5 0 17 6.2 17 17S33.5 41 23 41H8V7Z" />
      <path d="M16 15h7c5.8 0 9 3.1 9 9s-3.2 9-9 9h-7V15Z" className="brand-mark-cut" />
      <path d="M25 19h15M25 29h15" className="brand-mark-strike" />
    </svg>
  )
}
