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
      touches: [],
    }),
  post: () => Promise.resolve(),
}
