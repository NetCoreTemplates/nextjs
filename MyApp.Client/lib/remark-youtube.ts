import { visit } from 'unist-util-visit'
import type { Root, Paragraph, Text } from 'mdast'

/**
 * Remark plugin to transform :::youtube directives into embedded YouTube iframes
 *
 * Syntax:
 * :::youtube VIDEO_ID
 * Video Title
 * :::
 */
export default function remarkYoutube() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (!parent || index === undefined) return

      // Check if this paragraph contains a youtube directive
      const firstChild = node.children[0]
      if (firstChild?.type !== 'text') return

      const text = (firstChild as Text).value

      // Match the pattern: :::youtube VIDEO_ID\nTitle\n:::
      const youtubePattern = /^:::youtube\s+([^\s\n]+)\s*\n(.+?)\n:::$/s
      const match = text.match(youtubePattern)

      if (match) {
        const videoId = match[1].trim()
        const title = match[2].trim()

        // Create the HTML node for the YouTube embed
        const htmlNode = {
          type: 'html',
          value: `<iframe class="youtube" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen title="${title}"></iframe>`
        }

        // Replace the paragraph with the HTML node
        parent.children[index] = htmlNode as any
      }
    })
  }
}

