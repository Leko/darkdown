// [line, col]
export type Position = [number, number]

// [start, end]
export type TextRange = [Position, Position]

export interface LoC {
  start: number
  length: number
}

export interface ASTText extends LoC {
  text: string
}

export interface ASTNode extends LoC {
  children: never[]
}
