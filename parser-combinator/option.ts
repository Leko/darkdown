import { Parser, ParseResult, Context } from './types.ts'

export const option = <T>(parser: Parser<T>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<T> | ParseResult<null> => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return result
  }
  return [true, null, pos]
}
