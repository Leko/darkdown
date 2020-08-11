import { Parser, ParseResult, ParseFailed, Context } from './types.ts'

export const lazy = <T>(parserGenerator: () => Parser<T>) => {
  return (
    input: string,
    pos: number,
    ctx: Readonly<Context>
  ): ParseResult<T> | ParseFailed => {
    const parser = parserGenerator()
    return parser(input, pos, ctx)
  }
}
