import { diffLines } from 'diff'
import { Job } from './state'

export default function diff(j0: Job, j1: Job): string {
  return diffLines(
    JSON.stringify(j0, null, 2),
    JSON.stringify(j1, null, 2),
  )
    .map((change) =>
      change.added
        ? prefixLines(change.value, '+')
        : change.removed
        ? prefixLines(change.value, '-')
        : prefixLines(change.value, ' '),
    )
    .join('')
}

function prefixLines(value: string, prefix: string) {
  return value
    .split('\n')
    .map((line) => (line.length > 0 ? `${prefix} ${line}` : ''))
    .join('\n')
}
