import { many } from './many.ts'
import { Context, Parser } from './types.ts'

export const between = <T>(
  parser: Parser<T>,
  min: number,
  max: number
): Parser<T[]> => {
  const wrappedParser = many(parser)
  return (input: string, pos: number, ctx: Readonly<Context>) => {
    const result = wrappedParser(input, pos, ctx)
    if (result[0] && min <= result[1].length && result[1].length <= max) {
      return [true, result[1], result[2]]
    }
    return [false, null, pos]
  }
}
