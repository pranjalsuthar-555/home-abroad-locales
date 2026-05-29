import { useState } from 'react'
import { useDestinations } from './data/useDestinations.js'
import EntryScreen    from './screens/EntryScreen.jsx'
import LandingScreen  from './screens/LandingScreen.jsx'
import QuizScreen     from './screens/QuizScreen.jsx'
import RevealScreen   from './screens/RevealScreen.jsx'
import ExplorerScreen from './screens/ExplorerScreen.jsx'

function loadSaved() {
  try {
    const raw = localStorage.getItem('ha_result')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const hasAccess   = !!sessionStorage.getItem('ha_access') || !!localStorage.getItem('ha_access')
  const savedResult = loadSaved()

  const [currentScreen, setCurrentScreen] = useState(() => {
    if (savedResult)  return 'explorer'   // returning user — skip password + quiz entirely
    if (!hasAccess)   return 'entry'
    return 'landing'
  })

  const [quizAnswers,       setQuizAnswers]       = useState(Array(10).fill(null))
  const [personalityResult, setPersonalityResult] = useState(savedResult)

  const { destinations, loading: destLoading, error: destError } = useDestinations()

  function handleEnter() {
    setCurrentScreen('landing')
  }

  function handleStartQuiz() {
    setCurrentScreen('quiz')
  }

  function handleQuizComplete(answers, result) {
    setQuizAnswers(answers)
    setPersonalityResult(result)
    try {
      localStorage.setItem('ha_result', JSON.stringify(result))
      localStorage.setItem('ha_screen', 'explorer')
    } catch {}
    setCurrentScreen('reveal')
  }

  function handleRevealDone() {
    setCurrentScreen('explorer')
  }

  function handleRestartQuiz() {
    setQuizAnswers(Array(10).fill(null))
    setPersonalityResult(null)
    try {
      localStorage.removeItem('ha_result')
      localStorage.removeItem('ha_screen')
    } catch {}
    setCurrentScreen('quiz')
  }

  switch (currentScreen) {
    case 'entry':
      return <EntryScreen onEnter={handleEnter} />

    case 'landing':
      return <LandingScreen onStartQuiz={handleStartQuiz} />

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
