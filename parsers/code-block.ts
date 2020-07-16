import { or } from '../parser-combinator.ts'
import { fencedCodeBlockParser } from './fenced-code-block.ts'
import { indentedCodeBlockParser } from './indented-code-block.ts'

export const codeBlockParser = or(
  fencedCodeBlockParser,
  indentedCodeBlockParser
)
