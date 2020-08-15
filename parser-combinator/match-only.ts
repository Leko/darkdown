import { Parser, Parser, , Context } from './types.ts'

export const matchOnly = (parser: Parser<any>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): Parser<null> => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return [true, null, pos]
  }
  return [false, null, pos]
}
