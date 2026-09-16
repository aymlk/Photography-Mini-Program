import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import WordsPullUp from '../components/WordsPullUp'

const EASE = [0.16, 1, 0.3, 1] as const

const NAV_ITEMS = [
  { label: '光影故事', href: '#about' },
  { label: '婚礼服务', href: '#services' },
  { label: '作品', href: '#works' },
  { label: '工作方法', href: '#features' },
  { label: '预约咨询', href: '#contact' },
]

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="whitespace-nowrap transition-colors duration-300"
      style={{ color: hovered ? '#E1E0CC' : 'rgba(225, 224, 204, 0.8)' }}
    >
      {label}
    </a>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* 背景视频 */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 胶片颗粒 */}
        <div className="noise-overlay absolute inset-0 z-[1] opacity-[0.7] mix-blend-overlay" />

        {/* 电影感渐变 */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* 悬挂式导航 */}
        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:rounded-b-3xl md:px-8">
          <ul className="flex items-center gap-3 text-[10px] sm:gap-6 sm:text-xs md:gap-12 md:text-sm lg:gap-14">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink label={item.label} href={item.href} />
              </li>
            ))}
          </ul>
        </nav>

        {/* 底部内容 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-8 md:p-10 lg:p-14">
          {/*
            显式 fr 比例：mobile 仍 1 列堆叠，md+ 用 2fr:1fr。
            比 grid-cols-12 更稳：即便 col-span-8 的内容超界，左栏宽度
            也恒为右栏 2 倍，不会被内容撑开破坏整页布局。
          */}
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[2fr_1fr] md:gap-8">
            <div className="md:min-w-0">
              {/*
                字号用 min() 而不是 clamp()：min(11vw, 180px) 只钳上限不强制最小，
                窄屏自然缩到 11vw ≈ 47px（430 视口），永远不会撑破栏宽。
                h1 加 max-w-full + overflow-hidden 兜底：即使计算有意外，
                内容也只是被右侧截掉一小段，不会撑破 grid。
                其它：负字距 -0.04em、行高 0.9、字重 700、强制单行。
              */}
              <h1
                className="whitespace-nowrap pb-[0.08em] font-bold leading-[1.05] tracking-[-0.04em] text-[18vw] md:text-[15vw] lg:text-[14vw] xl:text-[13vw] 2xl:text-[12vw]"
                style={{ color: '#E1E0CC' }}
              >
                <WordsPullUp text="橙梨影视" delay={0.15} wrap={false} />
              </h1>
            </div>

            <div>
              <motion.p
                className="text-primary/70 text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              >
                橙梨影视是一间以自然光为笔的婚礼影像工作室。我们相信每一束光都有它的情绪，
                每一个人都值得被诚实地、温柔地记录一次。
              </motion.p>

              <motion.a
                href="#contact"
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primary py-1 pl-4 pr-1 transition-all duration-300 hover:gap-3 sm:mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              >
                <span className="text-sm font-medium text-black sm:text-base">预约拍摄</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4 text-[#E1E0CC] sm:h-5 sm:w-5" strokeWidth={2} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
