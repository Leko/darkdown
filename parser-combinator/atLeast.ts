import { many } from './many.ts'
import { Context, isParseResult, Parser } from './parser.ts'

export const atLeast = <T>(
  parser: Parser<T>,
  threshold: number
): Parser<T[]> => {
  const wrappedParser = many(parser)
  return (input: string, pos: number, ctx: Readonly<Context>) => {
    const result = wrappedParser(input, pos, ctx)
    if (isParseResult(result) && result[1].length >= threshold) {
      return [true, result[1], result[2]]
    }
    return [false, null, pos]
  }
}
