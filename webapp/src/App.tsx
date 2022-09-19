import React, { useContext, useState } from 'react'
import { context, Provider } from './StateV2'

export default function App() {
  return (
    <Provider>
      <JobList />
    </Provider>
  )
}

function JobList() {
  const {
    filter,
    setFilter,
    state: { touches },
  } = useContext(context)
  return (
    <>
      <div
        style={{
          backgroundColor: '#DDD',
          padding: '0.5rem',
        }}
      >
        <h1 style={{ marginBottom: '0.5rem' }}>
          microsoft careers scraper
        </h1>
        search by location:{' '}
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          margin: '0.25rem',
        }}
      >
        {touches.map((jobId, index) => (
          <div
            key={index}
            style={{
              padding: '0.5rem',
              margin: '0.25rem',
              border: '1px solid gray',
            }}
          >
            <Job jobId={jobId} />
          </div>
        ))}
      </div>
    </>
  )
}

type JobProps = { jobId: string }
function Job({ jobId }: JobProps) {
  const {
    state: { buckets },
  } = useContext(context)
  const { latest } = buckets[jobId]
  return (
    <>
      <h3>{latest.title}</h3>
      <h4>{latest.location}</h4>
      <ShowHide
        content={latest.descriptionTeaser}
        display="block"
        label="teaser"
      />
      <ShowHide content={latest.jobSummary} label="job summary" />
      <ShowHide content={latest.description} label="description" />
      <ShowHide
        content={latest.jobResponsibilities}
        label="job responsibilities"
      />
      <ShowHide
        content={latest.jobQualifications}
        label="job qualifications"
      />
      <span style={{ display: 'none' }}>{JSON.stringify(latest)}</span>
    </>
  )
}

type ShowHideProps = {
  content: string
  display?: 'none' | 'block'
  label: string
}
function ShowHide({
  content,
  display: defaultDisplay = 'none',
  label,
}: ShowHideProps) {
  const [display, setDisplay] = useState(defaultDisplay)
  return (
    <>
      <button
        onClick={() =>
          setDisplay((display) => (display === 'none' ? 'block' : 'none'))
        }
        style={{
          color: display === 'none' ? 'gray' : 'black',
          border: 'none',
          marginRight: '0.5rem',
        }}
      >
        {label}
      </button>
      <div
        style={{
          display,
          borderTop: '1px solid gray',
          borderBottom: '1px solid gray',
          margin: '0.5rem -0.5rem',
          padding: '0.5rem',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  )
}
