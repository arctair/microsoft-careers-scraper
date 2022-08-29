import express from 'express'
import { post, State } from './state'

const app = express()
app.use(express.json())

let state: State = { jobs: {} }

app.get('/', function (_, response) {
  response.json(state)
})

app.post('/', function (request, response) {
  state = post(state, request.body)
  response.json(state)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`0.0.0.0:${port}`))
