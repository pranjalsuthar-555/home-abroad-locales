import { useState, useEffect, useRef } from 'react'
import { useDestinations } from './data/useDestinations.js'
import { rehydrateResult } from './data/personalities.js'
import IntroScreen      from './screens/IntroScreen.jsx'
import QuizScreen       from './screens/QuizScreen.jsx'
import RevealScreen     from './screens/RevealScreen.jsx'
import ExplorerScreen   from './screens/ExplorerScreen.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'

function loadSaved() {
  try {
    const raw = localStorage.getItem('ha_result')
    // rehydrate: a result stored by an older build can be missing fields added since
    return raw ? rehydrateResult(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export default function App() {
  const savedResult = loadSaved()

  const [currentScreen, setCurrentScreen] = useState(() => (
    savedResult ? 'explorer' : 'intro'   // returning users skip straight to their Explorer
  ))

  const [personalityResult, setPersonalityResult] = useState(savedResult)

  const { destinations, loading: destLoading, error: destError } = useDestinations()

  /* ── Back button walks the screens instead of leaving the site ──
     This is a single page with no per-screen URLs, so the browser had exactly one
     history entry: pressing Back anywhere — including right after viewing a
     destination — dropped the user out of the app. Each screen now records an entry,
     so Back retraces explorer → reveal → quiz → intro and only exits from the first
     screen. (The destination card pushes its own entry in ExplorerScreen, so Back
     there closes the card before touching these.) ── */
  const skipPushRef = useRef(false)

  useEffect(() => {
    window.history.replaceState({ haScreen: currentScreen }, '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (skipPushRef.current) { skipPushRef.current = false; return }
    if (window.history.state?.haScreen === currentScreen) return
    window.history.pushState({ haScreen: currentScreen }, '')
  }, [currentScreen])

  useEffect(() => {
    const onPop = e => {
      const screen = e.state?.haScreen
      if (!screen) return
      skipPushRef.current = true      // restoring, don't push a duplicate entry
      setCurrentScreen(screen)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function handleStartQuiz() {
    setCurrentScreen('quiz')
  }

  function handleQuizComplete(answers, result) {
    setPersonalityResult(result)
    try {
      localStorage.setItem('ha_result', JSON.stringify(result))
      localStorage.setItem('ha_screen', 'explorer')
    } catch { /* private mode / storage disabled — result just won't persist */ }
    setCurrentScreen('reveal')
  }

  function handleRevealDone() {
    setCurrentScreen('explorer')
  }

  function handleRestartQuiz() {
    setPersonalityResult(null)
    try {
      localStorage.removeItem('ha_result')
      localStorage.removeItem('ha_screen')
    } catch { /* private mode / storage disabled */ }
    setCurrentScreen('quiz')
  }

  function renderScreen() {
    switch (currentScreen) {
      case 'intro':
        return <IntroScreen onStartQuiz={handleStartQuiz} />

      case 'quiz':
        return <QuizScreen onQuizComplete={handleQuizComplete} />

      case 'reveal':
        return (
          <RevealScreen
            result={personalityResult}
            onContinue={handleRevealDone}
            onRetake={handleRestartQuiz}
          />
        )

      case 'explorer':
        return (
          <ExplorerScreen
            result={personalityResult}
            destinations={destinations}
            destLoading={destLoading}
            destError={destError}
            onRestartQuiz={handleRestartQuiz}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      {renderScreen()}
      <LanguageSwitcher />
    </>
  )
}
