import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
})

export function renderMarkdown(input: string): string {
  const rawHtml = md.render(input || '')
  return DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } })
}
