import { C_BACK_SLASH } from '../scanner.ts'
import { Parser, ParseResult, ParseFailed } from '../parser-combinator.ts'

export const notEscaped = <T>(
  parser: Parser<T>,
  option?: { escapeSeq?: string }
) => {
  const escapeSeq = option?.escapeSeq ?? C_BACK_SLASH

  return (input: string, pos: number): ParseResult<T> | ParseFailed => {
    const result = parser(input, pos)
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
