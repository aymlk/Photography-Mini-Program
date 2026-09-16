import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import WordsPullUpMultiStyle, { type Segment } from '../components/WordsPullUpMultiStyle'
import WorkModal from '../components/WorkModal'
import { CATEGORIES, WORKS, type Work, type WorkCategory } from '../content/works'

const HEADER: Segment[] = [
  { text: '作品，', className: 'text-[#E1E0CC]' },
  { text: '比文字更诚实。', className: 'text-gray-500' },
]

const EASE = [0.22, 1, 0.36, 1] as const

const CATEGORY_LABEL: Record<WorkCategory, string> = {
  photo: '婚礼摄影',
  video: '婚礼摄像',
  combo: '摄影摄像',
  story: '婚礼纪实',
}

type CategoryId = 'all' | WorkCategory

/**
 * 横向滚动行 —— 移动端整页只占一行高度，作品再多也只往右延伸。
 *
 * 移动端：单张 80vw 卡片，snap 居中
 * 桌面端：单张 320px 卡片，snap 居中，左右圆形按钮翻页
 *
 * `getItemStyle(index)` 提供给卡片计算 snap 偏移，避免父级 transform
 * 影响子元素 sticky 行为（这里不涉及，但保留接口以便扩展）。
 */
function HorizontalRow({
  works,
  onOpen,
}: {
  works: Work[]
  onOpen: (w: Work) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  function scrollTo(i: number) {
    const track = trackRef.current
    if (!track) return
    const total = works.length
    const clamped = Math.max(0, Math.min(total - 1, i))
    setIndex(clamped)
    const first = track.firstElementChild as HTMLElement | null
    if (!first) return
    // 每个 item 的 offsetLeft + 父容器 padding-left = 真实位置
    const childLeft = (first.parentElement?.children[clamped] as HTMLElement | undefined)?.offsetLeft ?? 0
    track.scrollTo({ left: childLeft, behavior: 'smooth' })
  }

  function onScroll() {
    const track = trackRef.current
    if (!track) return
    const first = track.firstElementChild as HTMLElement | null
    if (!first) return
    // 通过 scrollLeft / 单项宽度算当前索引
    const itemWidth = first.getBoundingClientRect().width + 12 // gap
    const i = Math.round(track.scrollLeft / Math.max(itemWidth, 1))
    if (i !== index) setIndex(Math.max(0, Math.min(works.length - 1, i)))
  }

  // 桌面端：滚轮 → 横向滚动
  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const track = trackRef.current
      if (track) {
        track.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }
  }

  // 切换分类后重置滚动位置
  useEffect(() => {
    const track = trackRef.current
    if (track) track.scrollTo({ left: 0, behavior: 'auto' })
    setIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works.length])

  if (works.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-[12px] text-gray-500">
        该分类下暂无作品
      </div>
    )
  }

  return (
    <div className="relative">
      {/* 桌面端左右按钮 */}
      {works.length > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              aria-label="上一张"
              onClick={() => scrollTo(index - 1)}
              className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 md:flex"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
          )}
          {index < works.length - 1 && (
            <button
              type="button"
              aria-label="下一张"
              onClick={() => scrollTo(index + 1)}
              className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 md:flex"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          )}
        </>
      )}

      <div
        ref={trackRef}
        onScroll={onScroll}
        onWheel={onWheel}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 md:gap-4 md:pl-[calc(50%-160px)] md:pr-[calc(50%-160px)]"
        style={{
          scrollSnapStop: 'always',
          paddingLeft: 'calc(50% - 35vw)',
          paddingRight: 'calc(50% - 35vw)',
        }}
      >
        {works.map((w, i) => (
          <RowCard key={w.id} work={w} index={i} onOpen={onOpen} />
        ))}
      </div>

      {/* 进度指示器 —— 总数 + 当前索引 + 进度条 */}
      <div className="mt-4 flex items-center gap-3 px-1">
        <span className="text-[11px] tabular-nums text-gray-400">
          {String(index + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
        </span>
        <div className="relative h-px flex-1 overflow-hidden bg-white/10">
          <div
            className="absolute left-0 top-0 h-px bg-primary/70 transition-[width] duration-300 ease-out"
            style={{ width: `${((index + 1) / works.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

/** 单张作品卡 —— 横滑行内的卡片 */
function RowCard({
  work,
  index,
  onOpen,
}: {
  work: Work
  index: number
  onOpen: (w: Work) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(work)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
      className="group relative block aspect-[3/4] w-[70vw] shrink-0 snap-center overflow-hidden rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary/60 sm:w-[320px] sm:rounded-2xl"
      aria-label={`查看作品：${work.title}`}
    >
      {/* 封面 */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
        style={{ background: work.cover, backgroundSize: 'cover' }}
      />
      <div
        className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-overlay transition-opacity duration-500 group-hover:opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.85) 100%)',
        }}
        aria-hidden
      />

      {/* 编号 + 类别 */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
        <span className="rounded-full bg-black/45 px-2 py-0.5 text-[9px] tracking-[0.15em] text-primary/90 backdrop-blur sm:text-[10px]">
          {work.number}
        </span>
        <span className="rounded-full bg-black/45 px-2 py-0.5 text-[9px] tracking-wider text-primary/80 backdrop-blur sm:text-[10px]">
          {CATEGORY_LABEL[work.category]}
        </span>
      </div>

      {/* 张数 badge */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[9px] tracking-wider text-primary/85 backdrop-blur sm:text-[10px]">
        <Layers className="h-3 w-3" strokeWidth={2} />
        <span>
          {work.items.length}
          {work.items.some((i) => i.type === 'video') ? ' · 含视频' : ''}
        </span>
      </div>

      {/* 标题 + 元数据 */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <h3 className="text-sm font-medium leading-tight text-[#E1E0CC] sm:text-base">
          {work.title}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 sm:gap-1.5 sm:text-[11px]">
          <span className="truncate">{work.date}</span>
          <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-gray-500" />
          <span className="truncate">{work.location}</span>
        </div>
      </div>

      {/* 移动端常显 / 桌面端 hover 的箭头按钮 */}
      <div
        className="absolute right-3 top-3 z-10 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-primary/90 text-black opacity-100 transition-all duration-500 sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        aria-hidden
      >
        <ArrowRight className="h-3.5 w-3.5 -rotate-45 sm:h-4 sm:w-4" strokeWidth={2.5} />
      </div>
    </motion.button>
  )
}

export default function Works() {
  const [active, setActive] = useState<CategoryId>('all')
  const [openWork, setOpenWork] = useState<Work | null>(null)

  const filtered = active === 'all' ? WORKS : WORKS.filter((w) => w.category === active)

  return (
    <section id="works" className="relative bg-black">
      <div className="bg-noise absolute inset-0 z-0 opacity-[0.12]" aria-hidden />

      <div className="relative z-10">
        {/* Sticky 顶部 —— 切换分类时标题始终可见 */}
        <div className="sticky top-0 z-20 bg-black/85 backdrop-blur-md">
          <div className="px-4 pb-3 pt-12 sm:px-6 sm:pb-4 sm:pt-16 md:pt-20">
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
              作品
            </p>
            <div className="mx-auto mt-4 max-w-4xl text-center sm:mt-6">
              <WordsPullUpMultiStyle
                segments={HEADER}
                className="text-[22px] font-normal leading-snug sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>

            {/* 分类筛选：移动端横向滚动，桌面端居中 */}
            <div className="mt-6 sm:mt-8">
              <div className="-mx-4 flex overflow-x-auto px-4 pb-1 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-2">
                  {CATEGORIES.map((c) => {
                    const isActive = active === c.id
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className="shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] transition-all duration-300"
                        style={{
                          borderColor: isActive
                            ? 'rgba(222, 219, 200, 0.5)'
                            : 'rgba(255, 255, 255, 0.08)',
                          backgroundColor: isActive
                            ? 'rgba(222, 219, 200, 0.08)'
                            : 'transparent',
                          color: isActive ? '#E1E0CC' : 'rgba(225, 224, 204, 0.55)',
                        }}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
                {CATEGORIES.map((c) => {
                  const isActive = active === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActive(c.id)}
                      className="rounded-full border px-3.5 py-1.5 text-[11px] transition-all duration-300 sm:text-xs"
                      style={{
                        borderColor: isActive
                          ? 'rgba(222, 219, 200, 0.5)'
                          : 'rgba(255, 255, 255, 0.08)',
                        backgroundColor: isActive
                          ? 'rgba(222, 219, 200, 0.08)'
                          : 'transparent',
                        color: isActive ? '#E1E0CC' : 'rgba(225, 224, 204, 0.55)',
                      }}
                    >
                      {c.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 横滑行 —— 移动端单行，桌面端也是单行（后期作品多时只往右延展） */}
        <div className="pt-6 sm:pt-8">
          <HorizontalRow works={filtered} onOpen={setOpenWork} />
        </div>
      </div>

      <WorkModal work={openWork} onClose={() => setOpenWork(null)} />
    </section>
  )
}