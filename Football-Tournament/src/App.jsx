import { useState, useEffect } from 'react'
import { TournamentProvider } from './contexts/TournamentContext'
import { Routes, Route } from 'react-router'
import { Navigation } from './components/Navigation/Navigation'
import { Home } from './components/Home/Home'
import { MatchDetails } from './components/MatchDetails/MatchDetails'
import { Footer } from './components/Footer/Footer'


function App() {
  return (
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
  )
}

export default App
