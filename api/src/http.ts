import express from 'express'
import { index, State } from './state'

const app = express()
app.use(express.json())

let state: State = { jobs: {} }

app.get('/', function (_, response) {
  response.json(state)
})

app.post('/', function (request, response) {
  state = index(state, request.body)
  response.json(state)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`0.0.0.0:${port}`))
