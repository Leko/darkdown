import {
  Context,
  ParseFailed,
  Parser,
  ParseResult,
  VariadicArgumentsParser,
} from './types.ts'

export const or: VariadicArgumentsParser = (...parsers: Parser<any>[]) => (
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
