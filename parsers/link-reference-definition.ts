import {
  C_SPACE,
  C_DOUBLE_QUOTE,
  C_SINGLE_QUOTE,
  C_COLON,
  C_LESS_THAN,
  C_GREATER_THAN,
  C_OPEN_BRACKET,
  C_CLOSE_BRACKET,
  C_BACK_SLASH,
  C_NEWLINE,
} from '../scanner.ts'
import {
  map,
  keyword,
  char,
  until,
  many,
  or,
  seq,
  option,
  not,
  tap,
  capture,
  between,
  atLeast,
} from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { sandwiched } from './sandwiched.ts'
import { wrapped } from './wrapped.ts'
import { lineEnding } from './line-ending.ts'
import { anyWhitespaces } from './whitespaces.ts'
import { LinkReferenceDefinition } from '../ast.ts'
import { toLoC } from './loc.ts'
import { emptyLineParser } from './empty-line.ts'
import { space } from './space.ts'

// https://spec.commonmark.org/0.29/#link-reference-definitions
export const linkReferenceDefinitionParser = map(
  capture(({ capture, ifMatch }) =>
    seq(
      tap('link_reference_definition>SOL', SOL()),
      tap('link_reference_definition>spaces', between(space, 0, 3)),
      capture(
        map(
          tap(
            'link_reference_definition>[label]',
            sandwiched(C_OPEN_BRACKET, C_CLOSE_BRACKET, {
              escapeSeq: C_BACK_SLASH,
            })
          ),
          (r) => r[1]
        )
      ),
      tap('link_reference_definition>:', keyword(C_COLON)),
      // The link destination may not be omitted:
      option(
        map(
          tap(
            'link_reference_definition>URL',
            seq(
              tap(
                'link_reference_definition>spaces',
                option(atLeast(char(C_SPACE + C_NEWLINE), 1))
              ),
              or(
                map(
                  seq(
                    tap(
                      'link_reference_definition><url>',
                      sandwiched(C_LESS_THAN, C_GREATER_THAN)
                    )
                  ),
                  (r) => r[0][1]
                ),
                tap(
                  'link_reference_definition>url',
                  until(char(C_SPACE + C_NEWLINE))
                )
              )
            )
          ),
          (r) => r[1]
        )
      ),
      // Case 167: The title may be omitted
      option(
        map(
          tap(
            'link_reference_definition>TITLE',
            seq(
              tap(
                'link_reference_definition>anyWhitespaces',
                option(atLeast(char(C_SPACE + C_NEWLINE), 1))
              ),
              tap(
                'link_reference_definition>or',
                or(
                  tap(
                    `link_reference_definition>${C_SINGLE_QUOTE}...${C_SINGLE_QUOTE}`,
                    wrapped(C_SINGLE_QUOTE, { intercept: emptyLineParser })
                  ),
                  tap(
                    `link_reference_definition>${C_DOUBLE_QUOTE}...${C_DOUBLE_QUOTE}`,
                    wrapped(C_DOUBLE_QUOTE, { intercept: emptyLineParser })
                  )
                )
              ),
              tap('link_reference_definition>anyWhitespaces', anyWhitespaces),
              tap('link_reference_definition>lineEnding', lineEnding)
            )
          ),
          (r) => r[1][1]
        )
      ),
      many(emptyLineParser),
      seq(
        option(atLeast(char(C_SPACE + C_NEWLINE), 1)),
        tap(
          `link_reference_definition>${C_OPEN_BRACKET}`,
          keyword(C_OPEN_BRACKET)
        ),
        ifMatch((r) =>
          tap(`link_reference_definition>${r}`, keyword(r as string))
        ),
        tap(
          `link_reference_definition>${C_CLOSE_BRACKET}`,
          keyword(C_CLOSE_BRACKET)
        )
      ),
      lineEnding
    )
  ),
  (r, end, start): LinkReferenceDefinition => ({
    type: 'link_reference_definition',
    url: r[4],
    title: r[5],
    text: r[2].replaceAll(C_BACK_SLASH + C_CLOSE_BRACKET, C_CLOSE_BRACKET),
    ...toLoC({ end, start }),
  })
)
