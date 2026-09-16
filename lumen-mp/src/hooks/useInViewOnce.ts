import { useEffect, useMemo, useState } from 'react'
import { createIntersectionObserver, getCurrentInstance } from '@tarojs/taro'

/**
 * 进入视口一次即触发（替代 framer-motion 的 useInView）。
 *
 * 小程序没有 DOM，无法用 getBoundingClientRect 自行判断，
 * 统一走 createIntersectionObserver。返回值里的 id 必须挂到目标节点上。
 *
 * 降级策略：API 不可用（拿不到 page 实例等）时直接返回 true，
 * 保证内容不会因为动画没触发而被永久隐藏。
 */
export function useInViewOnce(bottom = -50) {
  const id = useMemo(() => 'iv' + Math.random().toString(36).slice(2, 9), [])
  const [inView, setInView] = useState(false)

  useEffect(() => {
    let observer: ReturnType<typeof createIntersectionObserver> | undefined

    try {
      const { page } = getCurrentInstance()
      observer = createIntersectionObserver(page as never, { thresholds: [0] })
      observer.relativeToViewport({ bottom }).observe('#' + id, (res) => {
        if (res.intersectionRatio > 0) setInView(true)
      })
    } catch {
      setInView(true)
    }

    return () => observer?.disconnect()
  }, [id, bottom])

  return { id, inView }
}
