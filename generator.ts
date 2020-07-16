import {
  Document,
  CodeBlock,
  List,
  ListItem,
  Paragraph,
  Str,
  BlockQuote,
  FIXME_All_Nodes,
} from './ast.ts'

export class Generator {
  generate(doc: Document): string {
    return doc.children.map((child) => this.renderNode(child)).join('\n')
  }

  private renderNode(node: FIXME_All_Nodes): string {
    switch (node.type) {
      case 'code_block':
        return this.renderCodeBlock(node)
      case 'list':
        return this.renderList(node)
      case 'block_quote':
        return this.renderBlockQuote(node)
      default:
        return ''
    }
  }

  private renderBlockQuote(node: BlockQuote): string {
    return `<blockquote>\n${node.children.map((c) =>
      this.renderNode(c)
    )}</blockquote>\n`
  }

  private renderCodeBlock(node: CodeBlock): string {
    console.log(JSON.stringify(node))
    return `<pre><code>${node.text}</code></pre>\n`
  }

  private renderList(node: List): string {
    const tag = node.listType === 'bullet_list_marker' ? 'ul' : 'ol'
    return `<${tag}>\n${node.children.map((c) =>
      // @ts-ignore FIXME
      this.renderListItem(c)
    )}\n</${tag}>`
  }

  private renderListItem(node: ListItem): string {
    return `<li>${node.children.map((c) => this.renderParagraph(c))}</li>\n`
  }

  private renderParagraph(node: Paragraph): string {
    return `\n<p>${node.children.map((c) => this.renderString(c))}</p>\n`
  }

  private renderString(node: Str): string {
    console.log({ node })
    return node.children.reduce((acc, child) => acc + child.text, '')
  }
}
