import { Job } from './state'
import { StateV2 } from './types'

export type Engine = {
  get: () => Promise<StateV2>
  post: (jobs: Job[]) => Promise<void>
}

export const dummy: Engine = {
  get: () =>
    Promise.resolve({
      buckets: {},
      offset: 0,
      touches: [],
    }),
  post: () => Promise.resolve(),
}

export const newEngine = (): Engine => {
  const state: StateV2 = {
    buckets: {},
    offset: 0,
    touches: [],
  }
  return {
    get: () => Promise.resolve(state),
    post: async (jobs) => {
      for (const job of jobs) {
        const previous = state.buckets[job.jobId]?.latest
        if (JSON.stringify(previous) !== JSON.stringify(job)) {
          state.buckets[job.jobId] = { latest: job }
          state.touches.push(job.jobId)
        }
      }
    },
  }
}
