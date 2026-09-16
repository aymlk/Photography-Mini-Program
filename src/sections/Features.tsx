import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import WordsPullUpMultiStyle, { type Segment } from '../components/WordsPullUpMultiStyle'

const HEADER: Segment[] = [
  { text: '为一影像而生的全流程拍摄服务。', className: 'text-[#E1E0CC]' },
  { text: '为纯粹的热爱而造，由光影与技术共同驱动。', className: 'text-gray-500' },
]

const ICONS = {
  storyboard:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  critique:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  capsule:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

function CardShell({
  index,
  children,
  className = '',
}: {
  index: number
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check className="mt-[2px] h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" strokeWidth={2.5} />
          <span className="text-[11px] leading-snug text-gray-400 sm:text-xs md:text-[13px]">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LearnMore() {
  return (
    <a
      href="#contact"
      className="group mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] text-primary transition-opacity duration-300 hover:opacity-70 sm:text-xs"
    >
      了解更多
      <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}

type InfoCardProps = {
  index: number
  number: string
  title: string
  icon: string
  items: string[]
}

function InfoCard({ index, number, title, icon, items }: InfoCardProps) {
  return (
    <CardShell index={index} className="flex flex-col bg-[#212121] p-5 sm:p-6">
      <img src={icon} alt="" className="h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12" loading="lazy" />

      <h3 className="mt-4 text-sm font-medium text-[#E1E0CC] sm:text-base md:text-lg">
        {title}
        <span className="ml-1.5 align-super text-[10px] text-gray-500">{number}</span>
      </h3>

      <Checklist items={items} />
      <LearnMore />
    </CardShell>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative min-h-screen bg-black px-4 py-20 md:px-6 md:py-28">
      <div className="bg-noise absolute inset-0 z-0 opacity-[0.15]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-14 md:mb-16">
          <WordsPullUpMultiStyle
            segments={HEADER}
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
          {/* 01 — 视频卡 */}
          <CardShell index={0} className="relative min-h-[240px] lg:min-h-0">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-sm font-medium sm:text-base md:text-lg" style={{ color: '#E1E0CC' }}>
                你的光影故事。
              </p>
            </div>
          </CardShell>

          <InfoCard
            index={1}
            number="01"
            title="拍摄企划."
            icon={ICONS.storyboard}
            items={['场地勘景与光线时间轴', '服装、妆造与情绪板', '分镜脚本与参考片单', '当天流程与应急预案']}
          />

          <InfoCard
            index={2}
            number="02"
            title="智能选片."
            icon={ICONS.critique}
            items={['AI 初筛，剔除闭眼与失焦', '逐张标注的构图建议', '一键同步到修图与交付']}
          />

          <InfoCard
            index={3}
            number="03"
            title="沉浸影棚."
            icon={ICONS.capsule}
            items={['拍摄期间屏蔽外界通知', '可定制的环境声与灯光', '日程与团队进度实时同步']}
          />
        </div>
      </div>
    </section>
  )
}
