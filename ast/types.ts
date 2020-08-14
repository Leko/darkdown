// [line, col]
export type Position = [number, number]

// [start, end]
export type TextRange = [Position, Position]

export type LoC = {
  start: number
  length: number
}

export type ASTText<T> = T &
  LoC & {
    text: string
  }
export type ASTNode<T extends { children: any[] }> = T & LoC
