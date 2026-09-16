import { useEffect, useState } from 'react'
import { Text, Video, View } from '@tarojs/components'
import { getSystemInfoSync, pageScrollTo, setClipboardData } from '@tarojs/taro'
import WordsPullUp from './WordsPullUp'
import { ArrowIcon } from './Icons'
import { CONTACT_EMAIL, HERO_VIDEO } from '../config/assets'

const NAV_ITEMS: { label: string; target: string }[] = [
  { label: '光影故事', target: '#about' },
  { label: '婚礼服务', target: '#services' },
  { label: '工作方法', target: '#features' },
  { label: '摄影日记', target: '#about' },
  { label: '预约咨询', target: '#contact' },
]

export default function Hero() {
  const [statusBarHeight, setStatusBarHeight] = useState(0)

  useEffect(() => {
    // 自定义导航栏（navigationStyle: custom）需要自己给状态栏留位置
    try {
      setStatusBarHeight(getSystemInfoSync().statusBarHeight || 0)
    } catch {
      setStatusBarHeight(0)
    }
  }, [])

  const goTo = (selector: string) => {
    pageScrollTo({ selector, duration: 400 })
  }

  const copyContact = () => {
    setClipboardData({ data: CONTACT_EMAIL })
  }

  return (
    <View
      className="relative h-screen w-full p-4 md:p-6"
      style={{ paddingTop: `${statusBarHeight + 16}px` }}
    >
      <View className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <Video
          className="absolute inset-0 h-full w-full"
          src={HERO_VIDEO}
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

        {/* 胶片颗粒（mix-blend 依赖 WebView 渲染器，开启 Skyline 时需降级为纯 opacity） */}
        <View className="noise-overlay absolute inset-0 z-10 opacity-[0.7] mix-blend-overlay" />
        <View className="grad-hero absolute inset-0 z-20" />

        {/* 悬挂式导航：小程序无 hover，点击滚动到对应锚点 */}
        <View className="absolute left-1/2 top-0 z-40 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:rounded-b-3xl md:px-8">
          <View className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {NAV_ITEMS.map((item) => (
              <Text
                key={item.label}
                className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onClick={() => goTo(item.target)}
              >
                {item.label}
              </Text>
            ))}
          </View>
        </View>

        {/* 底部内容 */}
        <View className="absolute bottom-0 left-0 right-0 z-30 p-5 sm:p-8 md:p-10 lg:p-14">
          <View className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
            <View className="md:w-2/3">
              {/* 汉字排版参数与 Web 端一致：字号按「2/3 宽内 4 字铺满」反推，
                  负字距 -0.04em，行高 0.9，字重 700；强制单行 + 不挂上标星号 */}
              <View
                className="whitespace-nowrap text-[14vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[15vw] lg:text-[15.5vw] xl:text-[16vw] 2xl:text-[16.5vw]"
                style={{ color: '#E1E0CC' }}
              >
                <WordsPullUp text="橙梨影视" delay={0.15} wrap={false} />
              </View>
            </View>

            <View className="md:w-1/3">
              <View
                className="fade-up text-primary/70 text-xs sm:text-sm md:text-base"
                style={{ animationDelay: '0.5s', lineHeight: 1.2 }}
              >
                橙梨影视是一间以自然光为笔的婚礼影像工作室。我们相信每一束光都有它的情绪，
                每一个人都值得被诚实地、温柔地记录一次。
              </View>

              <View
                className="fade-up mt-5 inline-flex items-center gap-2 rounded-full bg-primary py-1 pl-4 pr-1 sm:mt-6"
                style={{ animationDelay: '0.7s' }}
                onClick={copyContact}
              >
                <Text className="text-sm font-medium text-black sm:text-base">预约拍摄</Text>
                <View className="flex h-9 w-9 items-center justify-center rounded-full bg-black sm:h-10 sm:w-10">
                  <ArrowIcon color="#E1E0CC" size={16} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
