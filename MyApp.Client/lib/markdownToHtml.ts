import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypePrism from "rehype-prism-plus"
import remarkYoutube from "./remark-youtube"


export default async function markdownToHtml(markdown: string) {
  const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkYoutube)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypePrism)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdown)
  return result.toString()
}
