import express = require('express')
import { Engine } from './engine'
import { Touchmaster } from './touchmaster'
import { SearchPayload } from './types'

const http = (engine: Engine, touchmaster: Touchmaster) => {
  const http = express()
  http.use(express.json({ limit: '4mb' }))

  http.get('/', async (request, response) => {
    try {
      response.json(await touchmaster({ count: 100 }))
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
