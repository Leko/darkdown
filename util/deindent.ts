import { C_NEWLINE } from '../scanner.ts'

export function deindent(str: string, level: number) {
  if (level === 0) {
    return str
  }

  return str.replace(new RegExp(`^ {0,${level}}`, 'mg'), '')
}
