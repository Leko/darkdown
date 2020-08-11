import { Parser, Context } from './types.ts'

export const repeatIntercept = <T>({
  intercepter,
  atLeast = 1,
}: {
  intercepter: Parser<any>
  atLeast?: number
}) => (parser: Parser<T>): Parser<T[]> => (
  input: string,
  pos: number,
  ctx: Readonly<Context>
) => {
  const results: T[] = []
  let newPos = pos
  while (newPos <= input.length) {
    const [matched] = intercepter(input, newPos, ctx)
    if (matched) {
      break
    }
    const result = parser(input, newPos, ctx)
    if (!result[0]) {
      break
    }
    results.push(result[1])
    newPos = result[2]
  }

  if (results.length >= atLeast) {
    return [true, results, newPos]
  }
  return [false, null, pos]
}
