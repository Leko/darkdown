import { Text } from '../ast.ts'
import { atLeast, EOS, map, nor, Parser, tap } from '../parser-combinator.ts'
import { lineEnding } from './line-ending.ts'
import { toLoC } from './loc.ts'

export const textParser = (except?: Parser<any>): Parser<Text> =>
  map(
    tap(
      'text',
      atLeast(nor(...[except as any, lineEnding, EOS()].filter(Boolean)), 1)
    ),
    (r, end, start): Text => ({
      type: 'text',
      text: r
        .join('')
        // FIXME: Is it right handling?
        .replace(/\\#/g, '#') // case 35
        .replace(/\\>/g, '>') // case 72
        .replace(/\\-/g, '-'),
      ...toLoC({ end, start }),
    })
  )
