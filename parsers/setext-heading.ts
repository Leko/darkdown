import { C_HYPHEN, C_EQUAL } from '../scanner.ts'
import {
  keyword,
  or,
  seq,
  option,
  lazy,
  atLeast,
  between,
} from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { blankLine } from './blank-line.ts'
import { space } from './space.ts'
import { strParser } from './str.ts'

// https://spec.commonmark.org/0.29/#setext-heading
export const setextHeadingParser = seq(
  or(
    blankLine,
    lazy(() => setextHeadingParser)
  ),
  atLeast(
    seq(SOL(), option(seq(between(space, 1, 3))), strParser, lineEnding),
    1
  ),
  SOL(),
  option(seq(between(space, 1, 3))),
  or(atLeast(keyword(C_HYPHEN), 3), atLeast(keyword(C_EQUAL), 3))
)
