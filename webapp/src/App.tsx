import { useEffect, useState } from 'react'

export default function App() {
  const [state, setState] = useState<{ error?: string; jobs: any[] }>({
    jobs: [],
  })
  const [fields, setFieldState] = useState([
    'descriptionTeaser',
    'jobId',
    'applyUrl',
    'location',
  ])
  useEffect(() => {
    fetch(
      'https://microsoft-careers-scraper-api.cruftbusters.com/jobs',
    ).then(
      async (response) => {
        const { jobs } = await response.json()
        setState({ jobs })
      },
      (error: string) => setState((state) => ({ ...state, error })),
    )
  }, [])
  return (
    <>
      {state.error ? (
        <div>drats: ${state.error}</div>
      ) : (
        <>
          {state.jobs.length > 0 ? (
            <div style={{ padding: '0 1rem', boxSizing: 'border-box' }}>
              <div style={{ marginBottom: '1rem' }}>
                available fields:{' '}
                {Object.keys(state.jobs[0]).map((name) => (
                  <button
                    style={{
                      backgroundColor:
                        fields.indexOf(name) > -1 ? 'cyan' : 'inherit',
                    }}
                    onClick={() =>
                      setFieldState((fieldState) => {
                        if (fieldState.indexOf(name) > -1)
                          return fieldState.filter(
                            (_name) => _name !== name,
                          )
                        else return fieldState.concat(name)
                      })
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>
              {state.jobs.map((job) => (
                <div key={job.jobId}>
                  {job.title}
                  <br />
                  {Object.entries(job)
                    .filter(([key]) => fields.indexOf(key) > -1)
                    .map(([key, value]: [string, any], index) => (
                      <Indent key={index}>
                        {key}
                        <Indent>
                          <span
                            style={{}}
                            dangerouslySetInnerHTML={{ __html: value }}
                          />
                        </Indent>
                      </Indent>
                    ))}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

function Indent({ children }: React.PropsWithChildren) {
  return (
    <div style={{ paddingLeft: '1rem' }}>
      <span style={{ marginLeft: '-0.75rem' }}> &#8735;</span>
      {children}
    </div>
  )
}
