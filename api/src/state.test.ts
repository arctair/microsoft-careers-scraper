import { post, State } from './state'

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

test('new job', () => {
  const actual = post(
    { jobs: {} },
    { eagerLoadRefineSearch: { data: { jobs: [dummyJob1] } } },
  )
  const expected: State = { jobs: { [dummyJob1.jobId]: dummyJob1 } }
  expect(actual).toStrictEqual(expected)
})

test('preserve one job, overwrite one job, and add one job', () => {
  const actual = post(
    {
      jobs: { [dummyJob1.jobId]: dummyJob1, [dummyJob2.jobId]: dummyJob2 },
    },
    {
      eagerLoadRefineSearch: {
        data: { jobs: [updatedDummyJob2, dummyJob3] },
      },
    },
  )
  const expected: State = {
    jobs: {
      [dummyJob1.jobId]: dummyJob1,
      [updatedDummyJob2.jobId]: updatedDummyJob2,
      [dummyJob3.jobId]: dummyJob3,
    },
  }
  expect(actual).toStrictEqual(expected)
})
