import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PERSONALITIES } from '../data/personalities.js'

/* ─────────────────────────── DATA ─────────────────────────── */

/* Question + answer copy lives in src/i18n/locales/*.json under quiz.q1..q10.
   Only the A/B/C/D mapping is structural, so it stays here. */
const QUESTION_KEYS = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10']
const OPTION_KEYS   = [['a','A'], ['b','B'], ['c','C'], ['d','D']]

/* ─────────────────────────── SCORING ─────────────────────────── */

function calculateResult(answers) {
  console.log('[Quiz] Raw answers:', answers)

  const counts = { A: 0, B: 0, C: 0, D: 0 }
  answers.forEach(a => { if (a && counts[a] !== undefined) counts[a]++ })

  console.log('[Quiz] Letter counts:', counts)

  const ranked = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0)

  console.log('[Quiz] Ranked:', ranked)

  const primary   = PERSONALITIES[ranked[0]?.[0]] || PERSONALITIES.A
  const secondary = ranked[1]?.[1] > 0 ? PERSONALITIES[ranked[1][0]] : null
  const tertiary  = ranked[2]?.[1] > 0 ? PERSONALITIES[ranked[2][0]] : null

  const total        = answers.filter(Boolean).length || 1
  const primaryPct   = Math.round((ranked[0]?.[1] || 0) / total * 100)
  const secondaryPct = secondary ? Math.round((ranked[1]?.[1] || 0) / total * 100) : 0

  const isHybrid   = Boolean(secondary && secondaryPct >= 25)
  const blendLabel = isHybrid ? `${primary.key} × ${secondary.key}` : primary.key

  return {
    ...primary,
    primary,
    secondary,
    tertiary,
    counts,
    primaryPct,
    secondaryPct,
    blendLabel,
    isHybrid,
  }
}

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const WASH_CLASSES = ['watercolor-wash-coral', 'watercolor-wash-sage', 'watercolor-wash-lion']

/* ─────────────────────────── COMPONENT ─────────────────────────── */

const quizCSS = `
  @keyframes cardBounce {
    0%   { transform: var(--base-rotate) scale(1); }
    40%  { transform: rotate(0deg) scale(1.05); }
    100% { transform: rotate(0deg) scale(1.02); }
  }
  .card-select {
    animation: cardBounce 0.18s var(--ease-spring) both;
  }
  .dot-stamp {
    animation: waxStampPress 0.45s var(--ease-spring) both;
  }
  /* Illustration beside the question rather than above it, so a question and its four
     answers fit on screen together without scrolling. */
  .quiz-layout {
    width: 100%;
    max-width: 1080px;
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 44px;
    align-items: center;
  }
  .quiz-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    min-width: 0;
  }
  .quiz-vignette {
    width: 100%;
    max-width: 380px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 16px;
    display: block;
    justify-self: end;
    box-shadow: 0 10px 30px rgba(27,30,34,0.12);
    animation: dreamFadeUp 0.5s var(--ease-dream) both;
  }

  @media (max-width: 900px) {
    .quiz-layout { grid-template-columns: 1fr; gap: 20px; justify-items: center; }
    .quiz-body   { align-items: center; text-align: center; }
    .quiz-vignette { max-width: 200px; justify-self: center; }
  }
  /* four answer cards plus the question don't fit a phone screen at desktop spacing */
  @media (max-width: 600px) {
    .quiz-card { padding: 14px 16px !important; gap: 10px !important; }
    .quiz-body h2 { margin-bottom: 18px !important; }
    .quiz-layout { gap: 14px; }
  }
  /* stacked on a phone the illustration competes with the answers for height */
  @media (max-width: 900px) and (max-height: 720px) {
    .quiz-vignette { display: none; }
  }
`

