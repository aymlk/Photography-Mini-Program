import { useEffect, useMemo, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import { createSelectorQuery, getSystemInfoSync, usePageScroll } from '@tarojs/taro'
import AnimatedLetter from '../components/AnimatedLetter'
import WordsPullUpMultiStyle, { type Segment } from '../components/WordsPullUpMultiStyle'

const HEADING: Segment[] = [
  { text: '橙梨影视，' },
  { text: 'a wedding studio with cinematic eyes.', className: 'font-serif italic' },
  { text: '主营婚礼纪实与影像短片，也接品牌肖像与个人创作。' },
]

const BODY =
  '我们是一支扎根桐庐、偶尔四处跑的婚礼影像团队。婚礼是主场——从晨起的化妆间到宴席散场，我们用摄影和摄像两条线记录同一天。除此之外，我们也和品牌、独立音乐人、杂志与个人创作者合作，拍摄肖像、活动记录与短片。我们相信好影像不靠重滤镜，而靠观察光线、情绪和人物之间真实的连接。'

export default function About() {
  const chars = useMemo(() => Array.from(BODY), [])
  const [revealed, setRevealed] = useState(0)

  const rangeRef = useRef<{ start: number; end: number } | null>(null)
  const windowHeightRef = useRef(667)

  useEffect(() => {
    try {
      windowHeightRef.current = getSystemInfoSync().windowHeight || 667
    } catch {
      windowHeightRef.current = 667
    }

    // 量一次段落的文档坐标，之后滚动进度都基于它计算
    const query = createSelectorQuery()
    query.select('#about-body').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      const rect = res?.[0] as { top?: number; height?: number } | undefined
      const scroll = res?.[1] as { scrollTop?: number } | undefined
      if (!rect || typeof rect.top !== 'number' || typeof rect.height !== 'number') return

      const wh = windowHeightRef.current
      const docTop = rect.top + (scroll?.scrollTop ?? 0)
      rangeRef.current = {
        start: docTop - wh * 0.8,
        end: docTop + rect.height - wh * 0.2,
      }
    })
  }, [])

  // 替代 framer-motion 的 useScroll：小程序只能拿到页面级 scrollTop
  usePageScroll(({ scrollTop }) => {
    const range = rangeRef.current
    if (!range || range.end <= range.start) return

    const progress = Math.min(1, Math.max(0, (scrollTop - range.start) / (range.end - range.start)))
    const next = Math.round(progress * chars.length)
    setRevealed((prev) => (prev === next ? prev : next))
  })

  return (
    <View id="about" className="bg-black px-4 py-20 md:px-6 md:py-28 lg:py-36">
      <View className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-5 py-14 text-center sm:px-10 sm:py-16 md:rounded-[2rem] md:py-20 lg:px-16 lg:py-24">
        <View className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
          婚礼影像
        </View>

        <WordsPullUpMultiStyle
          segments={HEADING}
          className="mx-auto mt-6 max-w-3xl text-3xl leading-[0.95] sm:mt-8 sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
        />

        <View
          id="about-body"
          className="mx-auto mt-8 max-w-2xl text-xs sm:mt-10 sm:text-sm md:text-base"
          style={{ color: '#DEDBC8', lineHeight: 1.7 }}
        >
          {chars.map((char, i) => (
            <AnimatedLetter key={`${char}-${i}`} char={char} dimmed={i >= revealed} />
          ))}
        </View>
      </View>
    </View>
  )
}