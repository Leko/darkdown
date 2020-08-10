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
  not,
  or,
  seq,
  option,
  tap,
  between,
  atLeast,
} from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { sandwiched } from './sandwiched.ts'
import { wrapped } from './wrapped.ts'
import { lineEnding } from './line-ending.ts'
import { anyWhitespaces } from './whitespaces.ts'
import { LinkDefinition } from '../ast.ts'
import { toLoC } from './loc.ts'
import { emptyLineParser } from './empty-line.ts'
import { space } from './space.ts'

const spaces = or(
  seq(atLeast(char(C_SPACE), 0), char(C_NEWLINE), atLeast(char(C_SPACE), 0)),
  atLeast(char(C_SPACE), 1)
)

// https://spec.commonmark.org/0.29/#link-reference-definitions
export const linkDefinitionParser = map(
  tap(
    'link_definition',
    seq(
      tap('link_definition>SOL', SOL()),
      tap('link_definition>spaces', between(space, 0, 3)),
      map(
        tap(
          'link_definition>[label]',
          sandwiched(C_OPEN_BRACKET, C_CLOSE_BRACKET, {
            escapeSeq: C_BACK_SLASH,
          })
        ),
        (r) => r[1]
      ),
      tap('link_definition>:', keyword(C_COLON)),
      // The link destination may not be omitted:
      map(
        tap(
          'link_definition>URL',
          seq(
            tap('link_definition>spaces', option(spaces)),
            or(
              map(
                seq(
                  tap(
                    'link_definition><url>',
                    sandwiched(C_LESS_THAN, C_GREATER_THAN)
                  )
                ),
                (r) => r[0][1]
              ),
              tap(
                'link_definition>URL>url',
                map(atLeast(not(char(C_SPACE + C_NEWLINE)), 1), (r) =>
                  r.join('')
                )
              )
            )
          )
        ),
        (r) => r[1]
      ),
      or(
        map(
          seq(
            tap(
              'link_definition>TITLE',
              seq(
                tap('link_definition>spaces', option(spaces)),
                tap(
                  'link_definition>or',
                  or(
                    tap(
                      `link_definition>${C_SINGLE_QUOTE}...${C_SINGLE_QUOTE}`,
                      wrapped(C_SINGLE_QUOTE, { intercept: emptyLineParser })
                    ),
                    tap(
                      `link_definition>${C_DOUBLE_QUOTE}...${C_DOUBLE_QUOTE}`,
                      wrapped(C_DOUBLE_QUOTE, { intercept: emptyLineParser })
                    )
                  )
                ),
                tap('link_definition>anyWhitespaces', anyWhitespaces),
                tap('link_definition>lineEnding', lineEnding)
              )
            )
          ),
          (r) => r[0][1][1]
        ),
        // Case 167: The title may be omitted
        tap(
          'link_definition>lineEnding',
          map(lineEnding, () => null)
        )
      ),
      tap('link_definition>(emptyLine)', option(emptyLineParser))
    )
  ),
  (r, end, start): LinkDefinition => ({
    type: 'link_definition',
    url: r[4],
    title: r[5],
    label: r[2].replaceAll(C_BACK_SLASH + C_CLOSE_BRACKET, C_CLOSE_BRACKET),
    children: [],
    ...toLoC({ end, start }),
  })
)
