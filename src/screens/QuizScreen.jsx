import { useState, useRef } from 'react'

/* ─────────────────────────── DATA ─────────────────────────── */

const QUESTIONS = [
  {
    id: 1,
    question: "Be honest: why are you really thinking about leaving?",
    options: [
      { label: "I want energy and culture — bold art, buzzing streets, a city that never runs out of things to show me", value: 'A' },
      { label: "I want to slow all the way down — warm water, salt air, absolutely nowhere to be", value: 'B' },
      { label: "I want space and silence — somewhere quiet enough to hear myself think again", value: 'C' },
      { label: "I want to feel more connected — to people, place, and daily life", value: 'D' },
    ]
  },
  {
    id: 2,
    question: "You've just arrived in a new city. What do you do first?",
    options: [
      { label: "Head straight into the busiest market or neighbourhood and let the energy pull me in", value: 'A' },
      { label: "Find the water, kick off my shoes, and just breathe", value: 'B' },
      { label: "Look for the nearest trail, forest, or quiet edge of town", value: 'C' },
      { label: "Find whoever's lived here the longest and ask them to show me around", value: 'D' },
    ]
  },
  {
    id: 3,
    question: "A friend asks what you're looking for abroad. You say...",
    options: [
      { label: "Somewhere alive — culture, art, a scene I can actually be part of", value: 'A' },
      { label: "Somewhere I can finally exhale — slow mornings, warm water, no rush", value: 'B' },
      { label: "Somewhere quiet and wild, where the landscape does most of the talking", value: 'C' },
      { label: "Somewhere I can actually belong. A real neighbourhood, real relationships", value: 'D' },
    ]
  },
  {
    id: 4,
    question: "What would make you feel like you'd truly made it abroad?",
    options: [
      { label: "I know the best hole-in-the-wall spots, and half the neighbourhood recognises me on the street", value: 'A' },
      { label: "I've stopped checking the time. The days blur together in the best way", value: 'B' },
      { label: "I've found my own quiet trail, my own view, my own sanctuary", value: 'C' },
      { label: "The café owner knows my order. I have a regular table. People know my name", value: 'D' },
    ]
  },
  {
    id: 5,
    question: "What's the thing you're most willing to give up to live abroad?",
    options: [
      { label: "Predictability — I want something unexpected around every corner", value: 'A' },
      { label: "Ambition, for a while — I'd trade the hustle for ease without hesitation", value: 'B' },
      { label: "Convenience — I'll live somewhere remote if it means real peace and quiet", value: 'C' },
      { label: "Comfort and familiarity — if it means more warmth and connection somewhere new", value: 'D' },
    ]
  },
  {
    id: 6,
    question: "You're having a hard week abroad — homesick, frustrated, nothing's working. What gets you through?",
    options: [
      { label: "I go find something happening — a market, a show, anything with energy", value: 'A' },
      { label: "I get in the water or watch the sunset. It resets everything", value: 'B' },
      { label: "I go for a long walk somewhere quiet and let my head clear", value: 'C' },
      { label: "A neighbour brings food. Someone checks in. The community I've built shows up", value: 'D' },
    ]
  },
  {
    id: 7,
    question: "What's your relationship with language barriers?",
    options: [
      { label: "Half the fun is piecing it together on the fly, mid-market, mid-conversation", value: 'A' },
      { label: "I don't overthink it — a smile and slow living go a long way", value: 'B' },
      { label: "I don't need much language where I'm headed. It's mostly just me and the landscape", value: 'C' },
      { label: "I'll learn the language. That's part of belonging — you meet people halfway", value: 'D' },
    ]
  },
  {
    id: 8,
    question: "Someone asks how long you're planning to stay. You say...",
    options: [
      { label: "As long as it stays interesting. Could be a year, could be a decade", value: 'A' },
      { label: "Indefinitely, if the sun keeps setting over water like this", value: 'B' },
      { label: "As long as the quiet holds", value: 'C' },
      { label: "Indefinitely. If it becomes home, why leave?", value: 'D' },
    ]
  },
  {
    id: 9,
    question: "Which of these would make you fall in love with a destination?",
    options: [
      { label: "Stumbling onto a street party and being pulled into a stranger's home for dinner", value: 'A' },
      { label: "A hammock, warm water, and absolutely nowhere to be", value: 'B' },
      { label: "Turning a corner and finding a view so big it stops me cold", value: 'C' },
      { label: "Reading that three people I respect have quietly put down roots here in the last two years", value: 'D' },
    ]
  },
  {
    id: 10,
    question: "Ten years from now, the version of you that made the right choice abroad...",
    options: [
      { label: "Still finds something new around every corner. Never bored, always curious", value: 'A' },
      { label: "Lives somewhere the ocean is part of daily life. Slower, lighter, unbothered", value: 'B' },
      { label: "Has a view they never get tired of, and a quiet life built around it", value: 'C' },
      { label: "Has a village. Close friends, rituals, a life that feels genuinely inhabited", value: 'D' },
    ]
  },
]

