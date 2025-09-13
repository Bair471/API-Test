import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PersonTable from './Table'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      </div>
      <PersonTable/>
    </>
  )
}

export default App

