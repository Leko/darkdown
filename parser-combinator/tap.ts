import { Parser, ParseResult, ParseFailed } from './types.ts'

export const tap = <T>(identifier: string, parser: Parser<T>) => (
  input: string,
  pos: number
): ParseResult<T> | ParseFailed => {
  console.group()
  const [parsed, result, newPos] = parser(input, pos)
  console.groupEnd()
  if (parsed) {
    console.log(
      identifier,
      `success. pos=${pos}->${newPos}`,
      JSON.stringify(input.slice(pos, newPos))
    )
    return [true, result!, newPos]
  } else {
    console.log(identifier, `failed. pos=${pos}.`, [input.slice(pos, pos + 1)])
    return [false, null, newPos]
  }
}
