import express from 'express'
import { Database } from 'sqlite3'
import { index, JobHistory, JobState, updateHistory } from './state'

const SQLITE_PATH = process.env.SQLITE_PATH
if (SQLITE_PATH === undefined) {
  throw Error('please supply environment variable SQLITE_PATH')
}

const app = express()
app.use(express.json({ limit: '4mb' }))

async function main() {
  const database = new Database(SQLITE_PATH!)
  await new Promise<void>((resolve, reject) =>
    database.run(
      'create table if not exists history (entry TEXT)',
      (error) => (error ? reject(error) : resolve()),
    ),
  )

  let { state, history } = await load(database)

  app.get('/', function (_, response) {
    response.json({ history, state })
  })

  app.post('/', function (request, response) {
    const previousState = state
    state = index(state, request.body)
    const previousHistory = history
    history = updateHistory(history, previousState, state)
    save(database, previousHistory, history)
    response.json({ history, state })
  })
}

function load(database: Database) {
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
            state.jobs[entry.jobId] = entry
            history.entries.push(entry)
          }
        },
        () => resolve({ state, history }),
      )
    },
  )
}

function save(
  database: Database,
  previousHistory: JobHistory,
  history: JobHistory,
) {
  const statement = database.prepare('INSERT INTO history VALUES (?)')
  history.entries
    .slice(previousHistory.entries.length)
    .forEach((entry) => {
      statement.run(JSON.stringify(entry))
    })
  statement.finalize()
}

main()
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`0.0.0.0:${port}`))
