import { ThematicBreak } from '../ast.ts'
import {
  between,
  keyword,
  many,
  map,
  option,
  or,
  Parser,
  seq,
} from '../parser-combinator.ts'
import { C_ASTERISK, C_HYPHEN, C_TAB, C_UNDERLINE } from '../scanner.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'
import { SOL } from './sol.ts'
import { space } from './space.ts'

const thematicBreakPadding = many(or(space, keyword(C_TAB)))

// https://spec.commonmark.org/0.29/#thematic-breaks
export const thematicBreakParser: Parser<ThematicBreak> = map(
  seq(
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
  ),
  (r, end, start): ThematicBreak => ({
    type: 'thematic_break',
    text: r[2][0],
    ...toLoC({ end, start }),
  })
)
