import { Parser, ParseResult, ParseFailed } from './types.ts'
import { many } from './many.ts'

export const between = <T>(parser: Parser<T>, min: number, max: number) => {
  const wrappedParser = many(parser)
  return (input: string, pos: number): ParseResult<T[]> | ParseFailed => {
    const result = wrappedParser(input, pos)
    if (result[0] && min <= result[1].length && result[1].length <= max) {
      return [true, result[1], result[2]]
    }
    return [false, null, pos]
  }
}
