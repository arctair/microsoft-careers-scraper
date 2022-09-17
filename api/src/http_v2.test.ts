import { request, setTestApp } from 'axios-test-instance'
import http from './http_v2'
import { SearchPayload } from './state'
import { StateV2 } from './types'

beforeAll(() => setTestApp(http))

describe('http v2', () => {
  test('get / returns default state', async () => {
    const response = await request.get('/')
    expect(response.status).toBe(200)
    expect(response.data).toStrictEqual<StateV2>({
      buckets: {},
      touches: [],
    })
  })
  test('post / with search payload does nothing', async () => {
    const searchPayload: SearchPayload = {
      eagerLoadRefineSearch: { data: { jobs: [] } },
    }
    const response = await request.post('/', searchPayload)
    expect(response.status).toBe(200)
  })
})
