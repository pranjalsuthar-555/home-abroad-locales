import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/* Drop the Midjourney renders into public/ as:
     intro.mp4 / intro-poster.jpg                 (16:9, desktop)
     intro-mobile.mp4 / intro-mobile-poster.jpg   (9:16, phones)
   Until they exist the watercolor gradient below shows through, so this screen
   still looks finished with no video present. If only the desktop pair is added,
   phones fall back to it rather than showing nothing. */
const PORTRAIT_QUERY = '(max-width: 700px)'

const DESKTOP = { video: '/intro.mp4',        poster: '/intro-poster.jpg' }
const MOBILE  = { video: '/intro-mobile.mp4', poster: '/intro-mobile-poster.jpg' }

const introCSS = `
  .intro-video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.2s var(--ease-dream, ease);
  }
  .intro-video.ready { opacity: 1; }

  /* keeps the headline and button legible over whatever the artwork is doing */
  .intro-scrim {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(253,250,247,0.42) 0%, rgba(253,250,247,0.10) 45%, rgba(253,250,247,0) 70%),
      linear-gradient(to bottom, rgba(27,30,34,0.10) 0%, rgba(27,30,34,0) 30%, rgba(27,30,34,0.14) 100%);
  }

  /* Deep green fill (the Nature Seeker green already used across the app) rather than coral —
     it reads against the terracotta-and-turquoise artwork instead of blending into it, and
     carries ~7:1 contrast with white text. Swap --intro-cta-bg if the brand green differs. */
  .intro-cta {
    --intro-cta-bg: #4A5C35;
    font-family: Arial, "Helvetica Neue", Helvetica, system-ui, sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 16px 34px;
    border: none;
    border-radius: var(--radius-pill, 999px);
    background: var(--intro-cta-bg);
    color: #FFFFFF;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(27,30,34,0.28);
    transition: transform 0.25s var(--ease-spring, ease), box-shadow 0.25s ease, background 0.2s ease;
  }
  .intro-cta:hover  { background: #3B4A2A; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(27,30,34,0.32); }
  .intro-cta:active { transform: translateY(0); }

  /* the coral wordmark is light and thin — it disappears into the sky in the artwork */
  .intro-logo img { filter: drop-shadow(0 1px 10px rgba(253,250,247,0.95)) drop-shadow(0 0 22px rgba(253,250,247,0.75)); }

  @media (max-width: 600px) {
    .intro-cta { font-size: 0.9rem; padding: 15px 26px; }
  }
`

export default function IntroScreen({ onStartQuiz }) {
  const { t } = useTranslation()
  const [videoReady, setVideoReady] = useState(false)
  const [portrait, setPortrait]     = useState(
    () => typeof window !== 'undefined' && window.matchMedia(PORTRAIT_QUERY).matches
  )
  // if the portrait file hasn't been added yet, fall back to the landscape one
  const [portraitMissing, setPortraitMissing] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_QUERY)
    const onChange = e => setPortrait(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const source = portrait && !portraitMissing ? MOBILE : DESKTOP

  return (
    <div className="watercolor-bg" style={s.root}>
      <style>{introCSS}</style>

      <video
        key={source.video}
        className={`intro-video${videoReady ? ' ready' : ''}`}
        src={source.video}
        poster={source.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setVideoReady(true)}
        onError={() => {
          setVideoReady(false)
          if (source === MOBILE) setPortraitMissing(true)
        }}
      />

      <div className="intro-scrim" aria-hidden="true" />

      <div style={s.content}>
        <div className="header-logo intro-logo animate-dreamFadeUp" style={{ animationDelay: '0.2s' }}>
          <img src="/HomeAbroad-Logo_Landscape-Color.webp" alt="Home Abroad" className="logo-img" />
        </div>

        <h1
          className="font-handwritten animate-dreamFadeUp"
          style={{ ...s.headline, animationDelay: '0.45s' }}
        >
          {t('intro.headline')}
        </h1>

        <button
          className="intro-cta animate-dreamFadeUp"
          style={{ animationDelay: '0.8s' }}
          onClick={onStartQuiz}
        >
          {t('intro.cta')}
        </button>
      </div>
    </div>
  )
}

const s = {
  root: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '620px',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    textAlign: 'center',
  },
  headline: {
    fontSize: 'clamp(2.1rem, 7vw, 3.4rem)',
    lineHeight: 1.15,
    color: 'var(--ink)',
    margin: 0,
    // the script face is hairline-thin; a soft cream halo keeps it readable where it
    // crosses the busier parts of the artwork
    textShadow: '0 1px 16px rgba(253,250,247,0.9), 0 0 40px rgba(253,250,247,0.7)',
  },
}
