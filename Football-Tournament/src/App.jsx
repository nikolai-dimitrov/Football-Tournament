import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { Navigation } from './components/Navigation/Navigation'
import { Home } from './components/Home/Home'


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
      <div>
      </div>
    </>
  )
}

export default App
