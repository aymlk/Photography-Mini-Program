import type { ReactNode } from 'react'
import { Image, Text, Video, View } from '@tarojs/components'
import WordsPullUpMultiStyle, { type Segment } from '../components/WordsPullUpMultiStyle'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { ArrowIcon, CheckIcon } from '../components/Icons'
import { CARD_VIDEO, ICONS } from '../config/assets'

const HEADER: Segment[] = [
  { text: '为一影像而生的全流程拍摄服务。', className: 'text-[#E1E0CC]' },
  { text: '为纯粹的热爱而造，由光影与技术共同驱动。', className: 'text-gray-500' },
]

/** 1 列 → 2 列 → 4 列；用百分比宽度 + 内边距做间距，避开 grid / gap 在 WXSS 下的兼容风险 */
const CELL = 'w-full md:w-1/2 lg:w-1/4 p-1 sm:p-1.5'

function CardShell({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { id, inView } = useInViewOnce(-100)

  return (
    <View id={id} className={CELL}>
      <View
        className="card-enter h-full overflow-hidden rounded-2xl"
        style={{ animationDelay: `${delay}s`, animationPlayState: inView ? 'running' : 'paused' }}
      >
        {children}
      </View>
    </View>
  )
}

function Checklist({ items }: { items: string[] }) {
  return (
    <View className="mt-5 sm:mt-6">
      {items.map((item) => (
        <View key={item} className="mb-2.5 flex items-start gap-2 sm:mb-3">
          <View className="mt-[3px]">
            <CheckIcon size={13} />
          </View>
          <Text className="flex-1 text-[11px] leading-snug text-gray-400 sm:text-xs md:text-[13px]">
            {item}
          </Text>
        </View>
      ))}
    </View>
  )
}

function InfoCard({
  number,
  title,
  icon,
  items,
  delay,
}: {
  number: string
  title: string
  icon: string
  items: string[]
  delay: number
}) {
  return (
    <CardShell delay={delay}>
      <View className="flex h-full flex-col bg-[#212121] p-5 sm:p-6">
        <Image src={icon} className="h-10 w-10 rounded-lg sm:h-12 sm:w-12" mode="aspectFill" />

        <View className="mt-4 text-sm font-medium text-[#E1E0CC] sm:text-base md:text-lg">
          {title}
          <Text className="ml-1.5 align-super text-[10px] text-gray-500">{number}</Text>
        </View>

        <Checklist items={items} />

        <View className="mt-auto flex items-center gap-1.5 pt-5">
          <Text className="text-[11px] text-primary sm:text-xs">了解更多</Text>
          <ArrowIcon size={13} rotate={-45} />
        </View>
      </View>
    </CardShell>
  )
}

export default function Features() {
  return (
    <View id="features" className="relative min-h-screen bg-black px-4 py-20 md:px-6 md:py-28">
      <View className="bg-noise pointer-events-none absolute inset-0 z-0 opacity-[0.15]" />

      <View className="relative z-10 mx-auto max-w-7xl">
        <View className="mx-auto mb-10 max-w-4xl text-center sm:mb-14 md:mb-16">
          <WordsPullUpMultiStyle
            segments={HEADER}
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
          />
        </View>

        <View className="flex flex-wrap lg:h-[480px]">
          <CardShell>
            <View className="relative h-full min-h-[240px] w-full lg:min-h-0">
              <Video
                className="absolute inset-0 h-full w-full"
                src={CARD_VIDEO}
                autoplay
                loop
                muted
                objectFit="cover"
                controls={false}
                showFullscreenBtn={false}
                showPlayBtn={false}
                showCenterPlayBtn={false}
                showMuteBtn={false}
                enableProgressGesture={false}
                enablePlayGesture={false}
              />
              <View className="grad-card absolute inset-0" />
              <View className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <Text className="text-sm font-medium sm:text-base md:text-lg" style={{ color: '#E1E0CC' }}>
                  你的光影故事。
                </Text>
              </View>
            </View>
          </CardShell>

          <InfoCard
            delay={0.15}
            number="01"
            title="拍摄企划."
            icon={ICONS.storyboard}
            items={['场地勘景与光线时间轴', '服装、妆造与情绪板', '分镜脚本与参考片单', '当天流程与应急预案']}
          />

          <InfoCard
            delay={0.3}
            number="02"
            title="智能选片."
            icon={ICONS.critique}
            items={['AI 初筛，剔除闭眼与失焦', '逐张标注的构图建议', '一键同步到修图与交付']}
          />

          <InfoCard
            delay={0.45}
            number="03"
            title="沉浸影棚."
            icon={ICONS.capsule}
            items={['拍摄期间屏蔽外界通知', '可定制的环境声与灯光', '日程与团队进度实时同步']}
          />
        </View>
      </View>
    </View>
  )
}
