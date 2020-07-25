import { Parser } from '../parser-combinator.ts'
import { sandwiched } from '../parsers/sandwiched.ts'

export const wrapped = <T>(
  char: string,
  option?: { intercept: Parser<T>; escapeSeq?: string }
) => sandwiched(char, char, option)
