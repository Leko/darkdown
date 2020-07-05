import { Parser, ParseResult, ParseFailed } from './types.ts'
import { many } from './many.ts'
import { not } from './not.ts'
import { map } from './map.ts'

export const until = (parser: Parser<any>) =>
  map(many(not(parser)), (result) => result.join(''))
