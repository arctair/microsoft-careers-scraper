import { Database } from 'sqlite3'
import { Job, StateV2 } from './types'

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

export const migrate = async (database: Database) => {
  for (const migration of [
    'create table if not exists buckets (key text primary key, value text)',
    'create table if not exists touches (value text)',
  ]) {
    await new Promise<void>((resolve, reject) =>
      database.exec(migration, (error) =>
        error ? reject(error) : resolve(),
      ),
    )
  }
}

export const newEngine = async (database: Database): Promise<Engine> => {
  const state: StateV2 = {
    buckets: await new Promise((resolve, reject) => {
      const buckets = {} as Record<string, { latest: Job }>
      database.each(
        'select key, value from buckets',
        (error, row) =>
          error
            ? reject(error)
            : (buckets[row.key] = JSON.parse(row.value)),
        (error) => (error ? reject(error) : resolve(buckets)),
      )
      return buckets
    }),
    offset: 0,
    touches: await new Promise((resolve, reject) => {
      const touches = [] as string[]
      database.each(
        'select value from touches',
        (error, row) => (error ? reject(error) : touches.push(row.value)),
        (error) => (error ? reject(error) : resolve(touches)),
      )
      return touches
    }),
  }
  return {
    get: () => Promise.resolve(state),
    post: async (jobs) => {
      const bucket_statement = database.prepare(
        'insert into buckets (key, value) values (?, ?) on conflict do update set value = ?',
      )
      const touch_statement = database.prepare(
        'insert into touches (value) values (?)',
      )
      for (const job of jobs) {
        const previous = state.buckets[job.jobId]?.latest
        if (JSON.stringify(previous) !== JSON.stringify(job)) {
          state.buckets[job.jobId] = { latest: job }
          state.touches.push(job.jobId)
          const bucketValueAsString = JSON.stringify({ latest: job })
          bucket_statement.run(
            job.jobId,
            bucketValueAsString,
            bucketValueAsString,
          )
          touch_statement.run(job.jobId)
        }
      }
      await Promise.all([
        new Promise<void>((resolve, reject) =>
          touch_statement.finalize((error) =>
            error ? reject(error) : resolve(),
          ),
        ),
        await new Promise<void>((resolve, reject) =>
          bucket_statement.finalize((error) =>
            error ? reject(error) : resolve(),
          ),
        ),
      ])
    },
  }
}
