import { Database } from 'sqlite3'
import { JobHistory, JobState } from './state'

export async function initialize(database: Database) {
  await new Promise<void>((resolve, reject) =>
    database.run(
      'create table if not exists history (entry TEXT)',
      (error) => (error ? reject(error) : resolve()),
    ),
  )
  await new Promise<void>((resolve, reject) =>
    database.run('create table if not exists jobs (job TEXT)', (error) =>
      error ? reject(error) : resolve(),
    ),
  )
}

export async function load(database: Database) {
  const history = await new Promise<JobHistory>((resolve, reject) => {
    let history: JobHistory = { entries: [] }
    database.each(
      'select entry from history',
      (error, { entry: entryAsString }) => {
        if (error) reject(error)
        else {
          const entry = JSON.parse(entryAsString)
          history.entries.push(entry)
        }
      },
      () => resolve(history),
    )
  })
  const state = await new Promise<JobState>((resolve, reject) => {
    let state: JobState = { jobs: {} }
    database.each(
      'select job from jobs',
      (error, { job: jobAsString }) => {
        if (error) reject(error)
        else {
          const job = JSON.parse(jobAsString)
          state.jobs[job.jobId] = job
        }
      },
      () => resolve(state),
    )
  })
  return { state, history }
}

export async function save(
  database: Database,
  newHistory: JobHistory,
  state: JobState,
) {
  const insertHistory = database.prepare('INSERT INTO history VALUES (?)')
  const upsertJob = database.prepare('INSERT INTO jobs VALUES (?)')
  newHistory.entries.forEach((entry) => {
    insertHistory.run(JSON.stringify(entry))
    upsertJob.run(JSON.stringify(state.jobs[entry.jobId]))
  })
  await new Promise<void>((resolve, reject) =>
    insertHistory.finalize((error) => (error ? reject(error) : resolve())),
  )
  await new Promise<void>((resolve, reject) =>
    upsertJob.finalize((error) => (error ? reject(error) : resolve())),
  )
}
