import { OrderedListMarker } from '../ast.ts'
import { between, char, map, Parser, seq } from '../parser-combinator.ts'
import { C_CLOSE_PARENTHES, C_DOT } from '../scanner.ts'
import { decimalChar } from './decimal-char.ts'
import { toLoC } from './loc.ts'

const decimals = map(between(decimalChar, 1, 9), (r) => r.flat().join(''))

// https://spec.commonmark.org/0.29/#ordered-list-marker
export const orderedListMarker: Parser<OrderedListMarker> = map(
  seq(decimals, char(C_CLOSE_PARENTHES + C_DOT)),
  (r, end, start): OrderedListMarker => ({
    type: 'ordered_list_marker',
    number: r[0],
    delimiter: r[1],
    text: r.join(''),
    children: [],
    ...toLoC({ end, start }),
  })
)
