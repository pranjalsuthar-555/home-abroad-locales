import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
  /* Tap-to-skip. Zeroing animation-delay doesn't help once an animation is already
     running, so this drops the animations entirely and asserts the finished state. */
  .reveal-instant *,
  .reveal-instant *::before,
  .reveal-instant *::after {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    clip-path: none !important;
  }
  .reveal-name {
    animation: slowReveal 1.2s var(--ease-reveal) both;
  }
  /* the artwork is a wide, detailed scene — a small circle would crop away most of it,
     so it reads as a postcard instead */
  .reveal-portrait {
    width: min(400px, 84vw);
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 12px;
    display: block;
    box-shadow: 0 10px 30px rgba(27,30,34,0.16);
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

export default function RevealScreen({ result, destinationCount = 0, onContinue, onRetake }) {
  const { t } = useTranslation()
  const [bgReady, setBgReady] = useState(false)
  const [artOk,   setArtOk]   = useState(true)
  /* The sequence is a nice first impression and a chore on a retake, so a tap
     anywhere finishes it immediately. `ready` gates the CTA's pointer events so a
     tap aimed at the background can't accidentally fire it while it's still fading in. */
  const [skipped, setSkipped] = useState(false)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), skipped ? 0 : 3000)
    return () => clearTimeout(t)
  }, [skipped])

  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  if (!result?.primary) return null

  const { primary, secondary, isHybrid } = result
  const background = BG_GRADIENTS[primary.key] ?? 'var(--almond)'

  return (
    <div
      onClick={() => setSkipped(true)}
      className={skipped ? 'reveal-instant' : undefined}
      style={{
        ...s.root,
        background: bgReady ? background : '#0D0C0B',
        transition: bgReady ? 'background 1s var(--ease-dream)' : 'none',
      }}
    >
      <style>{revealCSS}</style>

      {/* retake */}
      <button onClick={onRetake} style={s.retakeBtn}>{t('reveal.retake')}</button>

      {/* top color edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: primary.color + '22' }} />

      {/* main column */}
      <div style={s.column} className="animate-dreamFadeIn">

        {/* eyebrow label — sweeps in */}
        <span
          className="animate-slowReveal"
          style={{ ...s.eyebrow, animationDelay: '0.35s' }}
        >
          {t('reveal.eyebrow')}
        </span>

        {/* Watercolour portrait if public/personalities/<key>.webp exists, otherwise the
            emoji it replaces — so this ships fine before the artwork is drawn. */}
        {artOk ? (
          <img
            className="animate-waxStamp reveal-portrait"
            style={{ animationDelay: '0.7s' }}
            src={`/personalities/${primary.i18nKey}.webp`}
            alt={t(`personalities.${primary.i18nKey}.name`)}
            onError={() => setArtOk(false)}
            width="440"
            height="248"
          />
        ) : (
          <span
            className="animate-waxStamp"
            style={{ animationDelay: '0.7s', fontSize: '4rem', lineHeight: 1.1, display: 'block' }}
            role="img"
            aria-label={t(`personalities.${primary.i18nKey}.name`)}
          >
            {primary.emoji}
          </span>
        )}

        {/* personality name */}
        <h1
          className="reveal-name"
          style={{
            animationDelay: '1.05s',
            color: primary.color,
            fontStyle: 'italic',
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            lineHeight: 1.05,
          }}
        >
          {t(`personalities.${primary.i18nKey}.name`)}
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
            style={{ animation: 'inkLineDraw 0.7s var(--ease-reveal) 1.5s both' }}
          />
        </svg>

        {/* description */}
        <p
          className="animate-dreamFadeUp"
          style={{
            animationDelay: '1.75s',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: 'var(--ink)',
            maxWidth: '520px',
            lineHeight: 1.9,
            textAlign: 'center',
          }}
        >
          {t(`personalities.${primary.i18nKey}.description`)}
        </p>

        {/* you'll love */}
        <div className="animate-dreamFadeUp" style={{ animationDelay: '2.1s', ...s.youllLove }}>
          <span style={s.youllLoveLabel}>{t('reveal.youllLove')}</span>
          <span style={s.youllLoveCities}>{t(`personalities.${primary.i18nKey}.youllLove`)}</span>
        </div>

        {/* secondary personality — always shown when it exists */}
        {secondary && (
          <div className="animate-dreamFadeUp" style={{ animationDelay: '2.4s', ...s.comboBlock }}>
            <div style={s.comboDivider}>
              <span style={s.comboDividerLine} />
              <span style={s.comboDividerText}>{t('reveal.blendedWith')}</span>
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
                  {t(`personalities.${secondary.i18nKey}.name`)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: 'var(--slate)',
                  marginTop: '4px',
                  letterSpacing: '0.03em',
                }}>
                  {t('reveal.percentOfAnswers', { pct: result.secondaryPct })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="animate-dreamFadeUp" style={{ animationDelay: '2.7s', ...s.ctaBlock }}>
          <button
            className="btn-primary animate-waxStamp"
            style={{ animationDelay: '2.7s', pointerEvents: ready ? 'auto' : 'none' }}
            onClick={() => onContinue(result)}
          >
            {t('reveal.cta')}
          </button>
          <span
            className="animate-dreamFadeIn"
            style={{ animationDelay: '2.9s', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--slate)', letterSpacing: '0.01em' }}
          >
            {destinationCount > 0 ? t('reveal.subtext', { count: destinationCount }) : t('reveal.subtextUnknown')}
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
    // NOT justifyContent:center — a centred flex child that outgrows its container
    // overflows equally in both directions, putting the top out of reach even when
    // scrollable. The column's `margin: auto 0` centres it when there is room and
    // pins it to the top when there isn't.
    justifyContent: 'flex-start',
    overflowX: 'hidden',
    overflowY: 'auto',
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
    padding: '56px 2rem',
    margin: 'auto 0',            // see root: centres when it fits, never clips when it doesn't
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1.5rem',
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
