import { not } from './not.ts'
import { or } from './or.ts'
import { Parser } from './parser.ts'

export const nor = (...parsers: Parser<any>[]) => not(or(...parsers))
