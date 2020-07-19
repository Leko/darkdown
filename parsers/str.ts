import {
  C_SPACE,
  C_NEWLINE,
  C_ASTERISK,
  C_GRAVE_ACCENT,
  C_BACK_SLASH,
} from '../scanner.ts'
import {
  keyword,
  until,
  map,
  or,
  seq,
  lazy,
  atLeast,
  tap,
  not,
  EOS,
  nor,
  option,
  matchOnly,
  Parser,
} from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { TODO } from './todo.ts'
import { lineEnding } from './line-ending.ts'
import { Str, Text, Emphasis, Strong, Code } from '../ast.ts'

const END = nor(lineEnding, EOS())

const asText = <T>(parser: Parser<T>) =>
  map(
    parser,
    (r, end, start): Text => ({
      type: 'text',
      text: r as any,
      ...toLoC({ end, start }),
    })
  )

export const textParser = (except?: Parser<any>) =>
  map(
    tap(
      'text',
      atLeast(nor(...[except as any, lineEnding, EOS()].filter(Boolean)), 1)
    ),
    (r, end, start): Text => ({
      type: 'text',
      text: r
        .join('')
        // FIXME: Is it right handling?
        .replace(/\\#/g, '#'),
      ...toLoC({ end, start }),
    })
  )

const softbreakParser = keyword(C_SPACE)

const linebreakParser = keyword(C_NEWLINE)

const emphParser: Parser<Emphasis> = map(
  tap(
    'emph',
    seq(
      tap('emph>spaces', option(keyword(C_SPACE))),
      tap(
        'emph>keyword(START)',
        seq(matchOnly(not(keyword(C_BACK_SLASH))), keyword(C_ASTERISK))
      ),
      tap(
        'emph>not',
        atLeast(not(or(keyword(C_ASTERISK), EOS(), lineEnding)), 1)
      ),
      tap('emph>keyword(END)', keyword(C_ASTERISK))
    )
  ),
  (r, end, start): Emphasis => ({
    type: 'emph',
    text: r[2].join(''),
    ...toLoC({ end, start }),
  })
)

const strongParser: Parser<Strong> = map(
  tap(
    'strong',
    seq(
      tap('strong>spaces', option(keyword(C_SPACE))),
      tap(
        'strong>keyword(START)',
        seq(
          matchOnly(not(keyword(C_BACK_SLASH))),
          keyword(C_ASTERISK + C_ASTERISK)
        )
      ),
      tap(
        'strong>not',
        atLeast(not(or(keyword(C_ASTERISK + C_ASTERISK), EOS(), lineEnding)), 1)
      ),
      tap('strong>keyword(END)', keyword(C_ASTERISK + C_ASTERISK))
    )
  ),
  (r, end, start): Strong => ({
    type: 'strong',
    text: r[2].join(''),
    ...toLoC({ end, start }),
  })
)

const codeParser: Parser<Code> = map(
  tap(
    'code',
    seq(
      tap('code>spaces', option(keyword(C_SPACE))),
      tap(
        'code>keyword(START)',
        seq(matchOnly(not(keyword(C_BACK_SLASH))), keyword(C_GRAVE_ACCENT))
      ),
      tap(
        'code>not',
        atLeast(not(or(keyword(C_GRAVE_ACCENT), EOS(), lineEnding)), 1)
      ),
      tap('code>keyword(END)', keyword(C_GRAVE_ACCENT))
    )
  ),
  (r, end, start): Code => ({
    type: 'code',
    text: r[2].join(''),
    ...toLoC({ end, start }),
  })
)

// const htmlInlineParser = TODO('HTML inline')

export const strParser = ({ except }: { except?: Parser<any> } = {}): Parser<
  Str
> =>
  map(
    atLeast(
      or(
        // softbreakParser,
        // linebreakParser,
        strongParser,
        emphParser,
        codeParser,
        // htmlInlineParser
        textParser(except)
      ),
      1
    ),
    (r, end, start): Str => ({
      type: 'str',
      children: r as any,
      ...toLoC({ end, start }),
    })
  )
