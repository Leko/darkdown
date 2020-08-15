import { keyword, map, or, Parser, repeat, seq } from '../parser-combinator.ts'
import { C_SPACE, C_TAB } from '../scanner.ts'

// https://spec.commonmark.org/0.29/#tabs
export const indent = (width: number) => {
  const parsers: Parser<(typeof C_SPACE | typeof C_TAB)[]>[] = [
    seq(keyword(C_TAB)),
  ]
  for (let i = 1; i < width; i++) {
    parsers.push(
      // @ts-expect-error Argument of type 'Parser<[any[], "\t"]>' is not assignable to parameter of type 'Parser<(" " | "\t")[]>'
      seq(repeat(keyword(C_SPACE), 1), keyword(C_TAB))
    )
  }
  parsers.push(repeat(keyword(C_SPACE), width))
  return map(seq(or(...parsers)), () => C_SPACE.repeat(width))
}
