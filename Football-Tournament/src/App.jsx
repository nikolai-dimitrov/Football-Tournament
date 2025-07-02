import { useState, useEffect } from 'react'
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
    <div>
      <h1 className="text-">Some Text</h1>
    </div>
    </>
  )
}

export default App
