import { Text } from '@tarojs/components'

const CREAM = '#DEDBC8'

type IconProps = {
  className?: string
  color?: string
  /** 字号，单位 px */
  size?: number
}

/**
 * 小程序没有 SVG 元素，lucide-react 无法直接渲染（它依赖 document.createElement('svg')）。
 * 这里用系统字体的 ✓ / → 字形替代，配合 inline-block + transform 复刻原图标观感。
 */
export function CheckIcon({ className = '', color = CREAM, size = 13 }: IconProps) {
  return (
    <Text
      className={`inline-block leading-none ${className}`}
      style={{ color, fontSize: `${size}px` }}
    >
      ✓
    </Text>
  )
}

export function ArrowIcon({
  className = '',
  color = CREAM,
  size = 14,
  rotate = 0,
}: IconProps & { rotate?: number }) {
  return (
    <Text
      className={`inline-block leading-none ${className}`}
      style={{
        color,
        fontSize: `${size}px`,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      →
    </Text>
  )
}
