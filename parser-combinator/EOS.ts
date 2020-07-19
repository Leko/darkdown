import { ParseResult, ParseFailed } from './types.ts'

// End of string
export const EOS = () => (
  input: string,
  pos: number
): ParseResult<boolean> | ParseFailed => {
  if (input.length === pos) {
    return [true, true, pos]
  }
  return [false, null, pos]
}
