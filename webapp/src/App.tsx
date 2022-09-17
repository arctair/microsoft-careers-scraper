import { useEffect, useState } from 'react'

export default function App() {
  const [state, setState] = useState<any>()
  const [error, setError] = useState<string>()
  useEffect(() => {
    fetch('https://microsoft-careers-scraper-api.cruftbusters.com').then(
      async (response) => setState(await response.json()),
      setError,
    )
  }, [])
  return error ? (
    <div>drats: ${error}</div>
  ) : (
    <div>{JSON.stringify(state)}</div>
  )
}
