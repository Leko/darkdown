import { Context, isParseResult, Parser, ParseResult } from './parser.ts'

export const filter = <T>(
  parser: Parser<T>,
  predicator: (result: ParseResult<T>, input: string) => boolean
): Parser<T> => (input: string, pos: number, ctx: Readonly<Context>) => {
  const result = parser(input, pos, ctx)
  if (isParseResult(result) && predicator(result, input)) {
    return result
  }
  return [false, null, pos]
}
