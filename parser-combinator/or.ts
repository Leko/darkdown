import { Parser, ParseResult, ParseFailed } from './types.ts'

export const or = (...parsers: Parser<any>[]) => (
  input: string,
  pos: number
): ParseResult<any[]> | ParseFailed => {
  for (let parser of parsers) {
    const result = parser(input, pos)
    if (result[0]) {
      return result
    }
  }
  return [false, null, pos]
}
