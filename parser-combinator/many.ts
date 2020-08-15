import { Context, isParseFailed, Parser } from './parser.ts'

export const many = <T>(parser: Parser<T>): Parser<T[]> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const results: T[] = []
  let newPos = pos
  while (newPos <= input.length) {
    const result = parser(input, newPos, ctx)
    if (isParseFailed(result)) {
      break
    }
    results.push(result[1])
    newPos = result[2]
  }
  return [true, results, newPos]
}
