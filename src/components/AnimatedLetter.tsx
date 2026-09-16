import { motion, useTransform, type MotionValue } from 'framer-motion'

type AnimatedLetterProps = {
  char: string
  index: number
  totalChars: number
  /** 来自父级 useScroll 的滚动进度 0 → 1 */
  scrollYProgress: MotionValue<number>
}

/**
 * 单个字符：根据自身在全文中的位置，随滚动把透明度从 0.2 推到 1，
 * 形成逐字点亮的渐进式阅读效果。
 */
export default function AnimatedLetter({
  char,
  index,
  totalChars,
  scrollYProgress,
}: AnimatedLetterProps) {
  const charProgress = index / totalChars
  const start = Math.max(0, charProgress - 0.1)
  const end = Math.min(1, charProgress + 0.05)

  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])

  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}
