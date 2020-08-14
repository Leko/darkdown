import {
  C_SPACE,
  C_DOUBLE_QUOTE,
  C_SINGLE_QUOTE,
  C_OPEN_PARENTHES,
  C_CLOSE_PARENTHES,
  C_OPEN_BRACKET,
  C_CLOSE_BRACKET,
  C_NEWLINE,
  C_GREATER_THAN,
} from '../scanner.ts'
import {
  or,
  atLeast,
  map,
  seq,
  tap,
  keyword,
  option,
  char,
  EOS,
  repeatIntercept,
  Parser,
  between,
} from '../parser-combinator.ts'
import { strParser } from '../parsers/str.ts'
import { Paragraph, Str } from '../ast.ts'
import { toLoC } from './loc.ts'
import { lineEnding } from './line-ending.ts'
import { thematicBreakParser } from './thematic-break.ts'
import { emptyLineParser } from './empty-line.ts'

export const linkParser = seq(
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

export const imageParser = seq(keyword('!'), linkParser)

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
