import { many } from './many.ts'
import { map } from './map.ts'
import { not } from './not.ts'
import { Parser } from './parser.ts'

export const until = (parser: Parser<any>) =>
  map(many(not(parser)), (result) => result.join(''))
