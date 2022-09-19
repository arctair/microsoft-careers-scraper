import { Database } from 'sqlite3'
import { migrate, newEngine } from './engine'
import _http from './http_v2'
import { newTouchmaster } from './touchmaster'

const PORT = process.env.PORT || 8080
const SQLITE_PATH = process.env.SQLITE_PATH || 'scraper.db'

;(async function main() {
  const database = new Database(SQLITE_PATH)
  await migrate(database)

  const engine = await newEngine(database)
  const touchmaster = newTouchmaster(engine.get)
  const http = _http(engine, touchmaster)
  http.listen(PORT, () => console.log(`0.0.0.0:${PORT}`))
})()
