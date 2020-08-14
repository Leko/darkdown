import { BlockQuote, Str, isParagraph, Paragraph, ASTNode } from '../ast.ts'
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
import { leafBlockParser } from './leaf-block.ts'
import { listParser } from './list.ts'
import { toLoC, pickLoC } from './loc.ts'

// https://spec.commonmark.org/0.29/#block-quotes
export const blockQuoteParser = map(
  tap(
    'block_quote',
    atLeast(
      tap(
        'block_quote>seq',
        seq(
          // Case 200 The > characters can be indented 1-3 spaces:
          option(between(char(C_SPACE), 1, 3)),
          keyword('>'),
          // Case 199 The spaces after the > characters can be omitted:
          option(char(C_SPACE)),
          or(listParser, leafBlockParser)
        )
      ),
      1
    )
  ),
  (r, end, start): BlockQuote => ({
    type: 'block_quote',
    children: mergeParagraphs(
      r.map(([_spaces, _mark, _space, content]) => content)
    ),
    ...toLoC({ end, start }),
  })
)

// TODO: Refactor
function mergeParagraphs(
  nodes: (Paragraph | ASTNode<{ type: string; children: never[] }>)[]
): BlockQuote['children'] {
  const children: BlockQuote['children'] = []
  for (let node of nodes) {
    if (isParagraph(node) && isParagraph(children[children.length - 1])) {
      const p = children[children.length - 1]
      p.children.push(...node.children)
      p.length = node.start + node.length - p.start
    } else {
      // @ts-expect-error
      children.push(node)
    }
  }
  return children
}
