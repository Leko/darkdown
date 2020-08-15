import { Parser } from './parser.ts'
import { seq } from './seq.ts'

export const repeat = <T, N extends number>(
  parser: Parser<T>,
  count: N
): Parser<Tuple<T, N>> => {
  const parsers: Parser<T>[] = []
  for (let i = 0; i < count; i++) {
    parsers.push(parser)
  }
  // @ts-ignore
  return seq(...parsers)
}

type Tuple<T, N extends number> = [T, ...T[]] & { length: N }
