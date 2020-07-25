import { map, atLeast, tap, EOS, nor, Parser } from '../parser-combinator.ts'
import { toLoC } from './loc.ts'
import { lineEnding } from './line-ending.ts'
import { Text } from '../ast.ts'

export const textParser = (except?: Parser<any>) =>
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
