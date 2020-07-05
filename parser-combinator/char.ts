import { ParseResult, ParseFailed } from './types.ts'

export const char = (chars: string) => (
  input: string,
  pos: number
): ParseResult<string> | ParseFailed => {
  const c = input.slice(pos, pos + 1)
  if (c.length === 0 || chars.indexOf(c) === -1) {
    return [false, null, pos]
  }
  return [true, c, pos + 1]
}
