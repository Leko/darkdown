import { Context, isParseResult, Parser } from './parser.ts'

export const capture = <T, P, S>(
  parserGenerator: (arg: {
    capture: (parser: Parser<P>) => Parser<P>
    ifMatch: (captureParserGenerator: (result: P) => Parser<S>) => Parser<S>
  }) => Parser<T>
) => {
  let parseResult: any | null = null
  return parserGenerator({
    capture: (parser) => (
      input: string,
      pos: number,
      ctx: Readonly<Context>
    ) => {
      parseResult = null
      const result = parser(input, pos, ctx)
      if (isParseResult(result)) {
        parseResult = result[1]
      }
      return result
    },
    ifMatch: (callback) => (
      input: string,
      pos: number,
      ctx: Readonly<Context>
    ) => callback(parseResult)(input, pos, ctx),
  })
}
