import { Context, isParseResult, Parser, ParseResult } from './parser.ts'

export const option = <T>(parser: Parser<T>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<T> | ParseResult<null> => {
  const result = parser(input, pos, ctx)
  if (isParseResult(result)) {
    return result
  }
  return [true, null, pos]
}
