export function index(state: JobState, payload: SearchPayload): JobState {
  return {
    jobs: payload.eagerLoadRefineSearch.data.jobs.reduce(
      (jobs, cur) => Object.assign({}, jobs, { [cur.jobId]: cur }),
      state.jobs,
    ),
  }
}

export function bindUpdateHistory(diff: (j0: Job, j1: Job) => string) {
  return function updateHistory(
    history: JobHistory,
    previous: JobState,
    current: JobState,
  ): JobHistory {
    return {
      entries: Object.values(current.jobs).reduce((entries, job) => {
        return !(job.jobId in previous.jobs)
          ? entries.concat({ job, jobId: job.jobId, type: 'add' })
          : JSON.stringify(previous.jobs[job.jobId]) !==
            JSON.stringify(job)
          ? entries.concat({
              diff: diff(previous.jobs[job.jobId], job),
              job,
              jobId: job.jobId,
              type: 'update',
            })
          : entries
      }, history.entries),
    }
  }
}

export interface JobState {
  jobs: Record<string, Job>
}

export interface Job {
  jobId: string
}

export interface JobHistory {
  entries: HistoryEntry[]
}

type HistoryEntry =
  | {
      job: Job
      jobId: string
      type: 'add'
    }
  | {
      diff: string
      job: Job
      jobId: string
      type: 'update'
    }

export interface SearchPayload {
  eagerLoadRefineSearch: {
    data: {
      jobs: Job[]
    }
  }
}
