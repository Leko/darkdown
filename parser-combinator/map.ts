import { Context, Parser } from './types.ts'

export const map = <T, P>(
  parser: Parser<T>,
  mapper: (
    result: T,
    newPos: number,
    oldPos: number,
    input: string,
    ctx: Readonly<Context>
  ) => P
): Parser<P> => (input: string, pos: number, ctx: Readonly<Context>) => {
  const result = parser(input, pos, ctx)
  if (result[0]) {
    return [true, mapper(result[1], result[2], pos, input, ctx), result[2]]
  }
  return result
}
