import { Context, Parser, ParseResult } from './types.ts'

export const filter = <T>(
  parser: Parser<T>,
  predicator: (result: ParseResult<T>, input: string) => boolean
): Parser<T> => (input: string, pos: number, ctx: Readonly<Context>) => {
  const result = parser(input, pos, ctx)
  if (result[0] && predicator(result, input)) {
    return result
  }
  return [false, null, pos]
}
