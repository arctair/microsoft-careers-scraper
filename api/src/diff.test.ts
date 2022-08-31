import diff from './diff'

const { dummyJob, updatedDummyJob }: Record<string, StubJob> = {
  dummyJob: { jobId: 'dummy2', description: 'dummy2' },
  updatedDummyJob: { jobId: 'dummy2', description: 'updated' },
}

interface StubJob {
  jobId: string
  description: string
}

test('keep, subtract, add', () => {
  const actual = diff(dummyJob, updatedDummyJob)
  const expected =
    '  {\n    "jobId": "dummy2",\n-   "description": "dummy2"\n+   "description": "updated"\n  }'
  expect(actual).toStrictEqual(expected)
})
