import { char, Context, Parser } from '../parser-combinator.ts'
import { C_NEWLINE } from '../scanner.ts'

// Start of line
export const SOL = (): Parser<null> => {
  const parser = char(C_NEWLINE)
  return (input: string, pos: number, ctx: Context) => {
    const result = parser(input, pos - C_NEWLINE.length, ctx)
    if (pos === 0 || result[0]) {
      return [true, null, pos]
    }
    return [false, null, pos]
  }
}
