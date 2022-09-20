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
  buckets: BucketsValue
  offset: number
  touches: string[]
}

export type BucketsValue = Record<string, { latest: Job }>
