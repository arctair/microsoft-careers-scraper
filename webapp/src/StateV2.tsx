import React, { createContext, useEffect, useState } from 'react'

type StateV2 = {
  buckets: Record<string, { latest: Job }>
  touches: string[]
}

type Job = {
  applyUrl: string
  badge: string
  category: string
  city: string
  companyName: string
  country: string
  dateCreated: string
  description: string
  descriptionTeaser: string
  employmentType: string
  experience: string
  industry: string
  isMultiLocation: string
  isRemote: string
  jd_display: string
  jobId: string
  jobQualifications: string
  jobResponsibilities: string
  jobSeqNo: string
  jobSummary: string
  jobVisibility: string[]
  locale: string
  location: string
  locationLatlong: string
  mostpopular: number
  multi_location: string[]
  multi_location_array: { location: string }[]
  orgFunction: string
  parentRefNum: string
  postedDate: string
  refNum: string
  reqId: string
  requisitionRoleType: string
  searchresults_display: string
  state: string
  subCategory: string
  targetLevel: string
  title: string
  type: string
  worksite: string
}

const defaultState: StateV2 = {
  buckets: {},
  touches: [],
}
export const context = createContext<{
  filter: string | undefined
  setFilter: (filter: string) => void
  state: StateV2
}>({
  filter: undefined,
  setFilter: () => {},
  state: defaultState,
})

export function Provider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<StateV2>(defaultState)
  const [filter, setFilter] = useState<string>()
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
    <context.Provider
      children={children}
      value={{
        filter,
        setFilter,
        state: {
          buckets: state.buckets,
          touches: filter
            ? state.touches.filter(
                (jobId) =>
                  state.buckets[jobId].latest.location
                    .toLowerCase()
                    .indexOf(filter) > -1,
              )
            : state.touches,
        },
      }}
    />
  )
}
