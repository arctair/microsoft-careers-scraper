import { Database } from 'sqlite3'
import { migrate, newEngine } from './engine'
import { StateV2 } from './types'

describe('engine', () => {
  const database = new Database(':memory:')
  beforeAll(() => migrate(database))

  test('get default state', async () => {
    const actual = await (await newEngine(database)).get()
    const expected: StateV2 = {
      buckets: {},
      offset: 0,
      touches: [],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('add job', async () => {
    const job = { jobId: 'new job', location: '' }
    await (await newEngine(database)).post([job])
    const actual = await (await newEngine(database)).get()
    const expected: StateV2 = {
      buckets: {
        'new job': {
          latest: job,
        },
      },
      offset: 0,
      touches: ['new job'],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('add duplicate job results in no touch', async () => {
    const job = { jobId: 'new job', location: '' }
    await (await newEngine(database)).post([job])
    await (await newEngine(database)).post([job])
    const actual = await (await newEngine(database)).get()
    const expected: StateV2 = {
      buckets: {
        'new job': {
          latest: job,
        },
      },
      offset: 0,
      touches: ['new job'],
    }
    expect(actual).toStrictEqual(expected)
  })
})
