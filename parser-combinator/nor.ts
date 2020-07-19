import { Parser } from './types.ts'
import { not } from './not.ts'
import { or } from './or.ts'

export const nor = (...parsers: Parser<any>[]) => not(or(...parsers))
