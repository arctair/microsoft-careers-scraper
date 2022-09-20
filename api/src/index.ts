import { Database } from 'sqlite3'
import { migrate, newEngine } from './engine'
import http from './http'
import { newTouchmaster } from './touchmaster'

const PORT = process.env.PORT || 8080
const SQLITE_PATH = process.env.SQLITE_PATH || 'debug.db'

;(async function main() {
  const database = new Database(SQLITE_PATH)
  await migrate(database)

  const engine = await newEngine(database)
  http(engine, newTouchmaster(engine.get)).listen(PORT, () =>
    console.log(`0.0.0.0:${PORT}`),
  )
})()
