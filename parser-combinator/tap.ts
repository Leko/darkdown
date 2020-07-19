import { dim, red, green } from 'https://deno.land/std/fmt/colors.ts'
import { Parser, ParseResult, ParseFailed } from './types.ts'

export const tap = <T>(identifier: string, parser: Parser<T>) => (
  input: string,
  pos: number
): ParseResult<T> | ParseFailed => {
  // return parser(input, pos)

  console.log(
    [identifier, `START: pos=${pos}`, JSON.stringify(input.slice(pos, pos + 1))]
      .map(dim)
      .join(' ')
  )
  console.group()
  const [parsed, result, newPos] = parser(input, pos)
  console.groupEnd()
  if (parsed) {
    console.log(
      [
        identifier,
        `SUCCESS: pos=${pos}->${newPos}`,
        JSON.stringify(input.slice(pos, newPos)),
      ]
        .map(green)
        .join(' ')
    )
    return [true, result!, newPos]
  } else {
    console.log(
      identifier,
      `FAILED: pos=${pos}.`,
      JSON.stringify(input.slice(pos, pos + 1)),
      `length=${input.length}`
    )
    return [false, null, newPos]
  }
}
