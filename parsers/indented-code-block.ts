import { C_NEWLINE } from '../scanner.ts'
import { lastIndexOf } from '../util/last-index-of.ts'
import {
  atLeast,
  until,
  seq,
  map,
  many,
  tap,
  or,
  option,
  between,
} from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { lineEnding } from './line-ending.ts'
import { indent } from './indent.ts'
import { CodeBlock } from '../ast.ts'
import { blankLine } from './blank-line.ts'
import { space } from './space.ts'

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
          tap(
            'indented_code_block>space[0-3]+empty',
            map(seq(between(space, 0, 3), lineEnding), () => '')
          ),
          line
        )
      )
    )
  ),
  (r, end, start): CodeBlock => {
    const lines = [r[0], ...r[1]]
    const startIndex = lines.findIndex((line) => line !== '')
    const endIndex = lastIndexOf(lines, (line) => line !== '')
    const contentLines = lines.slice(
      startIndex === -1 ? 0 : startIndex,
      endIndex === -1 ? lines.length : endIndex
    )

    return {
      type: 'code_block',
      text: contentLines.join(C_NEWLINE) + C_NEWLINE,
      language: null,
      info: null,
      ...toLoC({ end, start }),
    }
  }
)
