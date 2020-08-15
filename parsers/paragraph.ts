import { Image, Link, Paragraph, Str } from '../ast.ts'
import {
  atLeast,
  between,
  char,
  EOS,
  keyword,
  map,
  option,
  or,
  Parser,
  repeatIntercept,
  seq,
  tap,
} from '../parser-combinator.ts'
import { strParser } from '../parsers/str.ts'
import {
  C_CLOSE_BRACKET,
  C_CLOSE_PARENTHES,
  C_DOUBLE_QUOTE,
  C_GREATER_THAN,
  C_NEWLINE,
  C_OPEN_BRACKET,
  C_OPEN_PARENTHES,
  C_SINGLE_QUOTE,
  C_SPACE,
} from '../scanner.ts'
import { emptyLineParser } from './empty-line.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'
import { thematicBreakParser } from './thematic-break.ts'

// @ts-expect-error
export const linkParser: Parser<Link> = seq(
  keyword(C_OPEN_BRACKET),
  strParser(),
  keyword(C_CLOSE_BRACKET),
  or(
    seq(
      keyword(C_OPEN_PARENTHES),
      strParser(), // FIXME
      keyword(C_CLOSE_PARENTHES)
    ),
    option(
      seq(
        atLeast(keyword(C_SPACE), 1),
        or(
          seq(keyword(C_DOUBLE_QUOTE), strParser(), keyword(C_DOUBLE_QUOTE)),
          seq(keyword(C_SINGLE_QUOTE), strParser(), keyword(C_SINGLE_QUOTE)),
          seq(
            keyword(C_OPEN_PARENTHES),
            strParser(),
            keyword(C_CLOSE_PARENTHES)
          )
        )
      )
    )
  )
)

// @ts-expect-error
export const imageParser: Parser<Image> = seq(keyword('!'), linkParser)

export const paragraphParser: Parser<Paragraph> = map(
  tap(
    'paragraph',
    repeatIntercept({
      intercepter: tap(
        'paragrah>intercepter',
        or(
          tap('paragrah>thematicBreak', thematicBreakParser),
          tap('paragrah>emptyLine', emptyLineParser),
          tap(
            'paragrah>block_quote',
            seq(option(between(char(C_SPACE), 1, 3)), char(C_GREATER_THAN))
          )
        )
      ),
      atLeast: 1,
    })(
      seq(
        or(
          map(tap('paragraph>str', strParser()), (r) => ({
            ...r,
            children: [
              // Trim leading whitespaces
              { ...r.children[0], text: r.children[0].text.trimStart() },
              ...r.children.slice(1),
            ],
          }))
          // linkParser,
          // imageParser
        ),
        map(
          tap('paragraph>option', option(or(lineEnding, EOS()))),
          // FIXME: Is it "Str"? It's keyword I think.
          (r, end, start): Str => ({
            type: 'str',
            children:
              // r[1] === true means end of string
              r && r[0]
                ? []
                : [
                    {
                      type: 'text',
                      text: C_NEWLINE,
                      ...toLoC({ end, start }),
                    },
                  ],
            ...toLoC({ end, start }),
          })
        )
      )
    )
  ),
  (result, end, start): Paragraph => ({
    type: 'paragraph',
    // @ts-ignore
    children: result.flat(),
    ...toLoC({ end, start }),
  })
)
