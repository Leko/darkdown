import { C_SHARP } from '../scanner.ts'
import {
  keyword,
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
import { strParser } from './str.ts'

// https://spec.commonmark.org/0.29/#atx-headings
export const atxHeadingParser = seq(
  SOL(),
  option(seq(between(space, 1, 3))),
  between(keyword(C_SHARP), 1, 6),
  option(seq(atLeast(space, 1), strParser)),
  or(option(many(or(space, keyword(C_SHARP)))), option(strParser)),
  lineEnding
)
