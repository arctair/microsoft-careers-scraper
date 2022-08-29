import axios from 'axios'

async function main() {
  const response = await get()
  const payload = extractPayload(response.data)
  process.stdout.write(JSON.stringify(payload))
}

function get() {
  return axios.get('https://careers.microsoft.com/us/en/search-results', {
    params: new URLSearchParams({
      from: '20',
      s: '1',
    }),
  })
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
  return JSON.parse(line)
}

main()
