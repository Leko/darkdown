import { BulletListMarker, OrderedListMarker } from '../ast.ts'
import { or, Parser } from '../parser-combinator.ts'
import { bulletListMarker } from './bullet-list-marker.ts'
import { orderedListMarker } from './ordered-list-marker.ts'

// https://spec.commonmark.org/0.29/#list-marker
// @ts-expect-error Type '(input: string, pos: number, ctx: Readonly<Context>) => Parser<any[]>' is not assignable to type 'Parser<ASTNode<{ type: "bullet_list_marker"; char: string;
export const listMarker: Parser<BulletListMarker | OrderedListMarker> = or(
  bulletListMarker,
  orderedListMarker
)
