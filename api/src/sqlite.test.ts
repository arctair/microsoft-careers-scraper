import { Database } from 'sqlite3'
import { initialize, load, save } from './sqlite'
import { JobHistory, JobsById } from './state'

interface LoadContainer {
  history: JobHistory
  index: JobsById
}

describe('save and load', () => {
  test('first load', async () => {
    const database = new Database(':memory:')
    await initialize(database)

    const actual = await load(database)
    const expected: LoadContainer = {
      history: { entries: [] },
      index: { count: 0, jobs: {} },
    }
    expect(actual).toStrictEqual(expected)
  })
  test('load add', async () => {
    const database = new Database(':memory:')
    await initialize(database)

    const job = { jobId: 'the job id' }

    await save(
      database,
      { entries: [{ job, jobId: job.jobId, type: 'add' }] },
      { count: 1, jobs: { [job.jobId]: job } },
    )

    const actual = await load(database)
    const expected: LoadContainer = {
      history: { entries: [{ job, jobId: job.jobId, type: 'add' }] },
      index: { count: 1, jobs: { [job.jobId]: job } },
    }
    expect(actual).toStrictEqual(expected)
  })
})
