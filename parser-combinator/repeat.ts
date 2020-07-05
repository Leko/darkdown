import { Parser } from './types.ts'
import { seq } from './seq.ts'

export const repeat = <T>(parser: Parser<T>, count: number) => {
  const parsers: Parser<T>[] = []
  for (let i = 0; i < count; i++) {
    parsers.push(parser)
  }
  return seq(...parsers)
}
