import { HTML } from '../ast.ts'
import {
  atLeast,
  capture,
  char,
  keyword,
  lazy,
  map,
  option,
  or,
  Parser,
  seq,
  tap,
  until,
} from '../parser-combinator.ts'
import {
  C_GREATER_THAN,
  C_LESS_THAN,
  C_NEWLINE,
  C_SLASH,
  C_SPACE,
} from '../scanner.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'
import { space } from './space.ts'
import { textParser } from './text.ts'

// https://spec.commonmark.org/0.29/#html-block

export const selfCloseHtmlParser = lazy(() => {
  const selfClosing = seq(
    tap('html_block>self_close(space)', option(atLeast(space, 1))),
    tap('html_block>self_close(/>)', keyword(C_SLASH + C_GREATER_THAN)),
    tap('html_block>self_close(\\n', option(keyword(C_NEWLINE)))
  )

  return tap(
    'html_block(self-close)',
    seq(
      seq(
        tap('html_block(self-close)>open(<)', keyword(C_LESS_THAN)),
        tap(
          'html_block(self-close)>open(tag)',
          until(or(space, keyword(C_GREATER_THAN)))
        )
      ),
      tap(
        'html_block(self-close)>content',
        or(htmlParser, textParser(selfClosing))
      ),
      selfClosing
    )
  )
})

export const htmlElementParser = map(
  lazy(() =>
    capture(({ capture, ifMatch }) => {
      const exactClosing = seq(
        tap('html_block(open-close)>close(</', keyword(C_LESS_THAN + C_SLASH)),
        tap(
          'html_block(open-close)>close(tag',
          ifMatch((tagName) => keyword(tagName as string))
        ),
        tap('html_block(open-close)>close(>', keyword(C_GREATER_THAN)),
        tap('html_block(open-close)>close(\\n', option(keyword(C_NEWLINE)))
      )

      return tap(
        'html_block(open-close)',
        seq(
          map(
            seq(
              tap(
                'html_block(open-close)>pre spaces',
                map(
                  option(atLeast(char(C_SPACE + C_NEWLINE), 1)),
                  (r) => r?.join('') ?? ''
                )
              ),
              tap('html_block(open-close)>open(<)', keyword(C_LESS_THAN)),
              tap(
                'html_block(open-close)>open(tag)',
                capture(until(keyword(C_GREATER_THAN)))
              ),
              tap('html_block(open-close)>open(>)', keyword(C_GREATER_THAN))
            ),
            (r) => r.join('')
          ),
          tap(
            'html_block(open-close)>content',
            or(
              map(htmlParser, (r) => r.text),
              map(
                atLeast(
                  or(
                    map(lineEnding, () => C_NEWLINE),
                    map(textParser(exactClosing), (r) => r.text)
                  ),
                  1
                ),
                (r) => r.join('')
              )
            )
          ),
          map(exactClosing, (r) => r.join(''))
        )
      )
    })
  ),
  (r, end, start): HTML => ({
    type: 'html',
    text: r.join(''),
    ...toLoC({ end, start }),
  })
)

// export const htmlParser = or(htmlElementParser, selfCloseHtmlParser)
export const htmlParser: Parser<HTML> = or(htmlElementParser)
