import { Job } from './state'
import { StateV2 } from './types'

type TouchmasterProps = { count: number }
export type Touchmaster = (props: TouchmasterProps) => Promise<StateV2>
export function newTouchmaster(
  getStateV2: () => Promise<StateV2>,
): Touchmaster {
  return async ({ count }) => {
    const state = await getStateV2()
    const touches = state.touches.slice(-count)
    return {
      buckets: touches.reduce(
        (record, jobId) =>
          Object.assign(record, { [jobId]: state.buckets[jobId] }),
        {} as Record<string, { latest: Job }>,
      ),
      offset: Math.max(0, state.touches.length - count),
      touches,
    }
  }
}
