import escapeHTML from 'https://deno.land/x/lodash/escape.js'
import {
  Document,
  CodeBlock,
  List,
  ListItem,
  Paragraph,
  Str,
  BlockQuote,
  FIXME_All_Nodes,
  Heading,
  ThematicBreak,
  Emphasis,
  Strong,
  Code,
  HTML,
  LinkReferenceDefinition,
} from '../ast.ts'
import { C_NEWLINE } from '../scanner.ts'

export type Option = {}

export class HtmlRenderer {
  render(doc: Document, _options: Option): string {
    return (
      doc.children
        .filter((c) => c.type !== 'empty_line')
        .map((c) => this.renderNode(c))
        .join('\n') + '\n'
    )
  }

  private renderNode(node: FIXME_All_Nodes): string {
    switch (node.type) {
      case 'code_block':
        return this.renderCodeBlock(node)
      case 'list':
        return this.renderList(node)
      case 'block_quote':
        return this.renderBlockQuote(node)
      case 'thematic_break':
        return this.renderThematicBreak(node)
      case 'paragraph':
        return this.renderParagraph(node)
      case 'heading':
        return this.renderHeading(node)
      case 'html':
        return this.renderHTML(node)
      case 'str':
        return this.renderString(node)
      case 'empty_line':
        return C_NEWLINE
      case 'link_reference_definition':
        return this.renderLinkReferenceDefinition(node)
      default:
        throw new Error(`Unexpected node: ${JSON.stringify(node, null, 2)}`)
    }
  }

  private renderBlockQuote(node: BlockQuote): string {
    return `<blockquote>\n${node.children.map((c) =>
      this.renderNode(c)
    )}\n</blockquote>`
  }

  private renderCodeBlock(node: CodeBlock): string {
    const lang = node.language ? ` class="language-${node.language}"` : ''
    return `<pre><code${lang}>${escapeHTML(node.text)}</code></pre>`
  }

  private renderList(node: List): string {
    const tag = node.listType === 'bullet_list_marker' ? 'ul' : 'ol'
    return `<${tag}>\n${node.children
      .map((c) => this.renderListItem(c))
      .join(
        // FIXME: It may cause a problem.
        '\n'
      )}\n</${tag}>`
  }

  private renderListItem(node: ListItem): string {
    if (!node.children.map) {
      console.log(node)
    }
    return `<li>${this.breakIfBlock(
      node.children.map((c) => this.renderNode(c)).join('')
    )}</li>`
  }

  private renderHeading(node: Heading): string {
    const tag = `h${node.level}`
    return `<${tag}>${escapeHTML(
      node.children.map((c) => this.renderString(c)).join('')
    )}</${tag}>`
  }

  private renderLinkReferenceDefinition(node: LinkReferenceDefinition): string {
    // Case 171: Both title and destination can contain backslash escapes and literal backslashes
    const processBackSlash = (str: string): string =>
      str?.replace(/\\([^a-zA-Z0-9])/g, '$1') ?? str

    return `<p><a href="${encodeURI(processBackSlash(node.url))}"${
      node.title ? ` title="${escapeHTML(processBackSlash(node.title))}"` : ''
    }>${node.text}</a></p>`
  }

  private renderThematicBreak(_: ThematicBreak): string {
    return `<hr />`
  }

  private renderParagraph(node: Paragraph): string {
    return `<p>${node.children
      .map((c) => this.renderString(c))
      .join('')
      .trimEnd()}</p>`
  }

  private renderString(node: Str): string {
    return node.children
      .map((child) => {
        switch (child.type) {
          case 'text':
            return (
              child.text
                // FIXME: Move it to heading parser (case 37)
                .replace(/ +$/, '')
                // FIXME: Fix the rule for escaping in paragraph (case 61)
                .replaceAll('"/>', '&quot;/&gt;')
            )
          case 'softbreak':
            return '\n'
          case 'linebreak':
            return '<br>'
          case 'code':
            return this.renderCode(child)
          case 'emph':
            return this.renderEmphasis(child)
          case 'strong':
            return this.renderStrong(child)
          case 'html':
            return this.renderHTML(child)
          default:
            throw new Error(`Unexpected type: ${JSON.stringify(child)}`)
        }
      })
      .join(' ')
  }

  private renderHTML(node: HTML): string {
    return node.text
  }

  private renderCode(node: Code): string {
    return `<code>${node.text}</code>`
  }

  private renderEmphasis(node: Emphasis): string {
    return `<em>${node.text}</em>`
  }

  private renderStrong(node: Strong): string {
    return `<em>${node.text}</em>`
  }

  private breakIfBlock(str: string): string {
    const prefix = str.startsWith('<') ? '\n' : ''
    const suffix = str.trim().endsWith('>') ? '\n' : ''
    return prefix + str + suffix
  }
}
