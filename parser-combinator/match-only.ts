import { Parser, ParseResult, ParseFailed } from './types.ts'

export const matchOnly = (parser: Parser<any>) => (
  input: string,
  pos: number
): ParseResult<null> | ParseFailed => {
  const result = parser(input, pos)
  if (result[0]) {
    return [true, null, pos]
  }
  return [false, null, pos]
}
