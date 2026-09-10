type MarkProps = {
  size?: number
}

export function Mark({ size = 38 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="DrecSec mark"
      className="brand-mark"
    >
      <path
        className="brand-mark-shell"
        d="M10 8h22c14 0 22 9.6 22 24S46 56 32 56H10V8Z"
      />
      <path
        className="brand-mark-shield"
        d="M28 17.5 38 14l10 3.5v13.2c0 8.4-4.5 14.8-10 18.3-5.5-3.5-10-9.9-10-18.3V17.5Z"
      />
      <path
        className="brand-mark-circuit"
        d="M10 21h10l5 5M10 32h13M10 43h10l5-5M38 25v14"
      />
      <circle className="brand-mark-node" cx="10" cy="21" r="2" />
      <circle className="brand-mark-node" cx="10" cy="32" r="2" />
      <circle className="brand-mark-node" cx="10" cy="43" r="2" />
      <circle className="brand-mark-core" cx="38" cy="32" r="3.4" />
    </svg>
  )
}
