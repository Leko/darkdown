import { C_NEWLINE } from '../scanner.ts'
import { until, seq, map, many, tap, or } from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { lineEnding } from './line-ending.ts'
import { indent } from './indent.ts'
import { CodeBlock } from '../ast.ts'
import { blankLine } from './blank-line.ts'

const line = map(
  seq(
    tap('indented_code_block > indent', indent(4)),
    tap('indented_code_block > until', until(lineEnding)),
    tap('indented_code_block > lineEnding', lineEnding)
  ),
  (r) => r[1]
)

// https://spec.commonmark.org/0.29/#indented-code-blocks
export const indentedCodeBlockParser = map(
  tap(
    'indented_code_block',
    seq(
      line,
      many(
        or(
          map(blankLine, () => ''),
          line
        )
      )
    )
  ),
  (r, end, start): CodeBlock => ({
    type: 'code_block',
    text: [r[0], ...r[1]].join(C_NEWLINE) + C_NEWLINE,
    language: null,
    info: null,
    ...toLoC({ end, start }),
  })
)
