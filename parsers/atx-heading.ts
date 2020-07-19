import { C_SHARP, C_ASTERISK } from '../scanner.ts'
import { Heading } from '../ast.ts'
import {
  keyword,
  many,
  or,
  seq,
  option,
  atLeast,
  between,
  map,
  tap,
  char,
  matchOnly,
} from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { space } from './space.ts'
import { strParser } from './str.ts'

// https://spec.commonmark.org/0.29/#atx-headings
export const atxHeadingParser = map(
  tap(
    'atx-heading',
    seq(
      tap('atx-heading>SOL', SOL()),
      tap('atx-heading>option', option(seq(between(space, 1, 3)))),
      tap('atx-heading>between', between(keyword(C_SHARP), 1, 6)),
      tap(
        'atx-heading>option',
        option(
          seq(
            //
            tap('atx-heading>option>spaces', atLeast(space, 1)),
            //
            or(
              //
              tap(
                'atx-heading>option>or>seq',
                seq(atLeast(keyword(C_SHARP), 1), matchOnly(lineEnding))
              ),
              //
              tap(
                'atx-heading>option>or>seq',
                strParser({ except: char(C_SHARP) })
              )
            )
          )
        )
      ),
      tap('atx-heading>or', option(or(strParser()))),
      tap('atx-heading>lineEnding', lineEnding)
    )
  ),
  (r, end, start): Heading => {
    const children = (r[3] || [r[4]] || []).filter(
      (el: any) => el && el.type === 'str'
    )
    return {
      type: 'heading',
      level: r[2].length,
      children,
      ...toLoC({ end, start }),
    }
  }
)
