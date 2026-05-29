import { useState, useEffect } from 'react'
import FloatingBotanicals from '../components/FloatingBotanicals.jsx'

const BG_GRADIENTS = {
  'Urban Explorer':  'linear-gradient(135deg, #F0ECF8 0%, #EDE0D4 100%)',
  'Coastal Dreamer': 'linear-gradient(135deg, #E8F4F0 0%, #EDE0D4 100%)',
  'Nature Seeker':   'linear-gradient(135deg, #EDF1E8 0%, #EDE0D4 100%)',
  'Rooted Romantic': 'linear-gradient(135deg, #FBF0E8 0%, #EDE0D4 100%)',
}

const revealCSS = `
  @keyframes bgReveal {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes inkLineDraw {
    from { stroke-dashoffset: 200; opacity: 0; }
    to   { stroke-dashoffset: 0;   opacity: 1; }
  }
  .reveal-name {
    animation: slowReveal 1.2s var(--ease-reveal) both;
  }
  .reveal-shimmer {
    background: linear-gradient(90deg, currentColor 0%, rgba(255,255,255,0.45) 50%, currentColor 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear 1 both;
  }
`

export default function RevealScreen({ result, onContinue, onRetake }) {
  const [bgReady, setBgReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  if (!result?.primary) return null

  const { primary, secondary, isHybrid } = result
  const background = BG_GRADIENTS[primary.key] ?? 'var(--almond)'

  return (
    <div
      style={{
        ...s.root,
        background: bgReady ? background : '#0D0C0B',
        transition: bgReady ? 'background 1s var(--ease-dream)' : 'none',
      }}
    >
      <style>{revealCSS}</style>

      <FloatingBotanicals />

      {/* retake */}
      <button onClick={onRetake} style={s.retakeBtn}>Retake quiz</button>

      {/* top color edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: primary.color + '22' }} />

      {/* main column */}
      <div style={s.column} className="animate-dreamFadeIn">

        {/* eyebrow label — sweeps in */}
        <span
          className="animate-slowReveal"
          style={{ ...s.eyebrow, animationDelay: '0.8s' }}
        >
          your destination personality is
        </span>

        {/* emoji — wax stamp */}
        <span
          className="animate-waxStamp"
          style={{ animationDelay: '1.6s', fontSize: '4rem', lineHeight: 1.1, display: 'block' }}
          role="img"
          aria-label={primary.key}
        >
          {primary.emoji}
        </span>

        {/* personality name */}
        <h1
          className="reveal-name"
          style={{
            animationDelay: '2.2s',
            color: primary.color,
            fontStyle: 'italic',
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            lineHeight: 1.05,
          }}
        >
          {primary.key}
        </h1>

        {/* decorative ink line */}
        <svg
          aria-hidden="true"
          width="120" height="6"
          viewBox="0 0 120 6"
          style={{ overflow: 'visible', display: 'block' }}
        >
          <line
            x1="0" y1="3" x2="120" y2="3"
            stroke="var(--lion)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="200"
            strokeDashoffset="0"
            style={{ animation: 'inkLineDraw 0.7s var(--ease-reveal) 3s both' }}
          />
        </svg>

        {/* 3 decorative dots in personality color */}
        <div aria-hidden="true" style={{ position: 'absolute', width: '5px',  height: '5px',  borderRadius: '50%', background: primary.color, top: '38%', left: '18%',  animation: 'waxStampPress 0.45s var(--ease-spring) 2.8s both' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: '9px',  height: '9px',  borderRadius: '50%', background: primary.color, top: '42%', right: '16%', animation: 'waxStampPress 0.45s var(--ease-spring) 3.1s both' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: '4px',  height: '4px',  borderRadius: '50%', background: primary.color, top: '48%', left: '22%',  animation: 'waxStampPress 0.45s var(--ease-spring) 2.9s both' }} />

        {/* description */}
        <p
          className="animate-dreamFadeUp"
          style={{
            animationDelay: '3.6s',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: 'var(--ink)',
            maxWidth: '520px',
            lineHeight: 1.9,
            textAlign: 'center',
          }}
        >
          {primary.description}
        </p>

        {/* you'll love */}
        <div className="animate-dreamFadeUp" style={{ animationDelay: '4.4s', ...s.youllLove }}>
          <span style={s.youllLoveLabel}>You'll love</span>
          <span style={s.youllLoveCities}>{primary.youllLove}</span>
        </div>

        {/* secondary personality — always shown when it exists */}
        {secondary && (
          <div className="animate-dreamFadeUp" style={{ animationDelay: '5s', ...s.comboBlock }}>
            <div style={s.comboDivider}>
              <span style={s.comboDividerLine} />
              <span style={s.comboDividerText}>blended with</span>
              <span style={s.comboDividerLine} />
            </div>
            <div style={s.comboInner}>
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>{secondary.emoji}</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  color: secondary.color,
                  lineHeight: 1.1,
                }}>
                  {secondary.key}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: 'var(--slate)',
                  marginTop: '4px',
                  letterSpacing: '0.03em',
                }}>
                  {result.secondaryPct}% of your answers
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="animate-dreamFadeUp" style={{ animationDelay: '5.6s', ...s.ctaBlock }}>
          <button
            className="btn-primary animate-waxStamp"
            style={{ animationDelay: '5.6s' }}
            onClick={() => onContinue(result)}
          >
            Show me my destinations →
          </button>
          <span
            className="animate-dreamFadeIn"
            style={{ animationDelay: '5.9s', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--slate)', letterSpacing: '0.01em' }}
          >
            561 destinations, filtered just for you
          </span>
        </div>
      </div>
    </div>
  )
}

const s = {
  root: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  retakeBtn: {
    position: 'fixed',
    top: '24px', right: '24px', zIndex: 10,
    background: 'none', border: 'none',
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    color: 'var(--slate)', cursor: 'pointer',
    padding: '6px 12px', borderRadius: 'var(--radius-pill)',
    transition: 'color var(--transition)', letterSpacing: '0.01em',
  },
  column: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: '600px',
    padding: '80px 2rem',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1.75rem',
    textAlign: 'center',
  },
  eyebrow: {
    fontFamily: 'var(--font-script)',
    fontSize: '1rem',
    color: 'var(--slate)',
    display: 'block',
  },
  youllLove: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '6px',
  },
  youllLoveLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
    fontWeight: 500, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: 'var(--lion)',
  },
  youllLoveCities: {
    fontFamily: 'var(--font-display)', fontStyle: 'italic',
    fontSize: '1.05rem', color: 'var(--ink-light)', lineHeight: 1.6,
  },
  ctaBlock: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '12px', marginTop: '0.5rem',
  },
  comboBlock: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '12px',
    width: '100%', maxWidth: '380px',
  },
  comboDivider: {
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
  },
  comboDividerLine: {
    flex: 1, height: '1px', background: 'var(--almond-dark)',
  },
  comboDividerText: {
    fontFamily: 'var(--font-body)', fontSize: '0.7rem',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--slate)', whiteSpace: 'nowrap',
  },
  comboInner: {
    display: 'flex', alignItems: 'center', gap: '14px',
    background: 'rgba(255,255,255,0.55)',
    border: '1px solid var(--almond-dark)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 20px',
    width: '100%',
    backdropFilter: 'blur(4px)',
  },
}
