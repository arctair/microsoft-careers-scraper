import { index, JobHistory, JobState, updateHistory } from './state'

const {
  dummyJob1,
  dummyJob2,
  updatedDummyJob2,
  dummyJob3,
}: Record<string, StubJob> = {
  dummyJob1: { jobId: 'dummy1', description: 'dummy1' },
  dummyJob2: { jobId: 'dummy2', description: 'dummy2' },
  updatedDummyJob2: { jobId: 'dummy2', description: 'updated' },
  dummyJob3: { jobId: 'dummy3', description: 'dummy3' },
}

interface StubJob {
  jobId: string
  description: string
}

describe('index', () => {
  test('new job', () => {
    const actual = index(
      { jobs: {} },
      { eagerLoadRefineSearch: { data: { jobs: [dummyJob1] } } },
    )
    const expected: JobState = { jobs: { [dummyJob1.jobId]: dummyJob1 } }
    expect(actual).toStrictEqual(expected)
  })

  test('preserve one job, overwrite one job, and add one job', () => {
    const actual = index(
      {
        jobs: {
          [dummyJob1.jobId]: dummyJob1,
          [dummyJob2.jobId]: dummyJob2,
        },
      },
      {
        eagerLoadRefineSearch: {
          data: { jobs: [updatedDummyJob2, dummyJob3] },
        },
      },
    )
    const expected: JobState = {
      jobs: {
        [dummyJob1.jobId]: dummyJob1,
        [updatedDummyJob2.jobId]: updatedDummyJob2,
        [dummyJob3.jobId]: dummyJob3,
      },
    }
    expect(actual).toStrictEqual(expected)
  })
})

describe('update history', () => {
  test('add new to empty', () => {
    const actual = updateHistory(
      { entries: [] },
      { jobs: {} },
      { jobs: { [dummyJob1.jobId]: dummyJob1 } },
    )
    const expected: JobHistory = {
      entries: [{ job: dummyJob1, jobId: dummyJob1.jobId, type: 'add' }],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('update existing', () => {
    const actual = updateHistory(
      {
        entries: [{ job: dummyJob2, jobId: dummyJob2.jobId, type: 'add' }],
      },
      { jobs: { [dummyJob2.jobId]: dummyJob2 } },
      {
        jobs: {
          [updatedDummyJob2.jobId]: updatedDummyJob2,
        },
      },
    )
    const expected: JobHistory = {
      entries: [
        { job: dummyJob2, jobId: dummyJob2.jobId, type: 'add' },
        {
          job: updatedDummyJob2,
          jobId: updatedDummyJob2.jobId,
          type: 'update',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('no change to existing', () => {
    const actual = updateHistory(
      {
        entries: [{ job: dummyJob2, jobId: dummyJob2.jobId, type: 'add' }],
      },
      { jobs: { [dummyJob2.jobId]: dummyJob2 } },
      {
        jobs: {
          [dummyJob2.jobId]: dummyJob2,
        },
      },
    )
    const expected: JobHistory = {
      entries: [{ job: dummyJob2, jobId: dummyJob2.jobId, type: 'add' }],
    }
    expect(actual).toStrictEqual(expected)
  })
})
