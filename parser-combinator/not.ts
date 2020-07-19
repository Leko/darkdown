import { Parser, ParseResult, ParseFailed } from './types.ts'

export const not = (parser: Parser<any>) => (
  input: string,
  pos: number
): ParseResult<string> | ParseFailed => {
  const result = parser(input, pos)
  if (result[0]) {
    return [false, null, pos]
  }
  return [true, input.slice(pos, pos + 1), pos + 1]
}
