import { newTouchmaster } from './touchmaster'
import { StateV2 } from './types'

const engineGet = jest.fn()
const touchmaster = newTouchmaster(engineGet)

describe('touchmaster', () => {
  test('proxy state', async () => {
    const expected: StateV2 = {
      buckets: {
        wasd: {
          latest: { jobId: 'wasd', location: '' },
        },
      },
      offset: 0,
      touches: ['wasd'],
    }

    engineGet.mockResolvedValueOnce(expected)
    const actual = await touchmaster({ count: 1, filter: '' })
    expect(actual).toStrictEqual(expected)
  })
  test('truncate old touches', async () => {
    const state: StateV2 = {
      buckets: {
        '0': {
          latest: { jobId: '0', location: '' },
        },
        '1': {
          latest: { jobId: '1', location: '' },
        },
        '2': {
          latest: { jobId: '2', location: '' },
        },
      },
      offset: 0,
      touches: ['0', '1', '2'],
    }

    engineGet.mockResolvedValueOnce(state)
    const actual = await touchmaster({ count: 2, filter: '' })
    const expected: StateV2 = {
      buckets: {
        '1': {
          latest: { jobId: '1', location: '' },
        },
        '2': {
          latest: { jobId: '2', location: '' },
        },
      },
      offset: 1,
      touches: ['1', '2'],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('ask for more than present', async () => {
    const state: StateV2 = {
      buckets: {},
      offset: 0,
      touches: [],
    }

    engineGet.mockResolvedValueOnce(state)
    const actual = await touchmaster({ count: 1, filter: '' })
    const expected: StateV2 = {
      buckets: {},
      offset: 0,
      touches: [],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('filter', async () => {
    const state: StateV2 = {
      buckets: {
        '0': {
          latest: { jobId: '0', location: 'Washington DC' },
        },
        '1': {
          latest: { jobId: '1', location: '' },
        },
        '2': {
          latest: { jobId: '2', location: '' },
        },
      },
      offset: 0,
      touches: ['0', '1', '2'],
    }

    engineGet.mockResolvedValueOnce(state)
    const actual = await touchmaster({ count: 2, filter: 'washington' })
    const expected: StateV2 = {
      buckets: {
        '0': {
          latest: { jobId: '0', location: 'Washington DC' },
        },
      },
      offset: 0,
      touches: ['0'],
    }
    expect(actual).toStrictEqual(expected)
  })
})
