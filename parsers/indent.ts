import { C_SPACE, C_TAB } from '../scanner.ts'
import { keyword, repeat, or, seq, map } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#tabs
export const indent = map(
  seq(
    or(
      seq(keyword(C_TAB)),
      seq(repeat(keyword(C_SPACE), 1), keyword(C_TAB)),
      seq(repeat(keyword(C_SPACE), 2), keyword(C_TAB)),
      seq(repeat(keyword(C_SPACE), 3), keyword(C_TAB)),
      seq(repeat(keyword(C_SPACE), 4))
    )
  ),
  () => C_SPACE + C_SPACE + C_SPACE + C_SPACE
)
