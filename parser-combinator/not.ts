import { Context, isParseResult, Parser } from './parser.ts'

export const not = (parser: Parser<any>): Parser<string> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const result = parser(input, pos, ctx)
  if (isParseResult(result)) {
    return [false, null, pos]
  }
  return [true, input.slice(pos, pos + 1), pos + 1]
}
