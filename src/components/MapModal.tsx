import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import ContactMap from './ContactMap'
import { CONTACT, tencentMapUri, type ContactLocation } from '../content/contact'

const EASE = [0.16, 1, 0.3, 1] as const

type Props = {
  loc: ContactLocation | null
  onClose: () => void
}

/**
 * 位置详情弹窗 —— 点小地图后展开。
 * 展示桐庐定位 + 跳转腾讯地图（URI API，官方无需 key）。
 */
export default function MapModal({ loc, onClose }: Props) {
  useEffect(() => {
    if (!loc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [loc, onClose])

  const target = loc ?? CONTACT.location

  return (
    <AnimatePresence>
      {loc && (
        <motion.div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-black sm:items-center sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md sm:bg-black/85" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${target.label} 位置`}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-[#101010] sm:h-auto sm:max-h-[90vh] sm:max-w-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部条带 */}
            <div className="flex items-start justify-between gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/70 sm:text-[11px]">
                  工作室位置
                </span>
                <h2 className="mt-1 truncate text-lg font-medium text-[#E1E0CC] sm:text-xl">
                  {target.label}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#E1E0CC] backdrop-blur transition-colors hover:bg-white/20 sm:h-10 sm:w-10"
              >
                <X className="h-5 w-5 sm:h-4 sm:w-4" strokeWidth={2} />
              </button>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <ContactMap
                size="lg"
                loc={target}
                onClick={() => window.open(tencentMapUri(target), '_blank', 'noopener')}
              />

              <dl className="mt-5 space-y-3">
                <Row label="详细地址" value={target.detail} />
                <Row
                  label="坐标"
                  value={`${target.lat.toFixed(4)}, ${target.lng.toFixed(4)}（GCJ-02）`}
                />
                <Row label="接单范围" value="以桐庐为基地，杭州、上海及周边城市均可到场" />
              </dl>

              <a
                href={tencentMapUri(target)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-medium text-black transition-opacity hover:opacity-90 sm:text-sm"
              >
                在腾讯地图中打开
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </a>
              <p className="mt-2.5 text-center text-[10px] leading-relaxed text-gray-500 sm:text-[11px]">
                地图为示意绘制，导航请以腾讯地图实际路线为准
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <dt className="w-[72px] shrink-0 text-[11px] text-gray-500 sm:text-xs">{label}</dt>
      <dd className="flex-1 text-[12px] leading-relaxed text-[#E1E0CC] sm:text-[13px]">{value}</dd>
    </div>
  )
}