const PERSONALITIES = {
  A: {
    letter: 'A',
    key: 'Urban Explorer',
    emoji: '🏙',
    color: '#6B4FA0',
    tagClass: 'tag-urban',
    description:
      "You're a culture sponge. You thrive in dynamic places where the espresso is strong, the art is bold, and the possibilities feel endless. Think: bustling markets, late-night jazz clubs, walkable streets, and ten different languages in earshot. You're fuelled by curiosity, connection, and the thrill of being part of something.",
    youllLove: 'Barcelona, Tokyo, Lisbon, Buenos Aires, Mexico City',
  },
  B: {
    letter: 'B',
    key: 'Coastal Dreamer',
    emoji: '🌴',
    color: '#2A7A65',
    tagClass: 'tag-coastal',
    description:
      "Slow mornings. Salt on your skin. A deep need to exhale. You belong somewhere where the water is clear, the days are long, and shoes are optional. You're not trying to impress anyone — you're here to unwind, connect, and maybe learn how to surf or nap like a pro.",
    youllLove: 'Koh Phangan, Bali, Canary Islands, Tulum, Zanzibar',
  },
  C: {
    letter: 'C',
    key: 'Nature Seeker',
    emoji: '🏔',
    color: '#4A5C35',
    tagClass: 'tag-nature',
    description:
      "Solitude is sacred, and nature is your sanctuary. You don't mind getting your hands dirty or taking the long way around if it means peace, quiet, and epic views. You're probably a deep thinker, a good listener, and maybe even a little bit mystical.",
    youllLove: "Chiang Mai, San Cristóbal de las Casas, the Pyrenees, Oaxaca's highlands, the Dolomites",
  },
  D: {
    letter: 'D',
    key: 'Rooted Romantic',
    emoji: '🐓',
    color: '#8B4A1E',
    tagClass: 'tag-rooted',
    description:
      "You're all about meaningful simplicity. You value community, connection, and daily life that's grounded and slow. You don't mind hard work — especially when it's in service of something real, like growing food, raising kids, or putting down roots.",
    youllLove: 'Rural France, Southern Spain, Central Portugal, Northern Thailand, Sicily\'s countryside',
  },
}

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
`

export default function QuizScreen({ onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
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

  const q        = QUESTIONS[currentQuestion]
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

        <div style={s.dots} role="list" aria-label="Progress">
          {Array.from({ length: 10 }, (_, i) => {
            const answered  = answers[i] !== null
            const isCurrent = i === currentQuestion
            return (
              <div
                key={i}
                role="listitem"
                aria-label={`Question ${i + 1}${answered ? ' answered' : ''}`}
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

        <span className="quiz-counter" style={s.counter}>{currentQuestion + 1} / 10</span>
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

        <div className={contentClass} style={{ ...s.content, position: 'relative', zIndex: 1 }}>
          <span style={s.qLabel}>Question {currentQuestion + 1}</span>
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
                  className="animate-dreamFadeUp"
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

        {currentQuestion > 0 && (
          <button onClick={handleBack} style={{ ...s.backBtn, position: 'relative', zIndex: 1 }}>
            ← Back
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
    padding: '80px 1.5rem 100px',
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
