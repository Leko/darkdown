import {
  C_SPACE,
  C_NEWLINE,
  C_ASTERISK,
  C_GRAVE_ACCENT,
  C_BACK_SLASH,
} from '../scanner.ts'
import {
  keyword,
  map,
  or,
  seq,
  atLeast,
  tap,
  not,
  EOS,
  option,
  matchOnly,
  Parser,
} from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { lineEnding } from './line-ending.ts'
import { htmlParser } from './html.ts'
import { Str, Emphasis, Strong, Code } from '../ast.ts'
import { textParser } from './text.ts'

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
        htmlParser,
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
