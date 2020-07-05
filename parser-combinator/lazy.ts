import { Parser, ParseResult, ParseFailed } from './types.ts'

export const lazy = <T>(parserGenerator: () => Parser<T>) => {
  return (input: string, pos: number): ParseResult<T> | ParseFailed => {
    const parser = parserGenerator()
    return parser(input, pos)
  }
}
