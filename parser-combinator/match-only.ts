import { Context, Parser } from './types.ts'

export const matchOnly = (parser: Parser<any>): Parser<null> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return [true, null, pos]
  }
  return [false, null, pos]
}
