import axios from 'axios'

const target = process.env.TARGET || 'http://localhost:8080'

async function main() {
  let offset = 0
  let count
  do {
    console.error(`getting results at offset ${offset}`)
    const response = await retry(() => get(offset))
    const data = extractPayload(response.data)
    await axios.post(target, data, {
      headers: { 'Content-Type': 'application/json' },
    })

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

async function retry<T>(fn: () => Promise<T>) {
  for (let i = 0; ; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i < 8) {
        const wait = 250 * Math.pow(2, i)
        console.error(`retrying in ${wait}ms`)
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
