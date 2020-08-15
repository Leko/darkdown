import { Heading, isStr, Str } from '../ast.ts'
import {
  atLeast,
  between,
  char,
  keyword,
  map,
  matchOnly,
  option,
  or,
  seq,
  tap,
} from '../parser-combinator.ts'
import { C_SHARP } from '../scanner.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'
import { space } from './space.ts'
import { strParser } from './str.ts'

// https://spec.commonmark.org/0.29/#atx-headings
export const atxHeadingParser = map(
  tap(
    'atx-heading',
    seq(
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
    const children = (r[2] || [r[3]] || []).filter(isStr) as Str[]
    return {
      type: 'heading',
      level: r[1].length as Heading['level'],
      children,
      ...toLoC({ end, start }),
    }
  }
)
