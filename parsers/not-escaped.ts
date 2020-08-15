import { Context, Parser } from '../parser-combinator.ts'
import { C_BACK_SLASH } from '../scanner.ts'

export const notEscaped = <T>(
  parser: Parser<T>,
  option?: { escapeSeq?: string }
): Parser<T> => {
  const escapeSeq = option?.escapeSeq ?? C_BACK_SLASH

  return (input: string, pos: number, ctx: Readonly<Context>) => {
    const result = parser(input, pos, ctx)
    if (result[0]) {
      if (typeof result[1] !== 'string') {
        throw new Error(
          `notEscaped must be returned string, but got ${typeof result[1]}`
        )
      }
      const endPos = result[2] - result[1].length
      const beforeChar = input.slice(endPos - escapeSeq.length, endPos)
      if (beforeChar !== escapeSeq) {
        return result
      }
    }
    return [false, null, pos]
  }
}
