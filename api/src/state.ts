export function reindex(
  state: JobsById,
  payload: SearchPayload,
): JobsById {
  const jobs = payload.eagerLoadRefineSearch.data.jobs.reduce(
    (jobs, cur) => Object.assign({}, jobs, { [cur.jobId]: cur }),
    state.jobs,
  )
  const count = Object.keys(jobs).length
  return { count, jobs }
}

export function bindUpdateHistory(diff: (j0: Job, j1: Job) => string) {
  return function updateHistory(
    history: JobHistory,
    previous: JobsById,
    current: JobsById,
  ): JobHistory {
    return {
      entries: Object.values(current.jobs).reduce((entries, job) => {
        return !(job.jobId in previous.jobs)
          ? entries.concat({ job, jobId: job.jobId, type: 'add' })
          : JSON.stringify(previous.jobs[job.jobId]) !==
            JSON.stringify(job)
          ? entries.concat({
              diff: diff(previous.jobs[job.jobId], job),
              jobId: job.jobId,
              type: 'update',
            })
          : entries
      }, history.entries),
    }
  }
}

export interface JobsById {
  count: number
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
