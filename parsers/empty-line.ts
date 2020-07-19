import { EmptyLine } from '../ast.ts'
import { seq, map } from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { anyWhitespaces } from './whitespaces.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'

export const emptyLineParser = map(
  seq(SOL(), anyWhitespaces, lineEnding),
  (_, end, start): EmptyLine => ({
    type: 'empty_line',
    children: [],
    ...toLoC({ end, start }),
  })
)
