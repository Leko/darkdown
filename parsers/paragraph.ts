import {
  C_SPACE,
  C_DOUBLE_QUOTE,
  C_SINGLE_QUOTE,
  C_OPEN_PARENTHES,
  C_CLOSE_PARENTHES,
  C_OPEN_BRACKET,
  C_CLOSE_BRACKET,
} from '../scanner.ts'
import {
  or,
  atLeast,
  map,
  seq,
  tap,
  keyword,
  option,
  until,
} from '../parser-combinator.ts'
import { linkDefinitionParser } from '../parsers/link-definition.ts'
import { strParser } from '../parsers/str.ts'
import { Paragraph } from '../ast.ts'
import { lineEnding } from './line-ending.ts'

export const linkParser = seq(
  keyword(C_OPEN_BRACKET),
  strParser,
  keyword(C_CLOSE_BRACKET),
  or(
    seq(
      keyword(C_OPEN_PARENTHES),
      strParser, // FIXME
      keyword(C_CLOSE_PARENTHES)
    ),
    option(
      seq(
        atLeast(keyword(C_SPACE), 1),
        or(
          seq(keyword(C_DOUBLE_QUOTE), strParser, keyword(C_DOUBLE_QUOTE)),
          seq(keyword(C_SINGLE_QUOTE), strParser, keyword(C_SINGLE_QUOTE)),
          seq(keyword(C_OPEN_PARENTHES), strParser, keyword(C_CLOSE_PARENTHES))
        )
      )
    )
  )
)

export const imageParser = seq(keyword('!'), linkParser)

// export const paragraphParser = map(
//   until(lineEnding),
//   (result, end, start): Paragraph => ({
//     type: 'paragraph',
//     children: result as any,
//     start,
//     length: end - start,
//   })
// )
export const paragraphParser = map(
  tap(
    'paragraph',
    atLeast(
      or(
        strParser
        // linkDefinitionParser,
        // linkParser,
        // imageParser
      ),
      1
    )
  ),
  (result, end, start): Paragraph => ({
    type: 'paragraph',
    // @ts-ignore
    children: result,
    start,
    length: end - start,
  })
)
