import { C_NEWLINE, C_CARRIAGE_RETURN } from '../scanner.ts'
import { char, seq, option } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#line-ending
export const lineEnding = seq(option(char(C_CARRIAGE_RETURN)), char(C_NEWLINE))
