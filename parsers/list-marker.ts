import { BulletListMarker, OrderedListMarker } from '../ast.ts'
import { or, Parser } from '../parser-combinator.ts'
import { bulletListMarker } from './bullet-list-marker.ts'
import { orderedListMarker } from './ordered-list-marker.ts'

// https://spec.commonmark.org/0.29/#list-marker
export const listMarker: Parser<BulletListMarker | OrderedListMarker> = or(
  bulletListMarker,
  orderedListMarker
)
