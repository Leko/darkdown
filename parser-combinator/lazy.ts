import { Context, Parser } from './types.ts'

export const lazy = <T>(parserGenerator: () => Parser<T>): Parser<T> => {
  return (input: string, pos: number, ctx: Readonly<Context>) => {
    const parser = parserGenerator()
    return parser(input, pos, ctx)
  }
}
