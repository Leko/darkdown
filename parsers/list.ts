import { List } from '../ast.ts'
import { map, atLeast, tap } from '../parser-combinator.ts'
// FIXME: Circular dependency
// import { listItemParser } from '../parsers/list-item.ts'
import { ListItem } from '../ast.ts'
import { C_SPACE, C_NEWLINE } from '../scanner.ts'
import { char, many, seq, lazy, or, option } from '../parser-combinator.ts'
import { SOL } from './sol.ts'
import { lineEnding } from './line-ending.ts'
import { listMarker } from './list-marker.ts'
// FIXME: Circular dependency
// import { containerBlockParser } from './container-block.ts'
import { blockQuoteParser } from './block-quote.ts'
import { leafBlockParser } from './leaf-block.ts'
import { indentedCodeBlockParser } from './indented-code-block.ts'
import { strParser } from './str.ts'
import { paragraphParser } from './paragraph.ts'
import { indent } from './indent.ts'
import { toLoC } from './loc.ts'
import { emptyLineParser } from './empty-line.ts'

// https://spec.commonmark.org/0.29/#list
// @ts-expect-error
export const listParser = lazy(() =>
  map(
    tap('list', atLeast(listItemParser, 1)),
    (r, end, start): List => ({
      type: 'list',
      // @ts-expect-error
      listType: r[0].marker.type,
      // @ts-expect-error
      children: r,
      ...toLoC({ end, start }),
    })
  )
)

type TODO<Comment extends string> = any

// https://spec.commonmark.org/0.29/#list-items
// @ts-expect-error
export const listItemParser = lazy(() =>
  map(
    tap(
      'list_item',
      seq(
        tap('list_item>SOL', SOL()),
        tap('list_item>spaces', many(char(C_SPACE))),
        tap('list_item>marker', listMarker),
        tap('list_item>space', char(C_SPACE)),
        tap(
          'list_item>nest',
          or(
            map(seq(indent(2), listParser), (r) => [r[0]]),
            map(indentedCodeBlockParser, (r) => [r]),
            tap(
              'list_item>nest>map',
              map(
                seq(
                  paragraphParser,
                  atLeast(
                    seq(
                      emptyLineParser,
                      or(
                        map(
                          seq(indent(2), indentedCodeBlockParser),
                          (r) => r[1]
                        ),
                        paragraphParser
                      )
                    ),
                    1
                  )
                ),
                (r) => [r[0], ...r[1].flat()]
              )
            ),
            tap(
              'list_item>nest>map',
              map(seq(strParser(), lineEnding), (r) => [r[0]])
            ),
            tap('list_item>nest>map', char(C_SPACE))
          )
        )
      )
    ),
    (r, end, start): ListItem => ({
      type: 'list_item',
      indent: r[1].length,
      marker: r[2],
      children: r[4],
      // r
      //   .slice(4)
      //   .filter(
      //     (el: TODO<'Strongly typed'>) =>
      //       !(Array.isArray(el) && el[0] === null && el[1] === C_NEWLINE)
      //   ),
      ...toLoC({ end, start }),
    })
  )
)

// console.log(JSON.stringify(listParser('- hoge\n\n\t\tbar\n', 0), null, 2))

// Deno.exit(0)
