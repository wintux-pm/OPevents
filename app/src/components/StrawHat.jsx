export default function StrawHat({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* brim */}
      <ellipse cx="60" cy="82" rx="55" ry="17" fill="#c9882a" />
      <ellipse cx="60" cy="78" rx="55" ry="17" fill="#f0c14b" />
      <ellipse cx="60" cy="78" rx="55" ry="17" fill="none" stroke="#9c6b1f" strokeWidth="1.5" />
      {/* straw texture on brim */}
      <g stroke="#cf9a32" strokeWidth="1" opacity="0.7">
        <path d="M14 76 Q60 86 106 76" fill="none" />
        <path d="M20 70 Q60 80 100 70" fill="none" />
      </g>
      {/* crown */}
      <path d="M33 78 C31 42 43 28 60 28 C77 28 89 42 87 78 Z" fill="#f0c14b" stroke="#9c6b1f" strokeWidth="1.5" />
      <path d="M60 28 C77 28 89 42 87 78 L70 78 C72 46 67 32 60 28 Z" fill="#d9a536" opacity="0.55" />
      {/* red band */}
      <path d="M33 70 C45 79 75 79 87 70 L87 60 C75 69 45 69 33 60 Z" fill="#c81e2c" />
      <path d="M33 70 C45 79 75 79 87 70 L87 67 C75 76 45 76 33 67 Z" fill="#9c1420" opacity="0.6" />
    </svg>
  )
}
