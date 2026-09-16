import { View } from '@tarojs/components'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { tokenize } from '../utils/tokenize'

export type Segment = {
  text: string
  /** 该段文字的额外类名，例如 italic font-serif */
  className?: string
}

type WordsPullUpMultiStyleProps = {
  segments: Segment[]
  className?: string
  delay?: number
  stagger?: number
}

/**
 * 多段混排的逐词上滑：把若干段（可各自带样式）拆成词，
 * 逐词保留各自的 className 并错峰上滑入场。
 */
export default function WordsPullUpMultiStyle({
  segments,
  className = '',
  delay = 0,
  stagger = 0.08,
}: WordsPullUpMultiStyleProps) {
  const { id, inView } = useInViewOnce()

  const words = segments.flatMap((seg) =>
    tokenize(seg.text).map((t) => ({ ...t, className: seg.className })),
  )

  return (
    <View id={id} className={`flex flex-wrap justify-center ${className}`}>
      {words.map(({ word, className: wordClass, spaceAfter }, i) => (
        <View key={`${word}-${i}`} className="inline-block whitespace-pre">
          <View
            className={`pull-up ${wordClass ?? ''}`}
            style={{
              animationDelay: `${delay + i * stagger}s`,
              animationPlayState: inView ? 'running' : 'paused',
            }}
          >
            {word}
          </View>
          {spaceAfter ? ' ' : null}
        </View>
      ))}
    </View>
  )
}
