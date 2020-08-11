import { Parser, ParseResult, ParseFailed, Context } from './types.ts'

export const or = (...parsers: Parser<any>[]) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<any[]> | ParseFailed => {
  for (let parser of parsers) {
    const result = parser(input, pos, ctx)
    if (result[0]) {
      return result
    }
  }
  return [false, null, pos]
}
