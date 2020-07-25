import { HTML } from '../ast.ts'
import {
  C_LESS_THAN,
  C_GREATER_THAN,
  C_SLASH,
  C_SPACE,
  C_NEWLINE,
} from '../scanner.ts'
import {
  map,
  keyword,
  until,
  or,
  seq,
  lazy,
  atLeast,
  option,
  capture,
  tap,
  Parser,
  char,
} from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { space } from './space.ts'
import { textParser } from './text.ts'
import { lineEnding } from './line-ending.ts'

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
// @ts-expect-error
export const htmlParser: Parser<HTML> = or(htmlElementParser)
