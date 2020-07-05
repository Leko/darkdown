import { sandwiched } from '../parsers/sandwiched.ts'

export const wrapped = (char: string, option?: { escapeSeq?: string }) =>
  sandwiched(char, char, option)
