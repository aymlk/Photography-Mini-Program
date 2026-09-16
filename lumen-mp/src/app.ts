import type { PropsWithChildren } from 'react'
import { loadFontFace, useLaunch } from '@tarojs/taro'
import './app.css'
import { FONT_FACES } from './config/assets'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    // 字体是锦上添花，加载失败不应影响页面渲染，因此逐个静默处理
    FONT_FACES.forEach((face) => {
      loadFontFace({ global: true, family: face.family, source: face.source }).catch(() => {})
    })
  })

  return children
}

export default App
