import { Parser, ParseResult, ParseFailed, Context } from './types.ts'

export const matchOnly = (parser: Parser<any>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<null> | ParseFailed => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return [true, null, pos]
  }
  return [false, null, pos]
}
