import { useContext } from 'react'
import { context, Provider } from './StateV2'

export default function App() {
  return (
    <Provider>
      <JobList />
    </Provider>
  )
}

function JobList() {
  const { touches } = useContext(context)
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
      {touches.map((jobId, index) => (
        <Job key={index} jobId={jobId} />
      ))}
    </div>
  )
}

type JobProps = { jobId: string }
function Job({ jobId }: JobProps) {
  const { buckets } = useContext(context)
  const { latest } = buckets[jobId]
  return (
    <div>
      {latest.title}
      <span style={{ display: 'none' }}>{JSON.stringify(latest)}</span>
    </div>
  )
}
