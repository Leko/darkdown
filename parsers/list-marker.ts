import { or } from '../parser-combinator.ts'
import { bulletListMarker } from './bullet-list-marker.ts'
import { orderedListMarker } from './ordered-list-marker.ts'

// https://spec.commonmark.org/0.29/#list-marker
export const listMarker = or(bulletListMarker, orderedListMarker)
