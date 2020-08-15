import { Context, Parser } from './parser.ts'

export const lazy = <T>(parserGenerator: () => Parser<T>): Parser<T> => {
  return (input: string, pos: number, ctx: Readonly<Context>) => {
    const parser = parserGenerator()
    return parser(input, pos, ctx)
  }
}
