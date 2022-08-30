import { Database } from 'sqlite3'
import { JobHistory, JobState } from './state'

export function initialize(database: Database) {
  return new Promise<void>((resolve, reject) =>
    database.run(
      'create table if not exists history (entry TEXT)',
      (error) => (error ? reject(error) : resolve()),
    ),
  )
}

export function load(database: Database) {
  return new Promise<{ state: JobState; history: JobHistory }>(
    (resolve, reject) => {
      let state: JobState = { jobs: {} }
      let history: JobHistory = { entries: [] }
      database.each(
        'select entry from history',
        (error, { entry: entryAsString }) => {
          if (error) reject(error)
          else {
            const entry = JSON.parse(entryAsString)
            state.jobs[entry.job.jobId] = entry.job
            history.entries.push(entry)
          }
        },
        () => resolve({ state, history }),
      )
    },
  )
}

export function save(
  database: Database,
  previousHistory: JobHistory,
  history: JobHistory,
) {
  return new Promise<void>((resolve, reject) => {
    const statement = database.prepare('INSERT INTO history VALUES (?)')
    history.entries
      .slice(previousHistory.entries.length)
      .forEach((entry) => statement.run(JSON.stringify(entry)))
    statement.finalize((error) => (error ? reject(error) : resolve()))
  })
}
