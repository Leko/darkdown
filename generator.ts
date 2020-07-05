import { Document, CodeBlock, List, ListItem } from './ast.ts'

export class Generator {
  generate(doc: Document): string {
    let html = ''
    for (let node of doc.children) {
      switch (node.type) {
        case 'code_block':
          html += this.renderCodeBlock(node)
          break
        case 'list':
          // @ts-ignore FIXME
          html += this.renderList(node)
          break
      }
    }
    return html
  }

  private renderCodeBlock(node: CodeBlock): string {
    return `<pre><code>${node.text}</code></pre>\n`
  }

  private renderList(node: List): string {
    const tag = node.listType === 'Bullet' ? 'ul' : 'ol'
    return `<${tag}>${node.children.map((c) =>
      // @ts-ignore FIXME
      this.renderListItem(c)
    )}</${tag}>`
  }

  private renderListItem(node: ListItem): string {
    return `<li></li>`
  }
}
