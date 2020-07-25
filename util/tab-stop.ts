import { C_TAB, C_SPACE } from '../scanner.ts'

const STOP = 4

export function convertTabToSpaces(str: string): string {
  let spaces = ''
  let cursor = 0
  while (1) {
    const idx = str.indexOf(C_TAB, cursor)
    if (idx === -1) {
      spaces += str.slice(cursor)
      break
    }
    spaces += str.slice(cursor, idx)
    const mod = idx % STOP
    spaces += C_SPACE.repeat(mod === 0 ? STOP : mod)
    cursor = idx + 1
  }
  return spaces
}
