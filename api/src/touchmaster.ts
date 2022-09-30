import { Job, StateV2 } from './types'

type TouchmasterProps = { count: number; filter: string }
export type Touchmaster = (props: TouchmasterProps) => Promise<StateV2>
export function newTouchmaster(
  getStateV2: () => Promise<StateV2>,
): Touchmaster {
  return async ({ count, filter }) => {
    const state = await getStateV2()
    const filteredTouches =
      filter === ''
        ? state.touches
        : state.touches.filter(
            (jobId) =>
              state.buckets[jobId].latest.location
                .toLowerCase()
                .indexOf(filter) > -1,
          )
    const slicedTouches = filteredTouches.slice(-count)

    return {
      buckets: slicedTouches.reduce(
        (record, jobId) =>
          Object.assign(record, { [jobId]: state.buckets[jobId] }),
        {} as Record<string, { latest: Job }>,
      ),
      offset: Math.max(0, filteredTouches.length - count),
      touches: slicedTouches,
    }
  }
}
