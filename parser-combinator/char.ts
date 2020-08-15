import { Parser } from './parser.ts'

// FIXME: string to union type per character
export const char = (chars: string): Parser<string> => (
  input: string,
  pos: number
) => {
  const c = input.slice(pos, pos + 1)
  if (c.length === 0 || chars.indexOf(c) === -1) {
    return [false, null, pos]
  }
  return [true, c, pos + 1]
}
