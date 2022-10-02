import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

type StateV2 = {
  buckets: Record<string, { latest: Job }>
  offset: number
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
  offset: 0,
  touches: [],
}
export const context = createContext<{
  filter: string | undefined
  readMark: number
  setFilter: (filter: string) => void
  setReadMark: (readMark: number) => void
  state: StateV2
}>({
  filter: undefined,
  readMark: 0,
  setFilter: () => {},
  setReadMark: () => {},
  state: defaultState,
})

export function Provider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<StateV2>(defaultState)
  const [filter, setFilter] = useState<string>('')
  const [readMark, setReadMark] = useState<number>(-1)
  const [error, setError] = useState<string>()
  useEffect(() => {
    axios
      .get('https://microsoft-careers-scraper-api.cruftbusters.com', {
        params: new URLSearchParams({
          filter,
        }),
      })
      .then((response: any) => setState(response.data), setError)
  }, [filter])
  return error ? (
    <div>state v2 provider error: ${error}</div>
  ) : (
    <context.Provider
      children={children}
      value={{
        filter,
        readMark,
        setFilter,
        setReadMark,
        state: {
          buckets: state.buckets,
          offset: state.offset,
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
