import { LineBreak } from '../ast.ts'
import { C_SPACE } from '../scanner.ts'
import { seq, map, char, atLeast, matchOnly } from '../parser-combinator.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'

// https://spec.commonmark.org/0.29/#hard-line-break
export const hardLineBreakParser = map(
  seq(atLeast(char(C_SPACE), 2), matchOnly(lineEnding)),
  (r, end, start): LineBreak => ({
    type: 'linebreak',
    text: r[0].join(''),
    ...toLoC({ end, start }),
  })
)
