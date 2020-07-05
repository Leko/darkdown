import { Token, TokenType, C_TAB } from './scanner.ts'
import { Document, FIXME_All_Notes } from './ast.ts'
import { convertTabToSpaces } from './util/tab-stop.ts'

// Remove it
const K_INDENT = ''

export class Parser {
  #cursor: number = 0
  #tokens: Token[] = []

  initialize(tokens: Token[]) {
    this.#tokens = tokens
    this.#cursor = 0
  }

  peek(): Token {
    const token = this.#tokens[this.#cursor]
    if (!token) {
      throw new RangeError(
        `OutOfBounds: cursor=${this.#cursor}, len=${this.#tokens.length}`
      )
    }
    return token
  }

  match(type: TokenType): Token | null {
    if (this.peek().type === type) {
      return this.peek()
    }
    return null
  }

  eat(): Token {
    const token = this.peek()
    this.#cursor++
    return token
  }

  eatUntil(type: TokenType): Token[] {
    const tokens: Token[] = []
    while (this.peek().type !== 'EOF' && this.peek().type !== type) {
      tokens.push(this.eat())
    }
    return tokens
  }

  eatUntilInclusive(type: TokenType): Token[] {
    return this.eatUntil(type).concat(this.eat())
  }

  eatDuring(type: TokenType): Token[] {
    const tokens: Token[] = []
    while (this.peek().type !== 'EOF' && this.peek().type === type) {
      tokens.push(this.eat())
    }
    return tokens
  }

  mergeTokens(tokens: Token[]): string {
    let str = ''
    for (let t of tokens) {
      str += t.value
    }
    return str
  }

  parse(tokens: Token[]): Document {
    const children: FIXME_All_Notes[] = []

    this.initialize(tokens)
    while (this.#cursor < this.#tokens.length) {
      const token = this.peek()
      console.log(token)
      switch (token.type) {
        case 'SPACE': {
          if (token.leading) {
            const spaces = convertTabToSpaces(token.value)
            if (spaces.startsWith(K_INDENT)) {
              let t = token
              // FIXME: Is it needed?
              let text = spaces.slice(K_INDENT.length)
              while (t.type === 'SPACE' && t.leading) {
                this.eat()
                text += this.mergeTokens(this.eatUntilInclusive('NEWLINE'))
                // @ts-ignore It may not be space
                t = this.peek()
              }
              children.push({
                type: 'code_block',
                language: null,
                info: null,
                text,
                sourcepos: token.sourcepos,
              })
            } else {
              console.log('Not enough spaces:', token)
              this.eat()
            }
          } else {
            console.log('Is not trailing:', token)
            this.eat()
          }
          break
        }
        case 'HYPHEN':
        case 'PLUS':
        case 'ASTERISK': {
          if (token.leading) {
            const start = token.sourcepos
            const listItem: any[] = []
            let t = token

            while (
              (t.type === 'ASTERISK' ||
                t.type === 'HYPHEN' ||
                t.type === 'PLUS') &&
              t.leading
            ) {
              this.eat()
              const tokens = this.eatUntilInclusive('NEWLINE')
              // @ts-ignore It may not be list item
              t = this.peek()
            }
            children.push({
              type: 'list',
              listStart: 1,
              listType: 'Bullet',
              listDelimiter: null,
              listTight: false, // ??
              children: listItem,
              sourcepos: [start[0], this.peek().sourcepos[1]],
            })
            break
          }
        }
        case 'EOF':
          this.eat()
          break
        default:
          console.warn(`Skip:`, token)
          this.eat()
      }
    }

    return {
      type: 'document',
      children,
      sourcepos: [
        [0, 0],
        [0, 0],
      ],
    }
  }
}
