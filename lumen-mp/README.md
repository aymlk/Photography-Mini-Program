# 橙梨影视 · 微信小程序端

由同目录 Web 站（Vite + React + framer-motion + Tailwind v3）迁移而来的小程序版本。
视觉与文案保持一致，底层栈做了小程序适配替换。

## 技术栈

| Web 站 | 小程序端 | 原因 |
| --- | --- | --- |
| React DOM | Taro 4.2 + React 18 | 小程序无 DOM/BOM |
| framer-motion | CSS keyframes + `createIntersectionObserver` + `usePageScroll` | 依赖 DOM ref / WAAPI / `window`，不可用 |
| lucide-react | 自绘字形图标 `src/components/Icons.tsx` | 小程序无 SVG 元素，`ReactDOM.createElement('svg')` 不可用 |
| Tailwind v3 | Tailwind v4 + `weapp-tailwindcss` 5.x | 由插件转译 WXSS 兼容类名、去 preflight 风险、rem→rpx |
| `<video>` + 普通叠层 | Taro `Video` + `objectFit="cover"` | 原生组件，`object-cover` 类无效 |
| Google Fonts `<link>` | `wx.loadFontFace`（需自托管） | 小程序无 link 标签 |

## 本地开发

```bash
npm install
npm run dev:weapp     # 产出到 dist/
```

用微信开发者工具导入项目根目录（`miniprogramRoot` 已指向 `dist/`），AppID 可用测试号/游客模式。

> 若 Tailwind 原子类不生效，先在开发者工具里关闭「代码自动热重载」再预览。

## 上线前必做

1. **配置 downloadFile 合法域名**（开发 → 开发管理 → 开发设置 → 服务器域名）：
   - `d8j0ntlcm91z4.cloudfront.net`（两段视频）
   - `images.higgs.ai`（三张卡片图标）
   未配置时开发者工具（勾了"不校验合法域名"）可预览，**真机一律加载失败**。
2. **字体自托管**：Google Fonts 域名不可达且无法进白名单。把 Almarai / Instrument Serif 的
   woff2 放到自己的 HTTPS 域名下，然后填进 `src/config/assets.ts` 的 `FONT_FACES`：
   ```ts
   export const FONT_FACES = [
     { family: 'Almarai', source: 'url("https://cdn.example.com/fonts/Almarai-Regular.woff2")' },
   ]
   ```
   > 汉字不需要自托管：品牌名与正文在小程序端走系统字体（iOS 苹方 / Android 思源黑体），
   > 观感与 Web 端的 Noto Sans SC 接近。中文字库动辄数 MB，为四个字引入不划算。
   留空 = 回落系统字体（苹方/思源），排版不会崩，只是少了品牌字形。
3. 主包体积：视频与图片全部走 CDN，未打包进本地；当前产物约 200KB 量级。

## 已知限制

- `mix-blend-overlay`（Hero 胶片颗粒）依赖 WebView 渲染器；若切换 Skyline 渲染需降级为纯 `opacity` 叠加。
- 视频为原生组件，叠层依赖「同层渲染」。若真机上叠层被视频盖住，把 `grad-hero` / 文字那一层换成
  `CoverView`（但 cover-view 对渐变背景支持有限，需改成分段纯色）。
- 逐字滚动点亮按整数步进（每步切换一个字符的明/暗态），不是 Web 端连续插值，
  目的是避免每个 scroll 事件都触发全量 setData。
- 小程序无 `:hover`，导航项与 CTA 的 hover 态已改为点击行为（锚点滚动 / 复制邮箱）。
