import React, { createContext, useEffect, useState } from 'react'

type StateV2 = {
  buckets: Record<string, { latest: any }>
  touches: string[]
}

const defaultState: StateV2 = {
  buckets: {},
  touches: [],
}
export const context = createContext(defaultState)

export function Provider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<StateV2>(defaultState)
  const [error, setError] = useState<string>()
  useEffect(() => {
    fetch('https://microsoft-careers-scraper-api.cruftbusters.com').then(
      async (response) => setState(await response.json()),
      setError,
    )
  }, [])
  return error ? (
    <div>state v2 provider error: ${error}</div>
  ) : (
    <context.Provider children={children} value={state} />
  )
}
