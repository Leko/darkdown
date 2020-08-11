import { Parser, ParseResult, ParseFailed, Context } from './types.ts'

export const seq = (...parsers: Parser<any>[]) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<any[]> | ParseFailed => {
  const results = []
  let newPos = pos
  for (let parser of parsers) {
    const result = parser(input, newPos, ctx)
    if (!result[0]) {
      return [false, null, pos]
    }
    newPos = result[2]
    results.push(result[1])
  }
  return [true, results, newPos]
}
