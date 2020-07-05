import { C_NULL } from '../scanner.ts'
import { keyword } from '../parser-combinator.ts'

// https://spec.commonmark.org/0.29/#insecure-characters
export const insecureChar = keyword(C_NULL)
