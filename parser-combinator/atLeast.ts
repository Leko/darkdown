import { many } from './many.ts'
import { AtLeast, Context, isParseResult, Parser } from './parser.ts'

export const atLeast = <T, N extends number>(
  parser: Parser<T>,
  threshold: N
): Parser<AtLeast<N, T>> => {
  const wrappedParser = many(parser)
  return (input: string, pos: number, ctx: Readonly<Context>) => {
    const result = wrappedParser(input, pos, ctx)
    if (isParseResult(result) && result[1].length >= threshold) {
      return [
        true,
        // @ts-expect-error Type instantiation is excessively deep and possibly infinite.
        result[1] as AtLeast<N, T>,
        result[2],
      ]
    }
    return [false, null, pos]
  }
}
