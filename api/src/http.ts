import express from 'express'
import { Database } from 'sqlite3'
import { initialize, load, save } from './sqlite'
import { index, updateHistory } from './state'

const SQLITE_PATH = process.env.SQLITE_PATH
if (SQLITE_PATH === undefined) {
  throw Error('please supply environment variable SQLITE_PATH')
}

const app = express()
app.use(express.json({ limit: '4mb' }))

async function main() {
  const database = new Database(SQLITE_PATH!)
  await initialize(database)

  let { state, history } = await load(database)

  app.get('/', function (_, response) {
    response.json({ history, state })
  })

  app.get('/history', function (request, response) {
    const jobId = request.query.jobId
    if (jobId) {
      response.json({
        entries: history.entries.filter(
          (entry) => entry.job.jobId === jobId,
        ),
      })
    } else {
      const count = history.entries.length
      const start = Math.max(0, count - 20)
      response.json({ entries: history.entries.slice(start, count) })
    }
  })

  app.post('/', async function (request, response) {
    const previousState = state
    state = index(state, request.body)
    const previousHistory = history
    history = updateHistory(history, previousState, state)
    await save(database, {
      entries: history.entries.slice(previousHistory.entries.length),
    })
    response.sendStatus(204)
  })
}

main()
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`0.0.0.0:${port}`))
