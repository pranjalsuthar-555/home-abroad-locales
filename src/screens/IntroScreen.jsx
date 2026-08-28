import { useState } from 'react'

/* Drop the Midjourney render in as public/intro.mp4 (plus public/intro-poster.jpg).
   Until those exist the watercolor gradient below shows through, so this screen
   still looks finished with no video present. */
const VIDEO_SRC  = '/intro.mp4'
const POSTER_SRC = '/intro-poster.jpg'

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

  .intro-cta {
    font-family: Arial, "Helvetica Neue", Helvetica, system-ui, sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 16px 34px;
    border: none;
    border-radius: var(--radius-pill, 999px);
    background: var(--coral);
    color: var(--white);
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(27,30,34,0.18);
    transition: transform 0.25s var(--ease-spring, ease), box-shadow 0.25s ease, background 0.2s ease;
  }
  .intro-cta:hover  { background: var(--redwood); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(27,30,34,0.22); }
  .intro-cta:active { transform: translateY(0); }

  @media (max-width: 600px) {
    .intro-cta { font-size: 0.9rem; padding: 15px 26px; }
  }
`

export default function IntroScreen({ onStartQuiz }) {
  const [videoReady, setVideoReady] = useState(false)

  return (
    <div className="watercolor-bg" style={s.root}>
      <style>{introCSS}</style>

      <video
        className={`intro-video${videoReady ? ' ready' : ''}`}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
      />

      <div className="intro-scrim" aria-hidden="true" />

      <div style={s.content}>
        <div className="header-logo animate-dreamFadeUp" style={{ animationDelay: '0.2s' }}>
          <img src="/HomeAbroad-Logo_Landscape-Color.webp" alt="Home Abroad" className="logo-img" />
        </div>

        <h1
          className="font-handwritten animate-dreamFadeUp"
          style={{ ...s.headline, animationDelay: '0.45s' }}
        >
          Where does home begin?
        </h1>

        <button
          className="intro-cta animate-dreamFadeUp"
          style={{ animationDelay: '0.8s' }}
          onClick={onStartQuiz}
        >
          Discover your destination personality
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
  },
}
