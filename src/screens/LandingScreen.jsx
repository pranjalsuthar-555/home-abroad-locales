import { useState, useEffect } from 'react'

export default function LandingScreen({ onStartQuiz }) {
  const [showCTA, setShowCTA]   = useState(false)
  const [flipped, setFlipped]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), 800)
    return () => clearTimeout(t)
  }, [])

  /* Auto-flip: wait 2s, then flip every 3.5s */
  useEffect(() => {
    let interval
    const timeout = setTimeout(() => {
      setFlipped(true)
      interval = setInterval(() => setFlipped(f => !f), 3500)
    }, 2000)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div style={s.root}>

      {/* ══ FLIP CARD ══ */}
      <div style={s.scene}>
        <div style={{
          ...s.card,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Front — postcard 1 */}
          <div style={s.face}>
            <img
              src="/postcard%20layout%20-%201.webp"
              alt="Postcard front"
              style={s.img}
            />
          </div>
          {/* Back — postcard 2 */}
          <div style={{ ...s.face, ...s.faceBack }}>
            <img
              src="/postcard%20layout%20-%202.webp"
              alt="Postcard back"
              style={s.img}
            />
          </div>
        </div>
      </div>

      {/* ══ CTA ══ */}
      {showCTA && (
        <button
          className="btn-primary animate-waxStamp"
          onClick={onStartQuiz}
          style={s.cta}
        >
          Discover your destination personality →
        </button>
      )}
    </div>
  )
}

const s = {
  root: {
    minHeight: '100vh',
    background: 'var(--almond)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem 4rem',
    // the flip card's 3D perspective paints wider than its layout box, which pushes
    // the page into sideways scroll on narrow screens
    overflowX: 'hidden',
  },
  scene: {
    perspective: '1200px',
    width: '100%',
    maxWidth: '620px',
  },
  card: {
    position: 'relative',
    width: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.9s ease',
  },
  face: {
    width: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    background: '#fff',
    padding: '10px',
    borderRadius: '3px',
    boxShadow: '0 6px 32px rgba(27,30,34,0.13), 0 1px 6px rgba(27,30,34,0.07)',
  },
  faceBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transform: 'rotateY(180deg)',
  },
  img: {
    width: '100%',
    display: 'block',
    borderRadius: '1px',
  },
  cta: {
    marginTop: '2.5rem',
    fontFamily: 'var(--font-script)',
    fontSize: '1.15rem',
    letterSpacing: '0.01em',
  },
}
