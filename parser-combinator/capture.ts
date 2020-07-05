import { Parser, ParseResult, ParseFailed } from './types.ts'

export const capture = <T, P, S>(
  parserGenerator: (arg: {
    capture: (parser: Parser<P>) => Parser<P>
    ifMatch: (captureParserGenerator: (result: P) => Parser<S>) => Parser<S>
  }) => Parser<T>
) => {
  let parseResult: any | null = null
  return parserGenerator({
    capture: (parser) => (input: string, pos: number) => {
      parseResult = null
      const result = parser(input, pos)
      if (result[0]) {
        parseResult = result[1]
      }
      return result
    },
    ifMatch: (callback) => (input: string, pos: number) => {
      return callback(parseResult)(input, pos)
    },
  })
}
