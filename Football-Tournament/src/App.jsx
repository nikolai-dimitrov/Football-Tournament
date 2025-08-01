import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { AnimatePresence } from 'framer-motion'

import { FadeTransition } from './components/FadeTransition/FadeTransition'
import { TournamentProvider } from './contexts/TournamentContext'
import { Navigation } from './components/Navigation/Navigation'
import { Home } from './components/Home/Home'
import { MatchDetails } from './components/MatchDetails/MatchDetails'
import { TeamDetails } from './components/TeamDetails/TeamDetails'
import { Footer } from './components/Footer/Footer'

import { OpeningAnimation } from './components/OpeningAnimation/OpeningAnimation'


function App() {
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true);

  useEffect(() => {
    const timeOutId = setTimeout(() => setShowOpeningAnimation(false), 1000)
    return () => clearTimeout(timeOutId);
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {
          showOpeningAnimation
            ?
            <FadeTransition
              keyString="loadingLayoutContainer"
              durationSeconds={0.3}
              isInAnimatePresence={true}
            >
              <OpeningAnimation />

            </FadeTransition >
            :
            <FadeTransition
              keyString="contentContainer"
              durationSeconds={0.3}
              isInAnimatePresence={true}
            >
              <header>
                <Navigation />
              </header>
              <main>
                <TournamentProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="match/details/:id" element={<MatchDetails />} />
                    <Route path="team/details/:id" element={<TeamDetails />} />
                  </Routes>
                </TournamentProvider>
              </main>
              <footer>
                <Footer />
              </footer>
            </FadeTransition>

        }
      </AnimatePresence>
    </>
  )
}

export default App
