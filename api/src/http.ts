import express from 'express'
import { index, JobHistory, JobState, updateHistory } from './state'

const app = express()
app.use(express.json({ limit: '4mb' }))

let state: JobState = { jobs: {} }
let history: JobHistory = { entries: [] }

app.get('/', function (_, response) {
  response.json({ history, state })
})

app.post('/', function (request, response) {
  const previous = state
  state = index(state, request.body)
  history = updateHistory(history, previous, state)
  response.json({ history, state })
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`0.0.0.0:${port}`))
