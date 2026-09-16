import { View } from '@tarojs/components'
import { useInViewOnce } from '../hooks/useInViewOnce'
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
   * - false：单行强制（Hero 主标题），汉字无空格会自动断行，必须关掉。
   */
  wrap?: boolean
}

/**
 * 把最后一个字符包起来，右上角挂一个上标 *。
 *
 * 汉字是等宽方块字，几乎填满 em 框（不像拉丁字母只有 x-height），
 * 所以星号要贴近盒顶；沿用拉丁的 top-[0.65em] 会掉到字的腰部。
 * 末尾字符补右侧内边距，避免星号越界被裁。
 */
function renderWithAsterisk(word: string) {
  const chars = Array.from(word)
  const last = chars[chars.length - 1]
  const head = chars.slice(0, -1).join('')

  return (
    <View className="relative inline-block">
      {head}
      <View className="relative inline-block pr-[0.24em]">
        {last}
        <View className="absolute right-0 top-[0.04em] text-[0.26em] leading-none">*</View>
      </View>
    </View>
  )
}

/**
 * 逐词上滑入场。
 * 动画本体是 CSS keyframes（.pull-up），用 animation-play-state 控制起跑时机，
 * 替代 framer-motion 的 useInView + y:20 → 0。
 */
export default function WordsPullUp({
  text,
  className = '',
  delay = 0,
  stagger = 0.08,
  showAsterisk = false,
  wrap = true,
}: WordsPullUpProps) {
  const { id, inView } = useInViewOnce()
  const tokens = tokenize(text)

  return (
    <View
      id={id}
      className={`inline-block ${wrap ? '' : 'whitespace-nowrap'} ${className}`}
    >
      {tokens.map(({ word, spaceAfter }, i) => {
        const isLast = i === tokens.length - 1
        return (
          <View key={`${word}-${i}`} className="inline-block whitespace-pre">
            <View
              className="pull-up"
              style={{
                animationDelay: `${delay + i * stagger}s`,
                animationPlayState: inView ? 'running' : 'paused',
              }}
            >
              {isLast && showAsterisk ? renderWithAsterisk(word) : word}
            </View>
            {spaceAfter ? ' ' : null}
          </View>
        )
      })}
    </View>
  )
}
