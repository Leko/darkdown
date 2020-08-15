import { Parser, Parser, , Context } from './types.ts'

export const lazy = <T>(parserGenerator: () => Parser<T>) => {
  return (
    input: string,
    pos: number,
    ctx: Readonly<Context>
  ): Parser<T> => {
    const parser = parserGenerator()
    return parser(input, pos, ctx)
  }
}
