import { newTouchmaster } from './touchmaster'
import { StateV2 } from './types'

const engineGet = jest.fn()
const touchmaster = newTouchmaster(engineGet)

describe('touchmaster', () => {
  test('proxy state', async () => {
    const expected: StateV2 = {
      buckets: {
        wasd: {
          latest: { jobId: 'wasd' },
        },
      },
      offset: 0,
      touches: ['wasd'],
    }

    engineGet.mockResolvedValueOnce(expected)
    const actual = await touchmaster({ count: 1 })
    expect(actual).toStrictEqual(expected)
  })
  test('truncate old touches', async () => {
    const state: StateV2 = {
      buckets: {
        '0': {
          latest: { jobId: '0' },
        },
        '1': {
          latest: { jobId: '1' },
        },
        '2': {
          latest: { jobId: '2' },
        },
      },
      offset: 0,
      touches: ['0', '1', '2'],
    }

    engineGet.mockResolvedValueOnce(state)
    const actual = await touchmaster({ count: 2 })
    const expected: StateV2 = {
      buckets: {
        '1': {
          latest: { jobId: '1' },
        },
        '2': {
          latest: { jobId: '2' },
        },
      },
      offset: 1,
      touches: ['1', '2'],
    }
    expect(actual).toStrictEqual(expected)
  })
})
