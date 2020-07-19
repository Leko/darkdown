import { C_SPACE, C_TAB } from '../scanner.ts'
import { keyword, repeat, or, seq, map } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#tabs
export const indent = (width: number) => {
  const parsers = [seq(keyword(C_TAB))]
  for (let i = 1; i < width; i++) {
    parsers.push(seq(repeat(keyword(C_SPACE), 1), keyword(C_TAB)))
  }
  parsers.push(repeat(keyword(C_SPACE), width))
  return map(seq(or(...parsers)), () => C_SPACE.repeat(width))
}
