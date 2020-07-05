import { C_TAB, C_ASTERISK, C_HYPHEN, C_UNDERLINE } from '../scanner.ts'
import {
  keyword,
  many,
  or,
  seq,
  option,
  between,
} from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { space } from './space.ts'

const thematicBreakPadding = many(or(space, keyword(C_TAB)))

// https://spec.commonmark.org/0.29/#thematic-breaks
export const thematicBreakParser = seq(
  SOL(),
  option(seq(between(space, 1, 3))),
  or(
    seq(
      keyword(C_ASTERISK),
      thematicBreakPadding,
      keyword(C_ASTERISK),
      thematicBreakPadding,
      keyword(C_ASTERISK),
      thematicBreakPadding,
      many(seq(keyword(C_ASTERISK), thematicBreakPadding)),
      lineEnding
    ),
    seq(
      keyword(C_HYPHEN),
      thematicBreakPadding,
      keyword(C_HYPHEN),
      thematicBreakPadding,
      keyword(C_HYPHEN),
      thematicBreakPadding,
      many(seq(keyword(C_HYPHEN), thematicBreakPadding)),
      lineEnding
    ),
    seq(
      keyword(C_UNDERLINE),
      thematicBreakPadding,
      keyword(C_UNDERLINE),
      thematicBreakPadding,
      keyword(C_UNDERLINE),
      thematicBreakPadding,
      many(seq(keyword(C_UNDERLINE), thematicBreakPadding)),
      lineEnding
    )
  )
)
