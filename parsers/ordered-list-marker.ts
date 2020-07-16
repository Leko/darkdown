import { C_CLOSE_PARENTHES, C_DOT } from '../scanner.ts'
import { char, seq, map, between } from '../parser-combinator.ts'
import { decimalChar } from './decimal-char.ts'
import { OrderedListMarker } from '../ast.ts'

const decimals = map(between(decimalChar, 1, 9), (r) => r.flat().join(''))

// https://spec.commonmark.org/0.29/#ordered-list-marker
export const orderedListMarker = map(
  seq(decimals, char(C_CLOSE_PARENTHES + C_DOT)),
  (r, end, start): OrderedListMarker => ({
    type: 'ordered_list_marker',
    number: r[0],
    delimiter: r[1],
    text: r.join(''),
    start,
    children: [],
    length: end - start,
  })
)
