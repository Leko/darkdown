import { Parser, Parser, , Context } from './types.ts'

export const not = (parser: Parser<any>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): Parser<string> => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return [false, null, pos]
  }
  return [true, input.slice(pos, pos + 1), pos + 1]
}
