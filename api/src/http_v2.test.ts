import { request, setTestApp } from 'axios-test-instance'
import http from './http_v2'
import { SearchPayload } from './state'
import { StateV2 } from './types'

const engine = {
  get: jest.fn(),
  post: jest.fn(),
}

beforeAll(() => setTestApp(http(engine)))

describe('http v2', () => {
  test('get / returns engine state', async () => {
    const state = {
      buckets: {},
      touches: ['1'],
    }
    engine.get.mockResolvedValueOnce(state)
    const response = await request.get('/')
    expect(response.status).toBe(200)
    expect(response.data).toStrictEqual<StateV2>(state)
  })
  test('get / returns error', async () => {
    engine.get.mockRejectedValueOnce(new Error('another message'))
    const response = await request.get('/')
    expect(response.status).toBe(500)
    expect(response.data).toStrictEqual({ message: 'another message' })
  })
  test('post / with search payload proxies jobs to engine', async () => {
    engine.post.mockReturnValueOnce(Promise.resolve())

    const jobs = [{ jobId: 'the job!!!!!!' }]
    const searchPayload: SearchPayload = {
      eagerLoadRefineSearch: { data: { jobs } },
    }
    const response = await request.post('/', searchPayload, {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(response.status).toBe(200)
  })
  test('post / proxies back error', async () => {
    engine.post.mockRejectedValueOnce(new Error('the message'))
    const response = await request.post(
      '/',
      { eagerLoadRefineSearch: { data: { jobs: [] } } },
      { headers: { 'Content-Type': 'application/json' } },
    )
    expect(response.status).toBe(500)
    expect(response.data).toStrictEqual({ message: 'the message' })
  })
})
