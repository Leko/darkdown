import { List, ListItem } from '../ast.ts'
import {
  atLeast,
  char,
  lazy,
  many,
  map,
  or,
  Parser,
  seq,
  tap,
} from '../parser-combinator.ts'
import { C_SPACE } from '../scanner.ts'
import { emptyLineParser } from './empty-line.ts'
import { indent } from './indent.ts'
import { indentedCodeBlockParser } from './indented-code-block.ts'
import { lineEnding } from './line-ending.ts'
import { listMarker } from './list-marker.ts'
import { toLoC } from './loc.ts'
import { paragraphParser } from './paragraph.ts'
import { strParser } from './str.ts'

// https://spec.commonmark.org/0.29/#list
export const listParser: Parser<List> = lazy(() =>
  map(
    tap('list', atLeast(listItemParser, 1)),
    (r, end, start): List => ({
      type: 'list',
      listType: r[0].marker.type,
      children: r,
      ...toLoC({ end, start }),
    })
  )
)

// https://spec.commonmark.org/0.29/#list-items
export const listItemParser: Parser<ListItem> = lazy(() =>
  map(
    tap(
      'list_item',
      seq(
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
      indent: r[0].length,
      marker: r[1],
      children: r[3],
      ...toLoC({ end, start }),
    })
  )
)
