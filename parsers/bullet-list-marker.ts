import { C_ASTERISK, C_PLUS, C_HYPHEN } from '../scanner.ts'
import { char, map } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#bullet-list-marker
export const bulletListMarker = map(
  char(C_PLUS + C_HYPHEN + C_ASTERISK),
  (r, end, start) => ({
    type: 'bullet_list_marker',
    char: r,
    start,
    length: end - start,
  })
)
