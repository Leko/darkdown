import { Parser } from './parser.ts'

// End of string
export const EOS = (): Parser<boolean> => (input: string, pos: number) => {
  if (input.length === pos) {
    return [true, true, pos]
  }
  return [false, null, pos]
}
