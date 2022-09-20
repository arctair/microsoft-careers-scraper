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

export type StateV2 = {
  buckets: Record<string, { latest: Job }>
  offset: number
  touches: string[]
}
