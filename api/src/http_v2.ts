import express = require('express')
import { Engine } from './engine'
import { SearchPayload } from './state'

const http = (engine: Engine) => {
  const http = express()
  http.use(express.json())

  http.get('/', async (request, response) => {
    try {
      response.json(await engine.get())
    } catch (e: any) {
      response.status(500).json({ message: e.message })
    }
  })

  http.post('/', async (request, response) => {
    try {
      const searchPayload: SearchPayload = request.body
      await engine.post(searchPayload.eagerLoadRefineSearch.data.jobs)
      response.sendStatus(200)
    } catch (e: any) {
      response.status(500).json({ message: e.message })
    }
  })

  return http
}

export default http
