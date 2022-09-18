import { newEngine } from './engine'
import { StateV2 } from './types'

describe('engine', () => {
  test('get default state', async () => {
    const engine = newEngine()
    const actual = await engine.get()
    const expected: StateV2 = {
      buckets: {},
      touches: [],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('add job', async () => {
    const engine = newEngine()
    const job = { jobId: 'new job' }
    await engine.post([job])
    const actual = await engine.get()
    const expected: StateV2 = {
      buckets: {
        'new job': {
          latest: job,
        },
      },
      touches: ['new job'],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('add duplicate job results in no touch', async () => {
    const engine = newEngine()
    const job = { jobId: 'new job' }
    await engine.post([job])
    await engine.post([job])
    const actual = await engine.get()
    const expected: StateV2 = {
      buckets: {
        'new job': {
          latest: job,
        },
      },
      touches: ['new job'],
    }
    expect(actual).toStrictEqual(expected)
  })
})
