import { Parser, ParseResult, ParseFailed, Context } from './types.ts'

export const not = (parser: Parser<any>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<string> | ParseFailed => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return [false, null, pos]
  }
  return [true, input.slice(pos, pos + 1), pos + 1]
}
