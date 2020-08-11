import {
  dim,
  red,
  green,
  bold,
  underline,
} from 'https://deno.land/std/fmt/colors.ts'
import { Parser, ParseResult, ParseFailed, Context } from './types.ts'

export const tap = <T>(identifier: string, parser: Parser<T>) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): ParseResult<T> | ParseFailed => {
  if (!ctx.debug) {
    return parser(input, pos, ctx)
  }

  console.log(
    [identifier, `START: pos=${pos}`]
      .map(dim)
      .concat(
        (
          dim(input.slice(Math.max(0, pos - 10), pos)) +
          underline(bold(input.slice(pos, pos + 1))) +
          dim(input.slice(pos + 1, Math.min(input.length, pos + 10)))
        )
          .replaceAll('\n', '\\n')
          .replaceAll('\t', '\\t')
      )
      .join(' ')
  )
  console.group()
  const [parsed, result, newPos] = parser(input, pos, ctx)
  console.groupEnd()
  if (parsed) {
    console.log(
      [identifier, `SUCCESS: pos=${pos}->${newPos}`]
        .map(green)
        .concat(
          (
            dim(input.slice(Math.min(0, pos - 10), pos)) +
            underline(red(input.slice(pos, newPos))) +
            dim(input.slice(newPos, Math.min(input.length, newPos + 10)))
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
