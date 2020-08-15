import { Heading, Str } from '../ast.ts'
import {
  atLeast,
  between,
  keyword,
  map,
  matchOnly,
  option,
  or,
  Parser,
  seq,
  tap,
} from '../parser-combinator.ts'
import { C_EQUAL, C_HYPHEN, C_NEWLINE } from '../scanner.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'
import { SOL } from './sol.ts'
import { space } from './space.ts'
import { strParser } from './str.ts'

const border = or(atLeast(keyword(C_HYPHEN), 3), atLeast(keyword(C_EQUAL), 3))

// https://spec.commonmark.org/0.29/#setext-heading
export const setextHeadingParser: Parser<Heading> = map(
  tap(
    'setext-heading',
    seq(
      tap(
        'setext-heading>body',
        atLeast(
          seq(
            SOL(),
            option(seq(between(space, 1, 3))),
            strParser({ except: matchOnly(border) }),
            // FIXME: Implement into lineEnding
            map(
              lineEnding,
              (_, end, start): Str => ({
                type: 'str',
                children: [
                  {
                    type: 'text',
                    text: C_NEWLINE,
                    ...toLoC({ start, end }),
                  },
                ],
                ...toLoC({ start, end }),
              })
            )
          ),
          1
        )
      ),
      tap('setext-heading>SOL', SOL()),
      tap('setext-heading>spaces', option(seq(between(space, 1, 3)))),
      tap('setext-heading>---', border),
      option(atLeast(space, 1)),
      lineEnding
    )
  ),
  (r, end, start): Heading => ({
    type: 'heading',
    children: r[0].flatMap((rr: any) => rr.slice(2)).slice(0, -1),
    level: r[3]?.[0] === '=' ? 1 : 2,
    ...toLoC({ end, start }),
  })
)
