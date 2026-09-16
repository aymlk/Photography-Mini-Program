import { memo } from 'react'
import { View } from '@tarojs/components'

type AnimatedLetterProps = {
  char: string
  /** true 表示还没被滚动"点亮"，维持 0.2 的暗态 */
  dimmed: boolean
}

/**
 * 单个字符。透明度由父级按滚动进度计算后传入，
 * 过渡交给 CSS（.scroll-char），避免每个滚动事件都触发 setData。
 * memo 保证只有状态真正翻转的字符才会重渲染。
 */
function AnimatedLetterBase({ char, dimmed }: AnimatedLetterProps) {
  return (
    <View className="scroll-char" style={{ opacity: dimmed ? 0.2 : 1 }}>
      {char === ' ' ? '\u00A0' : char}
    </View>
  )
}

export default memo(AnimatedLetterBase)
