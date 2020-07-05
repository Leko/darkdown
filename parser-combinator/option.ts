import { Parser, ParseResult, ParseFailed } from './types.ts'

export const option = <T>(parser: Parser<T>) => (
  input: string,
  pos: number
): ParseResult<T> | ParseResult<null> => {
  const result = parser(input, pos)
  if (result[0]) {
    return result
  }
  return [true, null, pos]
}
