import { Context, Parser } from './types.ts'

export const many = <T>(parser: Parser<T>): Parser<T[]> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const results: T[] = []
  let newPos = pos
  while (newPos <= input.length) {
    const result = parser(input, newPos, ctx)
    if (!result[0]) {
      break
    }
    results.push(result[1])
    newPos = result[2]
  }
  return [true, results, newPos]
}
