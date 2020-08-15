import { Context, isParseResult, Parser } from './parser.ts'

export const matchOnly = (parser: Parser<any>): Parser<null> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const result = parser(input, pos, ctx)
  if (isParseResult(result)) {
    return [true, null, pos]
  }
  return [false, null, pos]
}
