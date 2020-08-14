import { or } from '../parser-combinator.ts'
import { thematicBreakParser } from './thematic-break.ts'
import { atxHeadingParser } from './atx-heading.ts'
import { setextHeadingParser } from './setext-heading.ts'
import { indentedCodeBlockParser } from './indented-code-block.ts'
import { paragraphParser } from './paragraph.ts'
import { emptyLineParser } from './empty-line.ts'
import { htmlParser } from './html.ts'
import { linkDefinitionParser } from '../parsers/link-definition.ts'

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
