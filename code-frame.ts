import { Position } from './ast.ts'

export class CodeFrame extends Error {
  constructor(message: string, code: string, position: Position) {
    super(message)

    this.message = this.getCodeFrame(code, position) + '\n' + message
  }

  private getCodeFrame(code: string, position: Position) {
    const [line, col] = position
    const lines = code.split('\n')
    const startLine = Math.max(line - 2, 0)
    const endLine = Math.min(line + 1, lines.length)
    const targetLines = lines.slice(startLine, endLine)
    const erroredLine = line === 1 ? targetLines[0] : targetLines[1]

    return targetLines.join('\n')
  }
}
