import { Position, TextRange } from './ast.ts'
import { occurence } from './util/occurence.ts'
import { CodeFrame } from './code-frame.ts'

export const C_NEWLINE = '\u000A'
export const C_CARRIAGE_RETURN = '\u000D'
export const C_SPACE = '\u0020'
export const C_TAB = '\u0009'
export const C_LINE_TABULATION = '\u000B'
export const C_FORM_FEED = '\u000C'
export const C_REPLACEMENT = '\uFFFD'

// https://spec.commonmark.org/0.29/#insecure-characters
export const C_NULL = '\u0000'

// https://spec.commonmark.org/0.29/#whitespace-character
// https://www.compart.com/en/unicode/category/Zs
export const C_NBSP = '\u00A0'
export const C_OGHAM_SPACE_MARK = '\u1680'
export const C_EN_QUAD = '\u2000'
export const C_EM_QUAD = '\u2001'
export const C_EN_SPACE = '\u2002'
export const C_EM_SPACE = '\u2003'
export const C_THREE_PER_EM_SPACE = '\u2004'
export const C_FOUR_PER_EM_SPACE = '\u2005'
export const C_SIX_PER_EM_SPACE = '\u2006'
export const C_FIGURE_SPACE = '\u2007'
export const C_PUNCTUATION_SPACE = '\u2008'
export const C_THIN_SPACE = '\u2009'
export const C_HAIR_SPACE = '\u200A'
export const C_NNBSP = '\u202F'
export const C_MMSP = '\u205F'
export const C_IDEOGRAPHIC_SPACE = '\u3000'

// https://spec.commonmark.org/0.29/#ascii-punctuation-character
export const C_EXCLAMATION = '!'
export const C_DOUBLE_QUOTE = '"'
export const C_SHARP = '#'
export const C_DOLLAR = '$'
export const C_PERCENT = '%'
export const C_AMPERSAND = '&'
export const C_SINGLE_QUOTE = "'"
export const C_OPEN_PARENTHES = '('
export const C_CLOSE_PARENTHES = ')'
export const C_ASTERISK = '*'
export const C_PLUS = '+'
export const C_COMMA = ','
export const C_HYPHEN = '-'
export const C_DOT = '.'
export const C_SLASH = '/'
export const C_COLON = ':'
export const C_SEMICOLON = ';'
export const C_LESS_THAN = '<'
export const C_EQUAL = '='
export const C_GREATER_THAN = '>'
export const C_QUESTION = '?'
export const C_AT_SIGN = '@'
export const C_OPEN_BRACKET = '['
export const C_BACK_SLASH = '\\'
export const C_CLOSE_BRACKET = ']'
export const C_CARET = '^'
export const C_UNDERLINE = '_'
export const C_GRAVE_ACCENT = '`'
export const C_OPEN_BRACE = '{'
export const C_VERTICAL_BAR = '|'
export const C_CLOSE_BRACE = '}'
export const C_TILDE = '~'

type TokenContainer<T extends { value: string }> = T & {
  sourcepos: TextRange
}

type Space = TokenContainer<{
  type: 'SPACE'
  leading: boolean
  trailing: boolean
  value: string
}>
type Hyphen = TokenContainer<{
  type: 'HYPHEN'
  leading: boolean
  value: typeof C_HYPHEN
}>
type Plus = TokenContainer<{
  type: 'PLUS'
  leading: boolean
  value: typeof C_PLUS
}>
type Asterisk = TokenContainer<{
  type: 'ASTERISK'
  leading: boolean
  value: typeof C_ASTERISK
}>
type Newline = TokenContainer<{
  type: 'NEWLINE'
  value: typeof C_NEWLINE
}>
type NullByte = TokenContainer<{
  type: 'NULL'
  value: typeof C_NULL
}>
type UnicodeSpace = TokenContainer<{
  type: 'UNICODE_SPACE'
  value: string
}>
type OrderedListMarker = TokenContainer<{
  type: 'ORDERED_LIST_MARKER'
  value: string
}>
type Characters = TokenContainer<{
  type: 'CHARACTERS'
  value: string
}>
type EOF = TokenContainer<{
  type: 'EOF'
  value: ''
}>

