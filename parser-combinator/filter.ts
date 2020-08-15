import { Parser, Parser, , Context } from './types.ts'

export const filter = <T>(
  parser: Parser<T>,
  predicator: (result: Parser<T>, input: string) => boolean
) => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
): Parser<T> => {
  const result = parser(input, pos, ctx)
  if (result[0] && predicator(result, input)) {
    return result
  }
  return [false, null, pos]
}
