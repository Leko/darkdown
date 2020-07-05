export function occurence(target: string, subStr: string): number {
  let count = 0
  let cursor = 0
  while (1) {
    cursor = target.indexOf(subStr, cursor)
    if (cursor === -1) {
      break
    }
    count++
    cursor++
  }

  return count
}
