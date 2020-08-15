import { CodeBlock } from '../ast.ts'
import {
  atLeast,
  between,
  capture,
  EOS,
  keyword,
  many,
  map,
  option,
  or,
  seq,
  tap,
  until,
} from '../parser-combinator.ts'
import { C_GRAVE_ACCENT, C_TILDE } from '../scanner.ts'
import { deindent } from '../util/deindent.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'
import { SOL } from './sol.ts'
import { space } from './space.ts'

// https://spec.commonmark.org/0.29/#fenced-code-blocks
const fencedCodeBlockParserGenerator = (
  sep: typeof C_TILDE | typeof C_GRAVE_ACCENT
) =>
  tap(
    `fenced_code_block(${sep})`,
    capture(({ capture, ifMatch }) =>
      seq(
        tap('fenced_code_block>SOL', SOL()),
        tap('fenced_code_block>indentation', option(between(space, 1, 3))),
        tap(
          `fenced_code_block>${sep}${sep}${sep}(READING)`,
          capture(atLeast(keyword(sep), 3))
        ),
        option(
          seq(
            tap('fenced_code_block>indentation', many(space)),
            tap('fenced_code_block>many', until(or(space, lineEnding))),
            tap('fenced_code_block>indentation', many(space)),
            tap('fenced_code_block>many', until(lineEnding))
          )
        ),
        tap('fenced_code_block>lineEnding', lineEnding),
        seq(
          // Case 94: The closing code fence must be at least as long as the opening fence
          tap(
            'fenced_code_block>content',
            until(
              or(
                EOS(),
                ifMatch((opening) =>
                  atLeast(keyword(sep), (opening as string[]).length)
                )
              )
            )
          ),
          or(
            // Case 96: Unclosed code blocks are closed by the end of the document (or the enclosing block quote or list item):
            map(EOS(), () => null),
            seq(
              tap(
                'fenced_code_block>option',
                option(seq(between(space, 1, 3)))
              ),
              tap(
                `fenced_code_block>${sep}${sep}${sep}(TRAILING)`,
                or(
                  EOS(),
                  ifMatch((opening) =>
                    atLeast(keyword(sep), (opening as string[]).length)
                  )
                )
              ),
              tap('fenced_code_block>lineEnding', lineEnding)
            )
          )
        )
      )
    )
  )

export const fencedCodeBlockParser = map(
  or(
    fencedCodeBlockParserGenerator(C_TILDE),
    fencedCodeBlockParserGenerator(C_GRAVE_ACCENT)
  ),
  (r, end, start): CodeBlock => {
    const [, indentation, , meta, , ...rest] = r
    const deindentLevel = indentation ? indentation.length : 0
    // @ts-expect-error Element implicitly has an 'any' type because expression of type '1' can't be used to index type 'Str'.
    const language = meta ? meta[1] || null : null
    // @ts-expect-error Element implicitly has an 'any' type because expression of type '1' can't be used to index type 'Str'.
    const info = meta ? meta[3] || null : null
    if (!Array.isArray(rest)) {
      return {
        type: 'code_block',
        text: '',
        language,
        info,
        ...toLoC({ end, start }),
      }
    }

    // Case 101-103 Fences can be indented. If the opening fence is indented, content lines will have equivalent opening indentation removed, if present:
    const code = deindent(rest[0][0], deindentLevel)
      // FIXME: Fix parser (fenced_code_block>content)
      .replace(/ +$/, '')

    return {
      type: 'code_block',
      text: code,
      language,
      info,
      ...toLoC({ end, start }),
    }
  }
)
