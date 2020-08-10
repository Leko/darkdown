import { HtmlRenderer, Option as StringifyOption } from './renderer/html.ts'
import { Parser } from './parser-combinator/types.ts'
import { Document } from './ast.ts'
import { tap, many, or, seq, map, EOS } from './parser-combinator.ts'
import { leafBlockParser } from './parsers/leaf-block.ts'
import { containerBlockParser } from './parsers/container-block.ts'
import { blockQuoteParser } from './parsers/block-quote.ts'
import { listParser } from './parsers/list.ts'
import { codeBlockParser } from './parsers/code-block.ts'
import { emptyLineParser } from './parsers/empty-line.ts'
import { thematicBreakParser } from './parsers/thematic-break.ts'

type ParseOption = {}
type Result = {
  html: string
}

export const blockParser = or(
  blockQuoteParser,
  thematicBreakParser, // FIXME: Merge to leadBlockParser
  listParser,
  codeBlockParser,
  // headingParser,
  // thematicBreakParser
  // paragraphParser,
  leafBlockParser
)

// @ts-expect-error
export const documentParser: Parser<Document> = map(
  seq(
    many(tap('document > blockParser', blockParser)),
    tap('document > EOS', EOS())
  ),
  ([children]) => ({
    type: 'document',
    children,
  })
)

function tabToSpaces(str: string, tabStop: number): string {
  const convertToSpaces = (matchedEntire: string, matched: string) => {
    let start = matchedEntire.replace(/^\n+/, '').indexOf(matched)
    if (start === -1) {
      start = 0
    }
    const spaces = tabStop - (start % tabStop)
    console.log(JSON.stringify({ start, spaces, matchedEntire }, null, 2))
    return matchedEntire.replace(matched, ' '.repeat(spaces))
  }
  let tmp = str
  while (1) {
    const result = tmp.replace(/^[->]?\s*(\t)/gm, convertToSpaces)
    if (tmp === result) {
      break
    }
    tmp = result
  }
  return tmp
}

export async function transform(
  markdown: string,
  options: {
    parseOption?: ParseOption
    stringifyOption?: StringifyOption
  } = {
    parseOption: {},
    stringifyOption: {},
  }
): Promise<Result> {
  const parseOption: ParseOption = { ...options.parseOption }
  const stringifyOption: StringifyOption = { ...options.stringifyOption }
  return stringify(await parse(markdown, parseOption), stringifyOption)
}

export async function parse(
  markdown: string,
  options: ParseOption
): Promise<Document> {
  const prettyMD = tabToSpaces(markdown, 4)
  const result = documentParser(prettyMD, 0)
  if (!result[0]) {
    throw new Error(`Parse failed:\n${markdown}`)
  }
  const [,doc,pos] = result
  if (pos !== prettyMD.length) {
    throw new Error(`Unexpected token: "${markdown.slice(pos, pos + 1)}"`)
  }
  return doc
}

export async function stringify(
  doc: Document,
  options: StringifyOption
): Promise<Result> {
  const generator = new HtmlRenderer()
  console.log(JSON.stringify(doc, null, 2))
  let html = generator.render(doc, options)
  return {
    html,
  }
}
