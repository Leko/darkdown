import { Parser, ParseResult, ParseFailed } from './types.ts'

export const map = <T, P>(
  parser: Parser<T>,
  mapper: (result: T, newPos: number, oldPos: number) => P
) => (input: string, pos: number): ParseResult<P> | ParseFailed => {
  const result = parser(input, pos)
  if (result[0]) {
    return [true, mapper(result[1], result[2], pos), result[2]]
  }
  return result
}
