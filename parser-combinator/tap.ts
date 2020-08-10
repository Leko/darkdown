import {
  dim,
  red,
  green,
  bold,
  underline,
} from 'https://deno.land/std/fmt/colors.ts'
import { Parser, ParseResult, ParseFailed } from './types.ts'

export const tap = <T>(identifier: string, parser: Parser<T>) => (
  input: string,
  pos: number
): ParseResult<T> | ParseFailed => {
  // return parser(input, pos)

  console.log(
    [identifier, `START: pos=${pos}`]
      .map(dim)
      .concat(
        (
          dim(input.slice(0, pos)) +
          underline(bold(input.slice(pos, pos + 1))) +
          dim(input.slice(pos + 1))
        )
          .replaceAll('\n', '\\n')
          .replaceAll('\t', '\\t')
      )
      .join(' ')
  )
  console.group()
  const [parsed, result, newPos] = parser(input, pos)
  console.groupEnd()
  if (parsed) {
    console.log(
      [identifier, `SUCCESS: pos=${pos}->${newPos}`]
        .map(green)
        .concat(
          (
            dim(input.slice(0, pos)) +
            underline(red(input.slice(pos, newPos))) +
            dim(input.slice(newPos))
          )
            .replaceAll('\n', '\\n')
            .replaceAll('\t', '\\t')
        )
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
