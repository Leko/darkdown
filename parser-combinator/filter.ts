import { Parser, ParseResult, ParseFailed } from './types.ts'

export const filter = <T>(
  parser: Parser<T>,
  predicator: (result: ParseResult<T>, input: string) => boolean
) => (input: string, pos: number): ParseResult<T> | ParseFailed => {
  const result = parser(input, pos)
  if (result[0] && predicator(result, input)) {
    return result
  }
  return [false, null, pos]
}
