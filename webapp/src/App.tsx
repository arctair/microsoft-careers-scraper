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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: '0 1rem',
      }}
    >
      {touches.map((jobId, index) => (
        <div key={index} style={{ margin: '1rem 0' }}>
          <Job jobId={jobId} />
        </div>
      ))}
    </div>
  )
}

type JobProps = { jobId: string }
function Job({ jobId }: JobProps) {
  const { buckets } = useContext(context)
  const { latest } = buckets[jobId]
  return (
    <>
      <h3>{latest.title}</h3>
      {latest.descriptionTeaser}
      <span style={{ display: 'none' }}>{JSON.stringify(latest)}</span>
    </>
  )
}
