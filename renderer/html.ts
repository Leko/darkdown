import escapeHTML from 'https://deno.land/x/lodash@4.17.15-es/escape.js'
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
  LinkReference,
  LinkDefinition,
  Text,
  ASTNode,
} from '../ast.ts'
import { C_NEWLINE } from '../scanner.ts'

export type Option = {}

export class HtmlRenderer {
  render(doc: Document, _options: Option): string {
    const ignoredTypes: FIXME_All_Nodes['type'][] = [
      'empty_line',
      'link_definition',
    ]
    return (
      doc.children
        .filter((c) => !ignoredTypes.includes(c.type))
        .map((c) => this.renderNode(c, doc))
        .join('\n') + '\n'
    ).trimStart()
  }

  private renderNode(node: FIXME_All_Nodes, doc: Document): string {
    switch (node.type) {
      case 'code_block':
        return this.renderCodeBlock(node, doc)
      case 'list':
        return this.renderList(node, doc)
      case 'block_quote':
        return this.renderBlockQuote(node, doc)
      case 'thematic_break':
        return this.renderThematicBreak(node)
      case 'paragraph':
        return this.renderParagraph(node, doc)
      case 'heading':
        return this.renderHeading(node, doc)
      case 'html':
        return this.renderHTML(node)
      case 'str':
        return this.renderString(node, doc)
      case 'empty_line':
        return C_NEWLINE
      case 'link_definition':
        return ''
      default:
        throw new Error(`Unexpected node: ${JSON.stringify(node, null, 2)}`)
    }
  }

  private renderBlockQuote(node: BlockQuote, doc: Document): string {
    const content = node.children
      .map((c) => this.renderNode(c, doc))
      .filter(Boolean)
    return `<blockquote>${
      content.length > 0 ? `\n${content.join('')}` : ''
    }\n</blockquote>`
  }

  private renderCodeBlock(node: CodeBlock, doc: Document): string {
    const lang = node.language ? ` class="language-${node.language}"` : ''
    return `<pre><code${lang}>${escapeHTML(node.text)}</code></pre>`
  }

  private renderList(node: List, doc: Document): string {
    const tag = node.listType === 'bullet_list_marker' ? 'ul' : 'ol'
    return `<${tag}>\n${node.children
      .map((c) => this.renderListItem(c, doc))
      .join(
        // FIXME: It may cause a problem.
        '\n'
      )}\n</${tag}>`
  }

  private renderListItem(node: ListItem, doc: Document): string {
    if (!node.children.map) {
      console.log(node)
    }
    return `<li>${this.breakIfBlock(
      node.children.map((c) => this.renderNode(c, doc)).join('')
    )}</li>`
  }

  private renderHeading(node: Heading, doc: Document): string {
    const tag = `h${node.level}`
    return `<${tag}>${node.children
      .map((c) => this.renderString(c, doc))
      .join('')}</${tag}>`
  }

  private renderLinkReference(node: LinkReference, doc: Document): string {
    const definition = this.findLinkDefinition(node.identifier, doc)
    if (!definition) {
      return `[${node.text}]`
    }

    // Case 171: Both title and destination can contain backslash escapes and literal backslashes
    const processBackSlash = (str: string): string =>
      str?.replace(/\\([^a-zA-Z0-9])/g, '$1') ?? str
    const url = encodeURI(processBackSlash(definition.url))
    const title = definition.title
      ? ` title="${escapeHTML(processBackSlash(definition.title))}"`
      : ''
    return `<a href="${url}"${title}>${node.text}</a>`
  }

  private renderThematicBreak(_: ThematicBreak): string {
    return `<hr />`
  }

  private renderParagraph(node: Paragraph, doc: Document): string {
    return `<p>${node.children
      .map((c) => this.renderString(c, doc))
      .join('')
      .trimEnd()}</p>`
  }

  private renderString(node: Str, doc: Document): string {
    return node.children
      .map((child) => {
        switch (child.type) {
          case 'text':
            return this.renderText(child)
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
          case 'link_reference':
            return this.renderLinkReference(child, doc)
          default:
            throw new Error(`Unexpected type: ${JSON.stringify(child)}`)
        }
      })
      .join('')
  }

  private renderText(node: Text): string {
    return (
      escapeHTML(node.text)
        // FIXME: Move it to heading parser (case 37)
        .replace(/ +$/, '')
        // case 166
        .replaceAll('&#39;', "'")
    )
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

  private findLinkDefinition(
    identifier: string,
    node: Document | FIXME_All_Nodes
  ): LinkDefinition | undefined {
    if (node.type === 'link_definition' && node.identifier === identifier) {
      return node as LinkDefinition
    }
    const children: FIXME_All_Nodes[] = (node as any).children || []
    for (let child of children) {
      const found = this.findLinkDefinition(identifier, child)
      if (found) {
        return found
      }
    }
  }
}
