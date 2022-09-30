import diff from './diff'

const { dummyJob, updatedDummyJob }: Record<string, StubJob> = {
  dummyJob: { description: 'dummy2', jobId: 'dummy2', location: '' },
  updatedDummyJob: {
    description: 'updated',
    jobId: 'dummy2',
    location: '',
  },
}

interface StubJob {
  jobId: string
  location: string
  description: string
}

test('keep, subtract, add', () => {
  const actual = diff(dummyJob, updatedDummyJob)
  const expected =
    '  {\n-   "description": "dummy2",\n+   "description": "updated",\n    "jobId": "dummy2",\n    "location": ""\n  }'
  expect(actual).toStrictEqual(expected)
})
