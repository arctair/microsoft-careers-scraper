import { Database } from 'sqlite3'
import { Job, JobHistory, JobsById } from './state'

export async function initialize(database: Database) {
  for (const q of [
    'create table if not exists history (entry TEXT)',
    'create table if not exists jobs (job TEXT)',
  ]) {
    await new Promise<void>((resolve, reject) =>
      database.run(q, (error) => (error ? reject(error) : resolve())),
    )
  }
}

export const load = async (database: Database) => ({
  history: await loadHistory(database),
  index: await loadIndex(database),
})

function loadHistory(database: Database) {
  return new Promise<JobHistory>((resolve, reject) => {
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
}

function loadIndex(database: Database) {
  return new Promise<JobsById>((resolve, reject) => {
    const jobs: Record<string, Job> = {}
    database.each(
      'select job from jobs',
      (error, { job: jobAsString }) => {
        if (error) reject(error)
        else {
          const job = JSON.parse(jobAsString)
          jobs[job.jobId] = job
        }
      },
      () =>
        resolve({
          count: Object.keys(jobs).length,
          jobs,
        }),
    )
  })
}

export async function save(
  database: Database,
  newHistory: JobHistory,
  state: JobsById,
) {
  const insertHistory = database.prepare('INSERT INTO history VALUES (?)')
  const upsertJob = database.prepare('INSERT INTO jobs VALUES (?)')
  newHistory.entries.forEach((entry) => {
    insertHistory.run(JSON.stringify(entry))
    upsertJob.run(JSON.stringify(state.jobs[entry.jobId]))
  })
  for (const statement of [insertHistory, upsertJob]) {
    await new Promise<void>((resolve, reject) =>
      statement.finalize((error) => (error ? reject(error) : resolve())),
    )
  }
}
