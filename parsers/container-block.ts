import { listParser } from './list.ts'
import { listItemParser } from './list-item.ts'
import { blockQuoteParser } from './block-quote.ts'
import { or } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#container-blocks
export const containerBlockParser = or(
  listParser,
  listItemParser,
  blockQuoteParser
)
