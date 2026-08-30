import { useState } from 'react'
import { FieldLabel, PersonalityTag, FIELD_TOOLTIPS } from './FieldTooltips.jsx'

function CardBody({ d, compact }) {
  const trend = d.countryTrend
  const gap   = compact ? '8px' : '14px'
  const firstPersonalityEmoji = d.personalities?.[0]?.split(' ')[0] ?? '📍'
  const [localVoiceOpen, setLocalVoiceOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>

      {d.imageUrl && (
        <div style={{ position: 'relative' }}>
          <img
            src={d.imageUrl}
            alt={d.destination}
            style={{
              width: '100%',
              height: compact ? '110px' : '190px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
              display: 'block',
            }}
          />
          {!compact && (
            <>
              {/* postcard double-rule below image */}
              <div style={{ height: '1px', background: 'var(--almond-dark)', marginTop: '12px' }} />
              <div style={{ height: '1px', background: 'var(--almond-dark)', marginTop: '3px' }} />
            </>
          )}
        </div>
      )}

      {/* name + location */}
      <div>
        <h4
          className={!compact ? 'animate-slowReveal' : ''}
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '3px', fontSize: compact ? '1rem' : '1.8rem' }}
        >
          {d.destination}
        </h4>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)', margin: 0 }}>
          {[d.country, d.region].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* personality tags */}
      {d.personalities.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {d.personalities.map(p => <PersonalityTag key={p} tag={p} />)}
        </div>
      )}

      <div style={{ height: '1px', background: 'var(--almond-dark)', flexShrink: 0 }} />

      {/* cost */}
      {d.costUSD != null && (
        <div>
          {!compact && <FieldLabel fieldKey="costUSD" />}
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink-light)', marginTop: compact ? 0 : '4px' }}>
            {compact ? '💰 ' : ''} ${d.costUSD.toLocaleString()}/mo
          </div>
        </div>
      )}

      {/* Expat Suitability Score */}
      {d.suitabilityScore != null && (
        <div className="score-section">
          <div className="score-header">
            {!compact
              ? <FieldLabel fieldKey="suitabilityScore" />
              : <span className="score-label">Expat Suitability</span>
            }
          </div>
          <div className="score-display">
            <div className="score-pips">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={`score-pip ${i <= d.suitabilityScore ? 'filled' : 'empty'}`} />
              ))}
            </div>
            <span className="score-number">{d.suitabilityScore}/5</span>
          </div>
        </div>
      )}

      {/* trend */}
      {trend && (
        <div className="trend-section">
          {!compact
            ? <FieldLabel fieldKey="countryTrend" />
            : <span className="trend-label">Country Trend</span>
          }
          <div className="trend-display">
            <span className={`trend-badge ${
              trend.includes('↑') || trend.toLowerCase().includes('grow') || trend.toLowerCase().includes('improv')
                ? 'trend-up'
                : trend.includes('↓') || trend.toLowerCase().includes('declin')
                ? 'trend-down'
                : 'trend-stable'
            }`}>{trend}</span>
            {!compact && (
              <span className="trend-explainer">
                Economic, safety &amp; quality-of-life trajectory over the past 2–3 years
              </span>
            )}
          </div>
        </div>
      )}

      {/* advantages & disadvantages — panel only */}
      {!compact && (d.advantages?.length > 0 || d.disadvantages?.length > 0) && (
        <div className="pros-cons-section">
          {d.advantages?.length > 0 && (
            <div className="pros-block">
              <FieldLabel fieldKey="advantages" />
              <p className="pros-cons-text" style={{ marginTop: '4px' }}>{d.advantages.join(' · ')}</p>
            </div>
          )}
          {d.disadvantages?.length > 0 && (
            <div className="cons-block">
              <FieldLabel fieldKey="disadvantages" />
              <p className="pros-cons-text" style={{ marginTop: '4px' }}>{d.disadvantages.join(' · ')}</p>
            </div>
          )}
        </div>
      )}

      {/* languages */}
      {d.languages.length > 0 && (
        !compact ? (
          <div>
            <FieldLabel fieldKey="languages" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)', margin: '4px 0 0' }}>
              {d.languages.join(', ')}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)', margin: 0 }}>
            🗣 {d.languages.join(', ')}
          </p>
        )
      )}

      {/* religions */}
      {d.religions.length > 0 && (
        !compact ? (
          <div>
            <FieldLabel fieldKey="religions" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)', margin: '4px 0 0' }}>
              {d.religions.join(', ')}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--slate)', margin: 0 }}>
            🕌 {d.religions.join(', ')}
          </p>
        )
      )}

      {/* tourism link */}
      {d.tourismWebsite && (
        !compact ? (
          <span className="pc-tooltip-trigger">
            <a
              href={d.tourismWebsite}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--lion)', textDecoration: 'underline' }}
            >
              Official Tourism Site ↗
            </a>
            <div className="pc-tooltip-box">{FIELD_TOOLTIPS.tourismWebsite.tip}</div>
          </span>
        ) : (
          <a
            href={d.tourismWebsite}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--lion)', textDecoration: 'underline' }}
          >
            Official Tourism Site ↗
          </a>
        )
      )}

      {/* local writers */}
      {d.writers?.length > 0 && !compact && (
        <div className="local-voice-card">
          <div
            className="local-voice-header"
            onClick={() => setLocalVoiceOpen(o => !o)}
          >
            <span className="local-voice-icon">✍️</span>
            <span className="local-voice-title">Local Voice</span>
            <span className="local-voice-toggle">{localVoiceOpen ? '−' : '+'}</span>
          </div>
          {localVoiceOpen && (
            <div className="local-voice-body">
              <p className="local-voice-desc">
                Written by someone who actually lives here. Real observations, honest takes,
                and the kind of detail you won't find in travel guides.
              </p>
              <div className="local-voice-links">
                {d.writers.map((w, i) => (
                  <a
                    key={i}
                    href={w.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="local-voice-cta"
                  >
                    {w.name} — Read on Substack ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

/* ─── Public component ─── */
export default function HoverCard({ destination: d, x = 0, y = 0, mode = 'tooltip', onClose, result }) {
  if (!d) return null

  /* ── Panel mode ── */
  if (mode === 'panel') {
    return (
      <div
        className="animate-postcardOpen"
        style={{
          position: 'fixed',
          top: '64px', right: 0, bottom: 0,
          width: '400px',
          background: 'var(--white)',
          boxShadow: '-4px 0 28px rgba(27,30,34,0.13)',
          overflowY: 'auto',
          zIndex: 60,
          borderTop: '3px solid var(--coral)',
        }}
      >
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: 'absolute', top: '14px', right: '14px',
            // backed disc so it stays visible over the panel's image header too
            background: 'rgba(253,250,247,0.94)',
            border: '1px solid rgba(27,30,34,0.12)',
            cursor: 'pointer',
            fontSize: '1rem', color: 'var(--ink)', lineHeight: 1,
            boxShadow: '0 2px 10px rgba(27,30,34,0.30)',
            backdropFilter: 'blur(4px)',
            transition: 'transform 0.3s var(--ease-spring), background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '50%', zIndex: 5,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(90deg)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg)' }}
        >
          ✕
        </button>

        {/* personality match header */}
        {result && (
          <div className="hc-personality-header">
            <div className="hc-personality-badge">
              <span className="hc-personality-emoji">{result.emoji}</span>
              <div className="hc-personality-text">
                <span className="hc-personality-match-label">Your Match</span>
                <span className="hc-personality-name">{result.key}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '24px' }}>
          <CardBody d={d} compact={false} />
        </div>
      </div>
    )
  }

  /* ── Tooltip mode ── */
  const CARD_W  = 280
  const vpW     = window.innerWidth
  const vpH     = window.innerHeight
  const isMobile = vpW < 768

  const posStyle = isMobile
    ? { left: '50%', bottom: '24px', transform: 'translateX(-50%)' }
    : {
        left: x + 22 + CARD_W > vpW ? x - CARD_W - 12 : x + 22,
        top:  Math.min(Math.max(16, y - 60), vpH - 380 - 16),
      }

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 1000,
        width: CARD_W,
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        borderTop: '3px solid var(--coral)',
        padding: '16px',
        pointerEvents: 'none',
        ...posStyle,
      }}
    >
      <CardBody d={d} compact />
    </div>
  )
}
