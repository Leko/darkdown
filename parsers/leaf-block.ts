import { or } from '../parser-combinator.ts'
import { linkDefinitionParser } from '../parsers/link-definition.ts'
import { atxHeadingParser } from './atx-heading.ts'
import { emptyLineParser } from './empty-line.ts'
import { htmlParser } from './html.ts'
import { indentedCodeBlockParser } from './indented-code-block.ts'
import { paragraphParser } from './paragraph.ts'
import { setextHeadingParser } from './setext-heading.ts'
import { thematicBreakParser } from './thematic-break.ts'

// https://spec.commonmark.org/0.29/#leaf-blocks
export const leafBlockParser = or(
  linkDefinitionParser,
  atxHeadingParser,
  setextHeadingParser,
  thematicBreakParser,
  indentedCodeBlockParser,
  // fencedCodeBlockParser,
  // TODO: html block
  htmlParser,
  paragraphParser,
  emptyLineParser
)
