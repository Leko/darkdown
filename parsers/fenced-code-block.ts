import { C_GRAVE_ACCENT, C_TILDE } from '../scanner.ts'
import {
  keyword,
  until,
  many,
  or,
  seq,
  option,
  atLeast,
  between,
} from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { space } from './space.ts'

// https://spec.commonmark.org/0.29/#fenced-code-blocks
const fencedCodeBlockParserGenerator = (
  sep: typeof C_TILDE | typeof C_GRAVE_ACCENT
) =>
  seq(
    SOL(),
    option(seq(between(space, 1, 3))),
    atLeast(keyword(sep), 3),
    many(space),
    until(space),
    many(space),
    until(lineEnding),
    lineEnding,
    // FIXME: The closing code fence must be at least as long as the opening fence:
    until(keyword(sep)),
    SOL(),
    option(seq(between(space, 1, 3))),
    atLeast(keyword(sep), 3),
    lineEnding
  )

export const fencedCodeBlockParser = or(
  fencedCodeBlockParserGenerator(C_TILDE),
  fencedCodeBlockParserGenerator(C_GRAVE_ACCENT)
)
