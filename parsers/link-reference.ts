import { LinkReference } from '../ast.ts'
import {
  between,
  char,
  map,
  option,
  Parser,
  seq,
  tap,
} from '../parser-combinator.ts'
import {
  C_BACK_SLASH,
  C_CLOSE_BRACKET,
  C_OPEN_BRACKET,
  C_SPACE,
} from '../scanner.ts'
import { toLoC } from './loc.ts'
import { sandwiched } from './sandwiched.ts'

// https://spec.commonmark.org/0.29/#link-reference-definitions
export const linkReferenceParser: Parser<LinkReference> = map(
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
