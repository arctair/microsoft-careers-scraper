import axios from 'axios'

const target = process.env.TARGET || 'http://localhost:8080'

async function main(
  offset = process.env.OFFSET ? parseInt(process.env.OFFSET) : 0,
) {
  let count
  do {
    let start: number, then: number, now: number
    start = then = now = new Date().getTime()
    process.stdout.write(`offset ${offset} download duration: `)
    const response = await retry(
      () => get(offset),
      (wait) => {
        then = now
        now = new Date().getTime()
        process.stdout.write(`${now - then}\n`)
        process.stdout.write(`offset ${offset} download retry duration: `)
      },
    )

    then = now
    now = new Date().getTime()
    process.stdout.write(`${now - then}\n`)
    process.stdout.write(`offset ${offset} upload duration: `)

    const data = extractPayload(response.data)
    await retry(
      () => pump(data),
      (wait) => {
        then = now
        now = new Date().getTime()
        process.stdout.write(`${now - then}\n`)
        process.stdout.write(`offset ${offset} upload retry duration: `)
      },
    )

    then = now
    now = new Date().getTime()
    process.stdout.write(`${now - then}\n`)
    process.stdout.write(
      `offset ${offset} total duration: ${now - start}\n`,
    )

    count = JSON.parse(data).eagerLoadRefineSearch.data.jobs.length
    offset += count
  } while (count > 0)
}

function get(offset: number) {
  return axios.get(
    'https://careers.microsoft.com/professionals/us/en/search-results',
    {
      params: new URLSearchParams({
        from: offset.toString(),
        s: '1',
      }),
    },
  )
}

function pump(data: string) {
  return axios.post(target, data, {
    headers: { 'Content-Type': 'application/json' },
  })
}

async function retry<T>(
  fn: () => Promise<T>,
  onRetry: (waitMilleseconds: number) => void,
) {
  for (let i = 0; ; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i < 8) {
        const wait = 250 * Math.pow(2, i)
        onRetry(wait)
        await new Promise((resolve) => setTimeout(resolve, wait))
        continue
      } else throw e
    }
  }
}

function extractPayload(data: string) {
  const startMarker = 'phApp.ddo = '
  const endMarker = '; phApp.sessionParams'
  let line = data
    .split('\n')
    .find((line: string) => line.indexOf(startMarker) > -1)
  if (!line) throw Error('Could not find payload start marker')
  line = line.split(startMarker)[1]
  line = line.split(endMarker)[0]
  return line
}

main()
