import { Parser, ParseResult, ParseFailed } from './types.ts'
import { many } from './many.ts'

export const atLeast = <T>(parser: Parser<T>, threshold: number) => {
  const wrappedParser = many(parser)
  return (input: string, pos: number): ParseResult<T[]> | ParseFailed => {
    const result = wrappedParser(input, pos)
    if (result[0] && result[1].length >= threshold) {
      return [true, result[1], result[2]]
    }
    return [false, null, pos]
  }
}
