import { useState, type ReactNode } from 'react'
import { Text, View } from '@tarojs/components'
import { pageScrollTo } from '@tarojs/taro'
import WordsPullUpMultiStyle, { type Segment } from './WordsPullUpMultiStyle'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { ArrowIcon, CheckIcon } from './Icons'
import {
  COMBO_PACKAGES,
  PHOTO_PACKAGES,
  SERVICE_PROMISES,
  VIDEO_PACKAGES,
  type ServicePackage,
} from '../config/services'

const HEADER: Segment[] = [
  { text: '婚礼摄影与摄像，', className: 'text-[#E1E0CC]' },
  { text: '透明定价，按需选择。', className: 'text-gray-500' },
]

type TabId = 'photo' | 'video' | 'combo'

const TABS: { id: TabId; label: string }[] = [
  { id: 'photo', label: '婚礼摄影' },
  { id: 'video', label: '婚礼摄像' },
  { id: 'combo', label: '摄影摄像' },
]

const DIM = 'rgba(225, 224, 204, 0.7)'

/** 卡片列宽：婚礼摄影 2 列 / 婚礼摄像 3 列 / 组合 1 列 */
const CELL_2 = 'w-full md:w-1/2 p-1 sm:p-1.5'
const CELL_3 = 'w-full md:w-1/2 lg:w-1/3 p-1 sm:p-1.5'
const CELL_1 = 'w-full p-1 sm:p-1.5'

/** 与 Features 卡一致的入场动效：缩放 0.95 → 1，错峰 0.15s（CSS keyframes 版本） */
function CardShell({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { id, inView } = useInViewOnce(-100)

  return (
    <View id={id} className={className}>
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

function LearnMore() {
  return (
    <View
      className="mt-auto flex items-center gap-1.5 pt-5"
      onClick={() => pageScrollTo({ selector: '#contact', duration: 400 })}
    >
      <Text className="text-[11px] text-primary sm:text-xs">了解详情</Text>
      <ArrowIcon size={13} rotate={-45} />
    </View>
  )
}

function MetaPills({ meta }: { meta: string[] }) {
  return (
    <View className="mt-4 flex flex-row flex-wrap gap-1.5">
      {meta.map((m) => (
        <Text
          key={m}
          className="rounded-full px-2 py-1 text-[10px] sm:text-[11px]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgba(222, 219, 200, 0.8)' }}
        >
          {m}
        </Text>
      ))}
    </View>
  )
}

function ServiceCard({ pkg, delay, cellClass }: { pkg: ServicePackage; delay: number; cellClass: string }) {
  return (
    <CardShell delay={delay} className={cellClass}>
      <View className="flex h-full flex-col bg-[#212121] p-5 sm:p-6">
        <View className="flex flex-row items-baseline justify-between gap-3">
          <View className="text-sm font-medium text-[#E1E0CC] sm:text-base md:text-lg">
            {pkg.name}
            <Text className="ml-1.5 align-super text-[10px] text-gray-500">{pkg.number}</Text>
          </View>
          <Text className="shrink-0 text-[11px] text-primary sm:text-xs">{pkg.price}</Text>
        </View>

        <MetaPills meta={pkg.highlights} />
        <Checklist items={pkg.items} />
        <LearnMore />
      </View>
    </CardShell>
  )
}

function PhotoPanel() {
  return (
    <View className="flex flex-row flex-wrap">
      {PHOTO_PACKAGES.map((pkg, i) => (
        <ServiceCard key={pkg.id} pkg={pkg} delay={i * 0.15} cellClass={CELL_2} />
      ))}
    </View>
  )
}

function VideoPanel() {
  return (
    <View className="flex flex-row flex-wrap">
      {VIDEO_PACKAGES.map((pkg, i) => (
        <ServiceCard key={pkg.id} pkg={pkg} delay={i * 0.15} cellClass={CELL_3} />
      ))}
    </View>
  )
}

function ComboPanel() {
  return (
    <View className="mx-auto flex w-full max-w-2xl flex-row flex-wrap">
      {COMBO_PACKAGES.map((pkg, i) => (
        <ServiceCard key={pkg.id} pkg={pkg} delay={i * 0.15} cellClass={CELL_1} />
      ))}
    </View>
  )
}

export default function Services() {
  const [tab, setTab] = useState<TabId>('photo')

  return (
    <View id="services" className="relative bg-black px-4 py-20 md:px-6 md:py-28">
      <View className="bg-noise pointer-events-none absolute inset-0 z-0 opacity-[0.15]" />

      <View className="relative z-10 mx-auto max-w-7xl">
        <Text className="block text-center text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
          服务与套系
        </Text>

        <View className="mx-auto mt-6 max-w-4xl text-center sm:mt-8">
          <WordsPullUpMultiStyle
            segments={HEADER}
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
          />
        </View>

        {/* 三个 Tab */}
        <View className="mt-10 flex flex-row justify-center">
          <View className="flex flex-row rounded-full bg-[#101010] p-1">
            {TABS.map((t) => {
              const active = tab === t.id
              return (
                <View
                  key={t.id}
                  className={`rounded-full px-5 py-2 ${active ? 'bg-primary' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <Text
                    className="text-xs sm:text-sm"
                    style={{ color: active ? '#000000' : DIM }}
                  >
                    {t.label}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* 面板：切 tab 时重挂载，入场动效重播 */}
        <View className="mt-8 md:mt-10">
          {tab === 'photo' && <PhotoPanel key="photo" />}
          {tab === 'video' && <VideoPanel key="video" />}
          {tab === 'combo' && <ComboPanel key="combo" />}
        </View>

        {/* 通用承诺 */}
        <View className="mt-10 flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 md:mt-14">
          {SERVICE_PROMISES.map((p) => (
            <View key={p} className="flex flex-row items-center gap-1.5">
              <CheckIcon size={11} />
              <Text className="text-[11px] text-gray-500 sm:text-xs">{p}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
