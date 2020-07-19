import { BlockQuote } from '../ast.ts'
import {
  keyword,
  seq,
  map,
  atLeast,
  tap,
  lazy,
  char,
  or,
} from '../parser-combinator.ts'
import { C_SPACE } from '../scanner.ts'
// FIXME: Circular dependency
// import { containerBlockParser } from './container-block.ts'
import { leafBlockParser } from './leaf-block.ts'
import { listParser } from './list.ts'
import { toLoC } from './loc.ts'

// https://spec.commonmark.org/0.29/#block-quotes
export const blockQuoteParser = map(
  tap(
    'block_quote',
    atLeast(
      seq(keyword('>'), char(C_SPACE), or(listParser, leafBlockParser)),
      1
    )
  ),
  (r, end, start): BlockQuote => ({
    type: 'block_quote',
    children: r.map(([_mark, _space, content]) => content),
    ...toLoC({ end, start }),
  })
)
