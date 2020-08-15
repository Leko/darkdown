import { AtLeast, Context, isParseFailed, Parser } from './parser.ts'

export const repeatIntercept = <T, N extends number>({
  intercepter,
  atLeast,
}: {
  intercepter: Parser<any>
  atLeast: N
}) => (parser: Parser<T>): Parser<AtLeast<N, T>> => (
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
    if (isParseFailed(result)) {
      break
    }
    results.push(result[1])
    newPos = result[2]
  }

  if (results.length >= atLeast) {
    return [
      true,
      // @ts-expect-error Property '0' is missing in type 'T[]' but required in type '[T, ...T[]]'
      results as AtLeast<N, T>,
      newPos,
    ]
  }
  return [false, null, pos]
}
