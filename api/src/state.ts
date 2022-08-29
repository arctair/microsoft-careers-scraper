export function post(state: State, payload: SearchPayload): State {
  return {
    jobs: payload.eagerLoadRefineSearch.data.jobs.reduce(
      (acc, cur) => Object.assign(acc, { [cur.jobId]: cur }),
      state.jobs,
    ),
  }
}

export interface State {
  jobs: Record<string, Job>
}

export interface Job {
  jobId: string
}

export interface SearchPayload {
  eagerLoadRefineSearch: {
    data: {
      jobs: Job[]
    }
  }
}
