import { newEngine } from './engine'
import _http from './http_v2'
import { newTouchmaster } from './touchmaster'

const port = process.env.PORT || 8080
const engine = newEngine()
const touchmaster = newTouchmaster(engine.get)
const http = _http(engine, touchmaster)
http.listen(port, () => console.log(`0.0.0.0:${port}`))
