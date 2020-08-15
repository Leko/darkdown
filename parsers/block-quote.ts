import { ASTNode, BlockQuote, isParagraph, Paragraph } from '../ast.ts'
import {
  between,
  char,
  keyword,
  map,
  option,
  or,
  repeatIntercept,
  seq,
  tap,
} from '../parser-combinator.ts'
import { C_SPACE } from '../scanner.ts'
import { emptyLineParser } from './empty-line.ts'
import { leafBlockParser } from './leaf-block.ts'
import { listParser } from './list.ts'
import { toLoC } from './loc.ts'
import { thematicBreakParser } from './thematic-break.ts'

// https://spec.commonmark.org/0.29/#block-quotes
export const blockQuoteParser = map(
  tap(
    'block_quote',
    repeatIntercept({
      intercepter: tap(
        'block_quote>intercepter',
        or(
          tap('block_quote>thematicBreak', thematicBreakParser),
          tap('block_quote>emptyLine', emptyLineParser)
        )
      ),
      atLeast: 1,
    })(
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
      )
    )
  ),
  (r, end, start): BlockQuote => ({
    type: 'block_quote',
    children: mergeParagraphs(
      // @ts-expect-error
      r.map(([_spaces, _mark, _space, content]) => content)
    ),
    ...toLoC({ end, start }),
  })
)

// TODO: Refactor
function mergeParagraphs(
  nodes: (Paragraph | ASTNode)[]
): BlockQuote['children'] {
  const children: BlockQuote['children'] = []
  for (let node of nodes) {
    if (isParagraph(node) && isParagraph(children[children.length - 1])) {
      const p = children[children.length - 1]
      p.children.push(...node.children)
      p.length = node.start + node.length - p.start
    } else {
      // @ts-expect-error Argument of type 'ASTNode | Paragraph' is not assignable to parameter of type 'Paragraph'
      children.push(node)
    }
  }
  return children
}
