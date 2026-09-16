export type Token = {
  word: string
  /** 该词后面是否需要补一个空格（中文按字切分时为 false） */
  spaceAfter: boolean
}

const CJK = '\\u3400-\\u9FFF\\u3000-\\u303F\\uFF00-\\uFFEF'
const CHAR_RE = new RegExp(`[${CJK}]|[^${CJK}]+`, 'g')

/**
 * 把一段文本切成动画用的最小单元：
 * - 英文 / 数字按空格分词
 * - 中文按单个汉字切分，且不加空格
 */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = []

  for (const part of text.split(/(\s+)/)) {
    if (!part) continue

    if (/^\s+$/.test(part)) {
      if (tokens.length) tokens[tokens.length - 1].spaceAfter = true
      continue
    }

    const chars = part.match(CHAR_RE) ?? [part]
    for (const c of chars) tokens.push({ word: c, spaceAfter: false })
  }

  return tokens
}
