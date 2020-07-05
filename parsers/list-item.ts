import { C_SPACE } from '../scanner.ts'
import { char, until, many, seq, map } from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { listMarker } from './list-marker.ts'

// https://spec.commonmark.org/0.29/#list-items
export const listItemParser = map(
  seq(
    SOL(),
    many(char(C_SPACE)),
    listMarker,
    many(char(C_SPACE)),
    until(lineEnding),
    lineEnding
  ),
  (r, end, start) => ({
    type: 'list_item',
    indent: r[1].length,
    marker: r[2],
    text: r.slice(4, -1).flat().join(''),
    start,
    length: end - start,
  })
)
