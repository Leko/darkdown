import {
  C_SPACE,
  C_TAB,
  C_DOUBLE_QUOTE,
  C_SINGLE_QUOTE,
  C_COLON,
  C_LESS_THAN,
  C_GREATER_THAN,
  C_OPEN_BRACKET,
  C_CLOSE_BRACKET,
} from '../scanner.ts'
import {
  keyword,
  char,
  until,
  many,
  or,
  seq,
  option,
  atLeast,
} from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { sandwiched } from './sandwiched.ts'
import { wrapped } from './wrapped.ts'
import { lineEnding } from './line-ending.ts'
import { whitespaceChar } from './whitespace-char.ts'
import { anyWhitespaces, whitespaces } from './whitespaces.ts'

// https://spec.commonmark.org/0.29/#link-reference-definitions
export const linkDefinitionParser = seq(
  SOL(),
  sandwiched(C_OPEN_BRACKET, C_CLOSE_BRACKET),
  keyword(C_COLON),
  // The link destination may not be omitted:
  option(
    seq(
      anyWhitespaces,
      or(
        seq(
          sandwiched(C_LESS_THAN, C_GREATER_THAN),
          atLeast(whitespaceChar, 1)
        ),
        seq(until(whitespaceChar), whitespaceChar)
      )
    )
  ),
  // The title may be omitted: Example 167
  option(
    seq(
      whitespaces,
      or(wrapped(C_SINGLE_QUOTE), wrapped(C_DOUBLE_QUOTE)),
      many(char(C_SPACE + C_TAB)),
      lineEnding
    )
  )
)