export default function QuizScreen({ onQuizComplete }) {
  const { t } = useTranslation()
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // warm the next illustration so it doesn't pop in mid-transition
  useEffect(() => {
    if (currentQuestion >= 9) return
    const img = new Image()
    img.src = `/quiz/q${currentQuestion + 2}.webp`
  }, [currentQuestion])

  const [answers, setAnswers]                 = useState(Array(10).fill(null))
  const [phase, setPhase]                     = useState('idle') // 'idle' | 'exit' | 'enter'
  const [advancing, setAdvancing]             = useState(false)
  const [hoveredCard, setHoveredCard]         = useState(null)
  const [cardKey, setCardKey]                 = useState(0)
  const advanceRef = useRef(null)

  function transitionTo(nextIndex, newAnswers) {
    setPhase('exit')
    setTimeout(() => {
      if (nextIndex === null) {
        const result = calculateResult(newAnswers)
        onQuizComplete(newAnswers, result)
        return
      }
      setCurrentQuestion(nextIndex)
      setAdvancing(false)
      setHoveredCard(null)
      setCardKey(k => k + 1)
      setPhase('enter')
      setTimeout(() => setPhase('idle'), 420)
    }, 400)
  }

  function handleAnswer(letter) {
    if (advancing) return
    console.log(`[Quiz] Q${currentQuestion + 1} answered:`, letter)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = letter
    setAnswers(newAnswers)
    setAdvancing(true)

    clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(() => {
      const next = currentQuestion < 9 ? currentQuestion + 1 : null
      transitionTo(next, newAnswers)
    }, 600)
  }

  function handleBack() {
    if (currentQuestion === 0) return
    clearTimeout(advanceRef.current)
    setAdvancing(false)
    transitionTo(currentQuestion - 1, answers)
  }

  const qKey     = QUESTION_KEYS[currentQuestion]
  const q        = {
    question: t(`quiz.${qKey}.q`),
    options:  OPTION_KEYS.map(([optKey, letter]) => ({
      label: t(`quiz.${qKey}.${optKey}`),
      value: letter,
    })),
  }
  const selected = answers[currentQuestion]
  const pctDone  = (answers.filter(Boolean).length / 10) * 100

  const contentClass = phase === 'exit' ? 'question-exit'
                     : phase === 'enter' ? 'question-enter'
                     : ''

  return (
    <div style={s.root}>
      <style>{quizCSS}</style>

      {/* ── top bar ── */}
      <header className="quiz-topbar" style={s.topBar}>
        <div className="header-logo">
          <img src="/HomeAbroad-Logo_Landscape-Color.webp" alt="Home Abroad" className="logo-img" />
        </div>

        <div style={s.dots} role="list" aria-label={t('quiz.progressLabel')}>
          {Array.from({ length: 10 }, (_, i) => {
            const answered  = answers[i] !== null
            const isCurrent = i === currentQuestion
            return (
              <div
                key={i}
                role="listitem"
                aria-label={t('quiz.questionAria', { n: i + 1 }) + (answered ? t('quiz.answered') : '')}
                className={answered ? 'dot-stamp' : ''}
                style={{
                  width:        isCurrent ? '12px' : '8px',
                  height:       isCurrent ? '12px' : '8px',
                  borderRadius: '50%',
                  flexShrink:   0,
                  transition:   'all 0.3s var(--ease-spring)',
                  background:   answered  ? 'var(--redwood)'
                              : isCurrent ? 'var(--lion)'
                              :             'transparent',
                  border:       answered  ? 'none'
                              : isCurrent ? '1.5px solid var(--lion)'
                              :             '1.5px solid var(--almond-dark)',
                  boxShadow:    answered  ? '0 0 0 3px rgba(161,91,68,0.15)' : 'none',
                }}
              />
            )
          })}
        </div>

        <span className="quiz-counter" style={s.counter}>{t('quiz.counter', { n: currentQuestion + 1 })}</span>
      </header>

      {/* ── progress bar ── */}
      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${pctDone}%` }} />
      </div>

      {/* ── main content ── */}
      <main style={s.main}>

        {/* watercolor wash */}
        <div
          className={WASH_CLASSES[currentQuestion % 3]}
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', transition: 'opacity 0.4s ease' }}
          aria-hidden="true"
        />

        <div className={`quiz-layout ${contentClass}`} style={{ position: 'relative', zIndex: 1 }}>
          {/* no key here: changing src is enough to swap the image, and a changing key
              left the previous question's image mounted instead of replacing it */}
          <img
            className="quiz-vignette"
            src={`/quiz/q${currentQuestion + 1}.webp`}
            alt=""
            aria-hidden="true"
            width="420"
            height="420"
          />

          <div className="quiz-body">
          <span style={s.qLabel}>{t('quiz.questionLabel', { n: currentQuestion + 1 })}</span>
          <h2 style={s.qText}>{q.question}</h2>

          <div style={s.grid} key={cardKey}>
            {q.options.map(({ value, label }, index) => {
              const isSelected = selected === value
              const isHovered  = hoveredCard === value && !advancing && !isSelected
              const baseRotate = index % 2 === 0 ? 'rotate(-0.4deg)' : 'rotate(0.3deg)'
              const staggerDelay = `${0.05 + index * 0.1}s`

              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  onMouseEnter={() => { if (!advancing) setHoveredCard(value) }}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="animate-dreamFadeUp quiz-card"
                  style={{
                    '--base-rotate': baseRotate,
                    ...s.card,
                    backgroundColor: isSelected ? 'var(--coral-light)' : 'var(--white)',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(183,138,99,0.08) 27px, rgba(183,138,99,0.08) 28px)',
                    transform:  isSelected  ? 'rotate(0deg) scale(1.02)'
                               : isHovered  ? `rotate(0deg) translateY(-4px) scale(1.02)`
                               :              baseRotate,
                    boxShadow:  isSelected  ? '0 0 0 2.5px var(--coral), 2px 3px 12px rgba(27,30,34,0.08)'
                               : isHovered  ? '6px 10px 28px rgba(27,30,34,0.13)'
                               :              '2px 3px 12px rgba(27,30,34,0.08)',
                    cursor:      advancing ? 'default' : 'pointer',
                    animationDelay: staggerDelay,
                    transition: 'all 0.3s var(--ease-spring)',
                  }}
                >
                  <div
                    className={isSelected ? 'animate-waxStamp' : ''}
                    style={{
                      ...s.badge,
                      backgroundColor: isSelected ? 'var(--coral)' : 'var(--almond)',
                      color:           isSelected ? 'var(--white)' : 'var(--lion)',
                      boxShadow:       isSelected ? 'none' : 'inset 0 0 0 1.5px var(--lion)',
                    }}
                  >
                    {value}
                  </div>
                  <span style={s.answerText}>{label}</span>
                </button>
              )
            })}
          </div>
          </div>
        </div>

        {currentQuestion > 0 && (
          <button onClick={handleBack} style={{ ...s.backBtn, position: 'relative', zIndex: 1 }}>
            {t('quiz.back')}
          </button>
        )}
      </main>
    </div>
  )
}

/* ─────────────────────────── STYLES ─────────────────────────── */

const s = {
  root: {
    minHeight: '100vh',
    background: 'var(--almond)',
    display: 'flex',
    flexDirection: 'column',
  },

  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '64px',
    background: 'var(--almond)',
    borderBottom: '1px solid var(--almond-dark)',
  },

  logo: {
    fontSize: '1.2rem',
    color: 'var(--lion)',
    letterSpacing: '0.02em',
    minWidth: '100px',
  },

  dots: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  counter: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    color: 'var(--slate)',
    minWidth: '100px',
    textAlign: 'right',
  },

  progressTrack: {
    width: '100%',
    height: '2px',
    background: 'var(--almond-dark)',
  },

  progressFill: {
    height: '100%',
    background: 'var(--redwood)',
    transition: 'width 0.5s ease',
    borderRadius: '0 2px 2px 0',
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 1.5rem 40px',
    position: 'relative',
    overflow: 'hidden',
  },

  content: {
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },

  qLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--lion)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '16px',
  },

  qText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    textAlign: 'center',
    color: 'var(--ink)',
    marginBottom: '40px',
    lineHeight: 1.25,
  },

  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '14px',
  },

  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '20px 24px',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },

  badge: {
    flexShrink: 0,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginTop: '1px',
  },

  answerText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink-light)',
    lineHeight: 1.5,
  },

  backBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--slate)',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: 'var(--radius-pill)',
    transition: 'color 0.2s ease',
    letterSpacing: '0.01em',
    marginTop: '32px',
  },
}
