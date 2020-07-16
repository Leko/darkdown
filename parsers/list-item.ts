import { C_SPACE } from '../scanner.ts'
import { char, until, many, seq, map, tap } from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { listMarker } from './list-marker.ts'
import { ListItem } from '../ast.ts'
import { paragraphParser } from './paragraph.ts'

// https://spec.commonmark.org/0.29/#list-items
export const listItemParser = map(
  tap(
    'list_item',
    seq(
      SOL(),
      many(char(C_SPACE)),
      listMarker,
      many(char(C_SPACE)),
      paragraphParser,
      lineEnding
    )
  ),
  (r, end, start): ListItem => ({
    type: 'list_item',
    indent: r[1].length,
    marker: r[2],
    children: r.slice(4, -1),
    start,
    length: end - start,
  })
)
