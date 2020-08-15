import { Parser,  } from './types.ts'

// End of string
export const EOS = () => (
  input: string,
  pos: number
): Parser<boolean> => {
  if (input.length === pos) {
    return [true, true, pos]
  }
  return [false, null, pos]
}
