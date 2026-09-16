import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { tokenize } from '../utils/tokenize'

type WordsPullUpProps = {
  text: string
  className?: string
  /** 起始延迟（秒） */
  delay?: number
  /** 词与词之间的错峰间隔（秒） */
  stagger?: number
  /** 在最后一个词的末尾字符右上角加一个上标星号 */
  showAsterisk?: boolean
  /**
   * 词与词之间是否换行。
   * - true（默认）：多词排版（About、Features 标题），允许自然换行。
   * - false：单行强制（Hero 主标题），外层 h1 通常还会再叠一层 whitespace-nowrap 保险。
   */
  wrap?: boolean
}

/**
 * 逐词上滑入场：每个词从 y:20 滑到 y:0，错峰播放，仅在首次进入视口时触发一次。
 */
export default function WordsPullUp({
  text,
  className = '',
  delay = 0,
  stagger = 0.08,
  showAsterisk = false,
  wrap = true,
}: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const tokens = tokenize(text)

  return (
    <span
      ref={ref}
      className={`inline-flex ${wrap ? 'flex-wrap' : 'flex-nowrap whitespace-nowrap'} ${className}`}
    >
      {tokens.map(({ word, spaceAfter }, i) => {
        const isLast = i === tokens.length - 1
        return (
          <span key={`${word}-${i}`} className="inline-flex overflow-hidden">
            <motion.span
              className="inline-flex"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : undefined}
              transition={{
                duration: 0.7,
                delay: delay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {isLast && showAsterisk ? renderWithAsterisk(word) : word}
              {spaceAfter && <span className="inline-block">&nbsp;</span>}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

/**
 * 把最后一个字符包起来，右上角挂一个上标 *。
 *
 * 两个易踩的点：
 * 1. 外层 span 有 overflow-hidden（用于遮罩上滑动效），星号若用负 right 越界会被直接裁掉；
 *    所以给末尾字符补右侧内边距，把星号收进盒子内再用 right-0 贴右。
 * 2. 汉字是等宽方块字，几乎填满 em 框（不像拉丁字母只有 x-height），
 *    所以星号要贴近盒顶（top-[0.04em]），沿用拉丁的 top-[0.65em] 会掉到字的腰部。
 */
function renderWithAsterisk(word: string) {
  const chars = Array.from(word)
  const last = chars[chars.length - 1]
  const head = chars.slice(0, -1).join('')

  return (
    <span className="relative inline-block whitespace-pre">
      {head}
      <span className="relative inline-block pr-[0.24em]">
        {last}
        <span className="absolute right-0 top-[0.04em] select-none text-[0.26em] leading-none">
          *
        </span>
      </span>
    </span>
  )
}
