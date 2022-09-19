import { Job } from './state'

export type StateV2 = {
  buckets: Record<string, { latest: Job }>
  offset: number
  touches: string[]
}
