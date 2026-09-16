import { View } from '@tarojs/components'
import Hero from '../../components/Hero'
import About from '../../components/About'
import Services from '../../components/Services'
import Features from '../../components/Features'

export default function Index() {
  return (
    <View className="min-h-screen bg-black">
      <Hero />
      <About />
      <Services />
      <Features />

      <View id="contact" className="bg-black px-6 pb-10 pt-4 text-center">
        <View className="text-[10px] text-gray-500 sm:text-xs">
          橙梨影视 — 桐庐 · 婚礼摄影 / 婚礼摄像 / 品牌影像 · hello@chengli.studio
        </View>
      </View>
    </View>
  )
}
