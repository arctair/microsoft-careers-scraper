import { newEngine } from './engine'
import _http from './http_v2'

const port = process.env.PORT || 8080
const http = _http(newEngine())
http.listen(port, () => console.log(`0.0.0.0:${port}`))
