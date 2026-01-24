const FULLWIDTH_LEFT = '（'
const FULLWIDTH_RIGHT = '）'
const QUOTE_PREFIX = '｜'

function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n?/g, '\n')
}

function cleanupInline(text: string): string {
  let result = text

  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, url: string) => {
    const altText = alt ? ` ${alt}` : ''
    return `[图片]${altText}${FULLWIDTH_LEFT}${url}${FULLWIDTH_RIGHT}`
  })

  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, url: string) => {
    return `${label}${FULLWIDTH_LEFT}${url}${FULLWIDTH_RIGHT}`
  })

  result = result.replace(/~~([^~]+)~~/g, '$1')
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1')
  result = result.replace(/__([^_]+)__/g, '$1')
  result = result.replace(/\*([^*]+)\*/g, '$1')
  result = result.replace(/_([^_]+)_/g, '$1')

  result = result.replace(/`([^`]+)`/g, '$1')
  result = result.replace(/<[^>]+>/g, '')

  return result
}

function ensureBlankLineBefore(output: string[]): void {
  if (output.length === 0) return
  if (output[output.length - 1] !== '') {
    output.push('')
  }
}

export function mdToWechatText(md: string): string {
  const lines = normalizeLineEndings(md).split('\n')
  const output: string[] = []
  let inCodeBlock = false

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, '')

    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        output.push('—— code ——')
        inCodeBlock = true
      } else {
        output.push('—— end ——')
        inCodeBlock = false
      }
      continue
    }

    if (inCodeBlock) {
      output.push(line)
      continue
    }

    if (line.trim() === '') {
      output.push('')
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const title = cleanupInline(headingMatch[2].trim())
      if (level === 1) {
        output.push(`【${title}】`)
        output.push('')
      } else if (level === 2 || level === 3) {
        ensureBlankLineBefore(output)
        output.push(`【${title}】`)
      } else {
        output.push(title)
      }
      continue
    }

    const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/)
    if (unorderedMatch) {
      const item = cleanupInline(unorderedMatch[1].trim())
      output.push(`• ${item}`)
      continue
    }

    const orderedMatch = line.match(/^\s*(\d+)\.\s+(.+)$/)
    if (orderedMatch) {
      const index = orderedMatch[1]
      const item = cleanupInline(orderedMatch[2].trim())
      output.push(`${index}) ${item}`)
      continue
    }

    const quoteMatch = line.match(/^\s*>\s?(.*)$/)
    if (quoteMatch) {
      const quoteText = cleanupInline(quoteMatch[1].trim())
      output.push(`${QUOTE_PREFIX}${quoteText}`)
      continue
    }

    output.push(cleanupInline(line))
  }

  const joined = output.join('\n')
  const collapsed = joined.replace(/\n{3,}/g, '\n\n')

  return collapsed.trim()
}
