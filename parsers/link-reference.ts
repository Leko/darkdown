import {
  C_SPACE,
  C_OPEN_BRACKET,
  C_CLOSE_BRACKET,
  C_BACK_SLASH,
} from '../scanner.ts'
import {
  map,
  char,
  seq,
  option,
  tap,
  between,
  matchOnly,
} from '../parser-combinator.ts'
import { sandwiched } from './sandwiched.ts'
import { lineEnding } from './line-ending.ts'
import { LinkReference } from '../ast.ts'
import { toLoC } from './loc.ts'

// https://spec.commonmark.org/0.29/#link-reference-definitions
export const linkReferenceParser = map(
  tap(
    `link_reference`,
    seq(
      option(between(char(C_SPACE), 0, 3)),
      tap(
        `link_reference>[...]`,
        sandwiched(C_OPEN_BRACKET, C_CLOSE_BRACKET, {
          escapeSeq: C_BACK_SLASH,
        })
      )
      // matchOnly(lineEnding)
    )
  ),
  (r, end, start): LinkReference => {
    const text: string = r[1][1].replaceAll(
      C_BACK_SLASH + C_CLOSE_BRACKET,
      C_CLOSE_BRACKET
    )
    return {
      type: 'link_reference',
      text,
      identifier: text.toLocaleLowerCase(),
      ...toLoC({ end, start }),
    }
  }
)
