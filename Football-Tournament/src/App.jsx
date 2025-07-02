import { useState, useEffect } from 'react'
import { TournamentProvider } from './contexts/TournamentContext'
import { Routes, Route } from 'react-router'
import { Navigation } from './components/Navigation/Navigation'
import { Home } from './components/Home/Home'
import { Footer } from './components/Footer/Footer'


function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const readCsv = async () => {
      const someData = await fetch('/data/players.csv');
      const result = await someData.text()
      console.log(result)

    }
    readCsv()
  }, [])
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <TournamentProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="match-details/:id" element={<Home />} /> */}
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
