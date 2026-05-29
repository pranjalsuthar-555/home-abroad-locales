const BOTANICALS = [
  { emoji: '🌿', top: '8%',  left:  '3%',  size: '2rem',   rotate: '-12deg', delay: '0s',   duration: '7s'  },
  { emoji: '🍃', top: '15%', right: '4%',  size: '1.5rem', rotate: '18deg',  delay: '1.5s', duration: '9s'  },
  { emoji: '🌸', top: '72%', left:  '2%',  size: '1.8rem', rotate: '-8deg',  delay: '0.8s', duration: '8s'  },
  { emoji: '🌾', top: '85%', right: '3%',  size: '2.2rem', rotate: '22deg',  delay: '2s',   duration: '10s' },
  { emoji: '🍃', top: '45%', left:  '1%',  size: '1.2rem', rotate: '-20deg', delay: '3s',   duration: '6s'  },
]

export default function FloatingBotanicals() {
  return (
    <>
      {BOTANICALS.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top:      b.top,
            left:     b.left,
            right:    b.right,
            fontSize: b.size,
            transform: `rotate(${b.rotate})`,
            opacity: 0.22,
            animation: `gentleDrift ${b.duration} ease-in-out ${b.delay} infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          {b.emoji}
        </span>
      ))}
    </>
  )
}
