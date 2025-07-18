import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { TournamentProvider } from './contexts/TournamentContext'
import { Navigation } from './components/Navigation/Navigation'
import { Home } from './components/Home/Home'
import { MatchDetails } from './components/MatchDetails/MatchDetails'
import { Footer } from './components/Footer/Footer'

import { OpeningAnimation } from './components/OpeningAnimation/OpeningAnimation'
import { AnimatePresence } from 'framer-motion'


function App() {
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true);

  useEffect(() => {
    const timeOutId = setTimeout(() => setShowOpeningAnimation(false), 1000)
    return () => clearTimeout(timeOutId);
  }, [])

  return (
    <>
      {
        showOpeningAnimation
          ?
          <OpeningAnimation />
          :
          <>
            <header>
              <Navigation />
            </header>
            <main>
              <TournamentProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="match/details/:id" element={<MatchDetails />} />
                  {/* <Route path="team-details/:id" element={<Home />} /> */}
                </Routes>
              </TournamentProvider>
            </main>
            <footer>
              <Footer />
            </footer>
          </>

      }
    </>
  )
}

export default App
