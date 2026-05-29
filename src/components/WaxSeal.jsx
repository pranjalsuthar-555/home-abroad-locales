import { useState } from 'react'

export default function WaxSeal({ checked, onChange, label }) {
  const [pressing, setPressing] = useState(false)

  function handleChange(e) {
    if (!checked) setPressing(true)
    onChange(e)
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
        />
        <div
          onAnimationEnd={() => setPressing(false)}
          style={{
            width: '22px',
            height: '22px',
            clipPath: 'polygon(50% 0%, 63% 4%, 74% 12%, 82% 24%, 86% 37%, 84% 51%, 78% 63%, 68% 72%, 55% 77%, 42% 76%, 30% 70%, 21% 60%, 16% 47%, 17% 34%, 23% 22%, 34% 13%)',
            background: checked ? 'var(--coral)' : 'var(--almond-dark)',
            boxShadow: checked ? '0 2px 8px rgba(255,111,97,0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: pressing ? 'waxStampPress 0.4s var(--ease-spring) both' : 'none',
            transition: checked ? 'none' : 'background 0.2s ease',
          }}
        >
          {checked && (
            <span style={{ color: 'var(--white)', fontSize: '10px', lineHeight: 1, marginTop: '1px' }}>✓</span>
          )}
        </div>
      </div>
      {label && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--ink-light)', lineHeight: 1.4 }}>
          {label}
        </span>
      )}
    </label>
  )
}