export type Token =
  | EOF
  | Space
  | Hyphen
  | Plus
  | Asterisk
  | Newline
  | NullByte
  | UnicodeSpace
  | OrderedListMarker
  | Characters
  | TokenContainer<{ type: 'unknown'; value: string }>

export type TokenType = Token['type']

const LINE_START = 1
const COL_START = 1

export class Scanner {
  #line: number = LINE_START
  #col: number = COL_START
  #pos: number = 0
  #markdown: string = ''

  initialize(markdown: string) {
    this.#markdown = markdown
    this.#line = LINE_START
    this.#col = COL_START
    this.#pos = 0
  }

  rest(): string {
    return this.#markdown.slice(this.#pos)
  }

  peek(len: number): string {
    return this.#markdown.slice(this.#pos, this.#pos + len)
  }

  next(str: string, len: number): string {
    const start = this.#pos + str.length
    return this.#markdown.slice(start, start + len)
  }

  match(str: string): string | null {
    if (this.peek(str.length) === str) {
      return str
    }
    return null
  }

  take(len: number): string {
    const ret = this.#markdown.slice(this.#pos, this.#pos + len)
    for (let i = 0; i < len; i++) {
      if (this.isNewline(this.#markdown[this.#pos + i])) {
        this.#line += 1
        this.#col = COL_START
      } else {
        this.#col += 1
      }
    }
    this.#pos += len
    return ret
  }

  isWhitespace(char: string): boolean {
    return (
      this.isNewline(char) ||
      char === C_CARRIAGE_RETURN ||
      char === C_SPACE ||
      char === C_TAB ||
      char === C_LINE_TABULATION ||
      char === C_FORM_FEED ||
      char === C_NULL ||
      char === C_REPLACEMENT
    )
  }

  isUnicodeWhitespace(char: string): boolean {
    return (
      char === C_NBSP ||
      char === C_OGHAM_SPACE_MARK ||
      char === C_EN_QUAD ||
      char === C_EM_QUAD ||
      char === C_EN_SPACE ||
      char === C_EM_SPACE ||
      char === C_THREE_PER_EM_SPACE ||
      char === C_FOUR_PER_EM_SPACE ||
      char === C_SIX_PER_EM_SPACE ||
      char === C_FIGURE_SPACE ||
      char === C_PUNCTUATION_SPACE ||
      char === C_THIN_SPACE ||
      char === C_HAIR_SPACE ||
      char === C_NNBSP ||
      char === C_MMSP ||
      char === C_IDEOGRAPHIC_SPACE
    )
  }

  isNewline(char: string): boolean {
    return char === C_NEWLINE
  }

  matchOrderedListMarker(chars: string): string | null {
    // FIXME: Avoid to using RegExp
    // FIXME: Hard code space
    const matched = chars.match(/^\d+[\.\)] /)
    if (matched === null) {
      return null
    }

    return matched[0]
  }

  isCharacter(char: string): boolean {
    return (
      char.length > 0 &&
      !this.isWhitespace(char) &&
      !this.isNewline(char) &&
      !this.isUnicodeWhitespace(char)
    )
  }

  takeWhitespaces(): string {
    let whitespaces = ''
    while (this.isWhitespace(this.peek(1))) {
      whitespaces += this.take(1)
    }
    return whitespaces
  }

  takeCharacters(): string {
    let characters = ''
    while (this.isCharacter(this.peek(1))) {
      characters += this.take(1)
    }
    return characters
  }

  getPosition(): Position {
    return this.offsetPosition(0)
  }

