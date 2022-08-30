import { Database } from 'sqlite3'
import { initialize, load, save } from './sqlite'
import { JobHistory, JobState } from './state'

describe('save and load', () => {
  test('first load', async () => {
    const database = new Database(':memory:')
    await initialize(database)

    const actual = await load(database)
    const expected: { history: JobHistory; state: JobState } = {
      history: { entries: [] },
      state: { jobs: {} },
    }
    expect(actual).toStrictEqual(expected)
  })
  test('load add', async () => {
    const database = new Database(':memory:')
    await initialize(database)

    const job = { jobId: 'the job id' }

    await save(database, { entries: [{ type: 'add', job }] })

    const actual = await load(database)
    const expected: { history: JobHistory; state: JobState } = {
      history: { entries: [{ type: 'add', job }] },
      state: { jobs: { [job.jobId]: job } },
    }
    expect(actual).toStrictEqual(expected)
  })
})
