import { Parser, ParseResult, ParseFailed } from './types.ts'

export const seq = (...parsers: Parser<any>[]) => (
  input: string,
  pos: number
): ParseResult<any[]> | ParseFailed => {
  const results = []
  let newPos = pos
  for (let parser of parsers) {
    const result = parser(input, newPos)
    if (!result[0]) {
      return [false, null, pos]
    }
    newPos = result[2]
    results.push(result[1])
  }
  return [true, results, newPos]
}
