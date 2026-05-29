import { useEffect, useState } from 'react'
import { FIELD_TOOLTIPS, FieldLabel, PersonalityTag } from './FieldTooltips.jsx'

export default function PostcardModal({ destination: d, onClose, result }) {
  const [localVoiceOpen, setLocalVoiceOpen] = useState(false)

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!d) return null

  const score    = d.suitabilityScore ?? 0
  const trend    = d.countryTrend || ''
  const trendDir = trend.includes('↑') || trend.toLowerCase().includes('grow')
    ? 'up'
    : trend.includes('↓') || trend.toLowerCase().includes('declin')
    ? 'down'
    : 'stable'
  const trendLabel = trendDir === 'up' ? '↑ Growing' : trendDir === 'down' ? '↓ Declining' : '→ Stable'

  return (
    <div className="pc-overlay" onClick={onClose}>
      <div className="pc-modal" onClick={e => e.stopPropagation()}>

        {/* close */}
        <button className="pc-close" onClick={onClose} aria-label="Close">✕</button>

        {/* personality stamp */}
        {result && (
          <div className="pc-stamp-area">
            <div className="pc-stamp">
              <span className="pc-stamp-emoji">{result.emoji}</span>
              <span className="pc-stamp-name">{result.key}</span>
            </div>
          </div>
        )}

        {/* hero image */}
        {d.imageUrl ? (
          <div className="pc-hero">
            <img src={d.imageUrl} alt={d.destination} className="pc-hero-img" />
            <div className="pc-hero-overlay" />
            <div className="pc-hero-title">
              <h2 className="pc-destination-name">{d.destination}</h2>
              <p className="pc-destination-region">
                {[d.country, d.region].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="pc-no-image-title">
            <h2 className="pc-destination-name-dark">{d.destination}</h2>
            <p className="pc-destination-region-dark">
              {[d.country, d.region].filter(Boolean).join(', ')}
            </p>
          </div>
        )}

        {/* two-column content */}
        <div className="pc-content">
          <div className="pc-col-left">

            {d.personalities?.length > 0 && (
              <div className="pc-field">
                <FieldLabel fieldKey="personalities" />
                <div className="pc-tags">
                  {d.personalities.map(tag => <PersonalityTag key={tag} tag={tag} />)}
                </div>
              </div>
            )}

            {d.costUSD != null && (
              <div className="pc-field">
                <FieldLabel fieldKey="costUSD" />
                <p className="pc-value pc-value-large">${d.costUSD.toLocaleString()}/mo</p>
              </div>
            )}

            {d.suitabilityScore != null && (
              <div className="pc-field">
                <FieldLabel fieldKey="suitabilityScore" />
                <div className="pc-score-row">
                  <div className="pc-pips">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`pc-pip ${i <= score ? 'filled' : ''}`} />
                    ))}
                  </div>
                  <span className="pc-score-num">{score}/5</span>
                </div>
              </div>
            )}

            {trend && (
              <div className="pc-field">
                <FieldLabel fieldKey="countryTrend" />
                <span className={`trend-badge trend-${trendDir}`}>{trendLabel}</span>
              </div>
            )}

          </div>

          <div className="pc-col-right">

            {d.languages?.length > 0 && (
              <div className="pc-field">
                <FieldLabel fieldKey="languages" />
                <p className="pc-value">{d.languages.join(', ')}</p>
              </div>
            )}

            {d.religions?.length > 0 && (
              <div className="pc-field">
                <FieldLabel fieldKey="religions" />
                <p className="pc-value">{d.religions.join(', ')}</p>
              </div>
            )}

            <div className="pc-links">
              {d.tourismWebsite && (
                <span className="pc-tooltip-trigger">
                  <a href={d.tourismWebsite} target="_blank" rel="noopener noreferrer" className="pc-link">
                    🌐 Official Tourism Site
                  </a>
                  <div className="pc-tooltip-box">{FIELD_TOOLTIPS.tourismWebsite.tip}</div>
                </span>
              )}
              {d.writers?.length > 0 && (
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

          </div>
        </div>

        {/* advantages / disadvantages — full width */}
        {(d.advantages?.length > 0 || d.disadvantages?.length > 0) && (
          <div className="pc-pros-cons">
            {d.advantages?.length > 0 && (
              <div className="pc-field">
                <FieldLabel fieldKey="advantages" />
                <p className="pc-value pc-pros-text">{d.advantages.join(' · ')}</p>
              </div>
            )}
            {d.disadvantages?.length > 0 && (
              <div className="pc-field">
                <FieldLabel fieldKey="disadvantages" />
                <p className="pc-value pc-cons-text">{d.disadvantages.join(' · ')}</p>
              </div>
            )}
          </div>
        )}

        {/* postcard footer */}
        <div className="pc-footer">
          <span className="pc-postmark">Home Abroad</span>
          {d.lastUpdated && (
            <span className="pc-postmark-date">
              Updated {new Date(d.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