  offsetPosition(offset: number): Position {
    if (offset === 0) {
      return [this.#line, this.#col]
    }

    if (offset < 0) {
      const start = this.#pos + offset
      const end = this.#pos

      const subStr = this.#markdown.slice(start, end)
      const newlines = occurence(subStr, C_NEWLINE)

      const lastIndex = this.#markdown.lastIndexOf(C_NEWLINE, start)
      const col =
        lastIndex === -1 ? this.#col : this.#col - (this.#pos - lastIndex)
      return [this.#line - newlines, col]
    } else {
      const start = this.#pos
      const end = this.#pos + offset

      const subStr = this.#markdown.slice(start, end)
      const newlines = occurence(subStr, C_NEWLINE)

      const lastIndex = subStr.lastIndexOf(C_NEWLINE)
      const col = lastIndex === -1 ? 1 : lastIndex + 1
      return [this.#line + newlines, col]
    }
  }

  leadingSpaces(): string {
    let chars = ''
    const restChars = this.#markdown.slice(
      this.#pos - (this.#col - 1),
      this.#pos
    )
    for (let c of restChars) {
      if (!this.isWhitespace(c)) break
      chars += c
    }
    return chars
  }

  leadingSpacesUntilCol(): boolean {
    const spaces = this.leadingSpaces()
    return spaces.length === this.#col - 1
  }

  scan(markdown: string): Token[] {
    const tokens: Token[] = []
    this.initialize(markdown)

    while (this.#pos < this.#markdown.length) {
      let matched: string | null = null
      let char = this.peek(1)
      const leadingExactly = this.#col === COL_START
      const leadingWithSpaces = leadingExactly || this.leadingSpacesUntilCol()
      const __debugPosition = this.getPosition()
      switch (char) {
        case C_TAB:
        case C_SPACE: {
          const trailing = this.isNewline(this.next(char, 1))
          const position = this.getPosition()
          tokens.push({
            type: 'SPACE',
            value: this.takeWhitespaces(),
            leading: leadingExactly,
            trailing,
            sourcepos: [position, this.getPosition()],
          })
          break
        }
        case C_HYPHEN: {
          const position = this.getPosition()
          this.take(1)
          tokens.push({
            type: 'HYPHEN',
            value: C_HYPHEN,
            leading: leadingWithSpaces,
            sourcepos: [position, this.getPosition()],
          })
          break
        }
        case C_HYPHEN: {
          const position = this.getPosition()
          this.take(1)
          tokens.push({
            type: 'PLUS',
            value: C_PLUS,
            leading: leadingWithSpaces,
            sourcepos: [position, this.getPosition()],
          })
          break
        }
        case C_HYPHEN: {
          const position = this.getPosition()
          this.take(1)
          tokens.push({
            type: 'ASTERISK',
            value: C_ASTERISK,
            leading: leadingWithSpaces,
            sourcepos: [position, this.getPosition()],
          })
          break
        }
        // case '*':
        //   break
        // case '>':
        //   break
        // case '<':
        //   break
        // case '#':
        //   break
        case C_NEWLINE:
          tokens.push({
            type: 'NEWLINE',
            value: C_NEWLINE,
            sourcepos: [this.getPosition(), this.offsetPosition(char.length)],
          })
          this.take(char.length)
          break
        case C_NULL:
          tokens.push({
            type: 'NULL',
            value: C_NULL,
            sourcepos: [this.getPosition(), this.offsetPosition(char.length)],
          })
          this.take(char.length)
          break
        default:
          if (this.isUnicodeWhitespace(char)) {
            tokens.push({
              type: 'UNICODE_SPACE',
              value: char,
              sourcepos: [this.getPosition(), this.offsetPosition(char.length)],
            })
            this.take(1)
          } else if (
            leadingWithSpaces &&
            this.matchOrderedListMarker(this.rest())
          ) {
            const chars = this.matchOrderedListMarker(this.rest())!
            const position = this.getPosition()
            tokens.push({
              type: 'ORDERED_LIST_MARKER',
              value: chars,
              sourcepos: [position, this.offsetPosition(chars.length)],
            })
            this.take(chars.length)
          } else if (this.isCharacter(char)) {
            matched = this.takeCharacters()
            tokens.push({
              type: 'CHARACTERS',
              value: matched,
              sourcepos: [this.getPosition(), this.offsetPosition(char.length)],
            })
          } else {
            matched = char
            tokens.push({
              type: 'unknown',
              value: char,
              sourcepos: [
                [0, 0],
                [0, 0],
              ],
            })
          }
      }

      if (this.getPosition().join(',') === __debugPosition.join(',')) {
        const pos = this.getPosition()
        throw new CodeFrame(
          `Infinity loop detected (${pos.join(',')})`,
          markdown,
          pos
        )
      }
    }
    tokens.push({
      type: 'EOF',
      value: '',
      sourcepos: [
        [this.#line, this.#col],
        [this.#line, this.#col],
      ],
    })
    console.log(tokens)
    return tokens
  }
}
