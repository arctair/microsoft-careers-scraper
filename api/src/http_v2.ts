import express = require('express')
import { StateV2 } from './types'

const http = express()
http.use(express.json())

http.get('/', (request, response) => {
  const state: StateV2 = {
    buckets: {},
    touches: [],
  }
  response.json(state)
})

http.post('/', (request, response) => {
  response.sendStatus(200)
})

export default http
