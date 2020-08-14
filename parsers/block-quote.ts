import { BlockQuote } from '../ast.ts'
import {
  keyword,
  seq,
  map,
  atLeast,
  tap,
  char,
  or,
  option,
  between,
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
      seq(
        // Case 200 The > characters can be indented 1-3 spaces:
        option(between(char(C_SPACE), 1, 3)),
        keyword('>'),
        // Case 199 The spaces after the > characters can be omitted:
        option(char(C_SPACE)),
        or(listParser, leafBlockParser)
      ),
      1
    )
  ),
  (r, end, start): BlockQuote => ({
    type: 'block_quote',
    children: r.map(([_spaces, _mark, _space, content]) => content),
    ...toLoC({ end, start }),
  })
)
