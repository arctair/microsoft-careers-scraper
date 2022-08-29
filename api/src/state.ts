export function index(state: JobState, payload: SearchPayload): JobState {
  return {
    jobs: payload.eagerLoadRefineSearch.data.jobs.reduce(
      (jobs, cur) => Object.assign({}, jobs, { [cur.jobId]: cur }),
      state.jobs,
    ),
  }
}

export function updateHistory(
  history: JobHistory,
  previous: JobState,
  current: JobState,
): JobHistory {
  return {
    entries: Object.values(current.jobs).reduce(
      (entries, job) =>
        !(job.jobId in previous.jobs)
          ? entries.concat({ type: 'add', job })
          : JSON.stringify(previous.jobs[job.jobId]) !==
            JSON.stringify(job)
          ? entries.concat({ type: 'update', job })
          : entries,
      history.entries,
    ),
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

interface HistoryEntry {
  type: 'add' | 'update'
  job: Job
}

export interface SearchPayload {
  eagerLoadRefineSearch: {
    data: {
      jobs: Job[]
    }
  }
}
