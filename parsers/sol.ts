import { C_NEWLINE } from '../scanner.ts'
import { char, Parser,  } from '../parser-combinator.ts'

// Start of line
export const SOL = () => {
  const parser = char(C_NEWLINE)
  return (input: string, pos: number): Parser<null> => {
    const result = parser(input, pos - C_NEWLINE.length)
    if (pos === 0 || result[0]) {
      return [true, null, pos]
    }
    return [false, null, pos]
  }
}
