import { or, seq, map } from '../parser-combinator.ts'
import { thematicBreakParser } from './thematic-break.ts'
import { atxHeadingParser } from './atx-heading.ts'
import { setextHeadingParser } from './setext-heading.ts'
import { indentedCodeBlockParser } from './indented-code-block.ts'
import { fencedCodeBlockParser } from './fenced-code-block.ts'
import { paragraphParser } from './paragraph.ts'
import { emptyLineParser } from './empty-line.ts'
import { lineEnding } from './line-ending.ts'

// https://spec.commonmark.org/0.29/#leaf-blocks
export const leafBlockParser = or(
  setextHeadingParser,
  thematicBreakParser,
  atxHeadingParser,
  indentedCodeBlockParser,
  // fencedCodeBlockParser,
  // TODO: html block
  // TODO: Link definition & reference
  paragraphParser,
  emptyLineParser
)
