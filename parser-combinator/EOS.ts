import { ParseResult, ParseFailed } from './types.ts'

// End of string
export const EOS = () => (
  input: string,
  pos: number
): ParseResult<null> | ParseFailed => {
  if (input.length === pos) {
    return [true, null, pos]
  }
  return [false, null, pos]
}
