import { C_SHARP } from '../scanner.ts'
import { Heading } from '../ast.ts'
import {
  keyword,
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
import { lineEnding } from './line-ending.ts'
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
    const children = (r[2] || [r[3]] || []).filter(
      (el: any) => el && el.type === 'str'
    )
    return {
      type: 'heading',
      level: r[1].length,
      children,
      ...toLoC({ end, start }),
    }
  }
)
