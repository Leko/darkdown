export const TODO = (name: string) => (input: string, pos: number) => {
  console.log('TODO:', [name, input.substr(pos, 1), pos])
  return [true, input.substr(pos, 1), pos + 1] as any
}
