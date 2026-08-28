import { useState, useRef } from 'react'
import FloatingBotanicals from '../components/FloatingBotanicals.jsx'

const STRIP_TOP    = ['🌆 Urban Explorer', '🏖️ Coastal Dreamer', '🌿 Nature Seeker', '🏡 Community Rooter', '✈️ Global Nomad', '🎨 Culture Seeker', '☕ Slow Living Advocate']
const STRIP_BOTTOM = ['🍷 Lifestyle Connoisseur', '🧘 Wellness Wanderer', '🎭 Social Butterfly', '📚 Intellectual Roamer', '🌙 Nightlife Enthusiast', '🏔️ Adventure Pursuer', '🌅 Climate Chaser']

export default function EntryScreen({ onEnter }) {
  const [value, setValue]     = useState('')
  const [shaking, setShaking] = useState(false)
  const [wrong, setWrong]     = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim().toLowerCase() === 'i am home') {
      sessionStorage.setItem('ha_access', 'true')
      localStorage.setItem('ha_access', 'true')
      onEnter()
    } else {
      setWrong(true)
      setShaking(true)
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function handleAnimationEnd() {
    setShaking(false)
    setWrong(false)
  }

  return (
    <div className="watercolor-bg" style={s.root}>
      <FloatingBotanicals />

      {/* ── top personality strip ── */}
      <div style={{ ...s.strip, background: 'var(--almond-dark)' }}>
        {STRIP_TOP.map((item, i) => <span key={i}       style={s.stripItem}>{item}</span>)}
        {STRIP_TOP.map((item, i) => <span key={`r${i}`} style={{ ...s.stripItem, opacity: 0.4 }}>{item}</span>)}
      </div>

      {/* ── centered content ── */}
      <div style={s.center}>
        <div style={s.column}>

          <div style={s.logoArea}>
            <div className="header-logo">
              <img src="/HomeAbroad-Logo_Landscape-Color.webp" alt="Home Abroad" className="logo-img" />
            </div>
            <svg
              aria-hidden="true"
              style={{ overflow: 'visible', display: 'block', marginTop: '6px' }}
              width="80" height="6" viewBox="0 0 80 6"
            >
              <line
                x1="0" y1="3" x2="80" y2="3"
                stroke="var(--lion)" strokeWidth="1.2" strokeLinecap="round"
                strokeDasharray="1000" strokeDashoffset="0"
                style={{ animation: 'inkDraw 0.8s var(--ease-reveal) 1s both', opacity: 1 }}
              />
            </svg>
          </div>

          <h1
            className="font-handwritten animate-dreamFadeUp"
            style={{ ...s.headline, animationDelay: '0.3s' }}
          >
            Where does home begin?
          </h1>

          <p className="animate-dreamFadeUp" style={{ ...s.subtext, animationDelay: '0.55s' }}>
            Enter your passphrase to continue.
          </p>

          <form
            onSubmit={handleSubmit}
            className="animate-dreamFadeUp"
            style={{ ...s.form, animationDelay: '0.8s' }}
            noValidate
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <svg
                aria-hidden="true"
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'calc(100% + 24px)', height: '70px',
                  pointerEvents: 'none', zIndex: 0, overflow: 'visible',
                  opacity: wrong ? 0 : 1, transition: 'opacity 0.3s ease',
                }}
                viewBox="0 0 340 70"
              >
                <path
                  d="M 8,36 C 16,14 100,4 170,6 C 240,8 320,16 332,34 C 344,52 258,66 170,64 C 82,62 0,52 8,36 Z"
                  stroke="var(--lion)" strokeWidth="1.5" fill="none" strokeLinecap="round"
                  strokeDasharray="900"
                  strokeDashoffset={focused ? 0 : 900}
                  style={{ transition: 'stroke-dashoffset 0.6s var(--ease-reveal)' }}
                />
              </svg>
              <input
                ref={inputRef}
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Type to enter"
                autoComplete="off"
                spellCheck={false}
                className={shaking ? 'animate-shake' : ''}
                onAnimationEnd={handleAnimationEnd}
                style={{
                  ...s.input,
                  position: 'relative', zIndex: 1,
                  borderColor: wrong ? 'var(--coral)' : focused ? 'var(--redwood)' : 'var(--lion)',
                }}
              />
            </div>
            <button type="submit" style={s.hiddenSubmit} tabIndex={-1} aria-hidden="true" />
          </form>
        </div>
      </div>

      <p style={s.footer}>© Home Abroad</p>

      {/* ── bottom personality strip ── */}
      <div style={{ ...s.strip, background: 'var(--white)' }}>
        {STRIP_BOTTOM.map((item, i) => <span key={i}       style={s.stripItem}>{item}</span>)}
        {STRIP_BOTTOM.map((item, i) => <span key={`r${i}`} style={{ ...s.stripItem, opacity: 0.4 }}>{item}</span>)}
      </div>
    </div>
  )
}

const s = {
  root: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    overflow: 'hidden',
  },
  strip: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 0',
    borderTop: '1px solid var(--almond-dark)',
    borderBottom: '1px solid var(--almond-dark)',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    zIndex: 1,
    position: 'relative',
  },
  stripItem: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: '0.95rem',
    color: 'var(--ink-light)',
    padding: '0 2rem',
    flexShrink: 0,
    borderRight: '1px solid var(--almond-dark)',
  },
  center: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2rem',
  },
  column: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
  },
  logoArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '0.5rem',
  },
  headline: {
    fontSize: 'clamp(2rem, 7vw, 3.2rem)',
    textAlign: 'center',
    color: 'var(--ink)',
    lineHeight: 1.2,
  },
  subtext: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    color: 'var(--slate)',
    textAlign: 'center',
    lineHeight: 1.6,
    marginTop: '-0.25rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    marginTop: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid var(--lion)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--white)',
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: '1.2rem',
    color: 'var(--ink)',
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    letterSpacing: '0.02em',
    WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
  },
  hiddenSubmit: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: 0,
    height: 0,
    border: 'none',
    padding: 0,
  },
  /* sits in normal flow just above the bottom strip — absolute positioning made it
     overlap the strip text on short/narrow screens */
  footer: {
    textAlign: 'center',
    padding: '0 0 10px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.7rem',
    color: 'var(--slate)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    zIndex: 2,
  },
}
