# Lumen Studio 项目长期记忆

> **工程根目录（2026-09-16 起）**：`D:\桌面\aicodeing\摄影小程序`（Web 根 + `lumen-mp/` 子工程）。系统提示注入的旧 `C:\Users\AYMOLK\WorkBuddy\2026-09-06-21-13-10` 路径已失效，记忆读写一律用本目录。

## 品牌

**橙梨影视**（婚礼影像工作室，桐庐）。2026-09-07 从 Lumen Studio 重命名，两端已全量替换、旧品牌 0 残留。
联系邮箱 `hello@chengli.studio`。原 `Lumen` 拉丁字标相关的排版参数已按汉字重算，不要再套回去。

## 技术栈分布

- **Web 站**（工作区根目录）：Vite + React 18 + TS + Tailwind v3 + framer-motion + lucide-react + Google Fonts
- **微信小程序端**（`lumen-mp/`）：Taro 4.2 + React 18 + TS + Tailwind v4 + weapp-tailwindcss 5.5

两套工程独立维护，互不复用源码。两边使用相同的视觉 token（`#DEDBC8` 主色 / `#E1E0CC` 文本、Almarai + Instrument Serif 字体目标）。

## 小程序端 6 个非显然坑（迁移时必须知道）

1. **APPDATA 环境变量**：本机沙箱的 Bash 不带 `APPDATA`，Taro 内部走 npm-conf 读 `path.resolve(undefined, ...)` 会崩。运行命令前先 `APPDATA="C:\\Users\\AYMOLK\\AppData\\Roaming"`。用户自己本机终端一般自带，无此问题。
2. **postcss.config.js 必须存在且为空**：postcss-loader 向上查找会吞到上级目录（Web 站的 `postcss.config.js`，按 v3 注册了 `tailwindcss`），引发 "It looks like you're trying to use tailwindcss directly as a PostCSS plugin"。**必须**在 `lumen-mp/postcss.config.js` 写 `module.exports = { plugins: {} }` 来阻断向上查找。
3. **babel-preset-taro 的 peerDependencies 必须手装**：Taro 模板里默认装好，但脱离模板手搭时少一个就崩。要：`@babel/core`, `@babel/preset-react`, `@prefresh/babel-plugin`, `react-refresh@^0.14.0`（不是 0.18——preset 的 peer 是 ^0.14.0，写 ^0.18 会 ERESOLVE）。
4. **WXSS 不支持 `*` 通配符**：全局字体只能用 `page, view, text, image, video, cover-view` 元素选择器 + 继承下发，preflight 里的 `*` 也会被插件改造。
5. **SVG data URI 必须 base64**：未编码的 `url("data:image/svg+xml,<svg...>")` 在 WXSS 下不稳；改为 `url("data:image/svg+xml;base64,...")` 才稳定渲染。
6. **Tailwind v4 渐变类名差异**：v4 把 `bg-gradient-to-*` 重命名为 `bg-linear-to-*`，跨版本不确定时，手写 `linear-gradient(...)` 工具类放进 `app.css` 是最稳的。

## 业务模型（页面内容结构的依据）

婚礼影像工作室，**三条业务线**（与价格表一致）：

- **婚礼摄影**：2 档套系
  - 单机摄影 ¥1,498：精修 40 张 / 当天预告 12 张 / 底片 ≥ 800 张
  - 双机摄影 ¥2,598：精修 70 张 / 当天预告 16 张 / 底片 ≥ 1500 张
- **婚礼摄像**：3 档套系（不再做机位 × 交付形态的矩阵切换）
  - 单机摄像 ¥1,498：24 小时预告 30 秒 / 全程 20–60 分钟
  - 双机摄像 · 标准版 ¥1,888：3 分钟花絮成片 / 全程 20–60 分钟
  - 双机摄像 · 完整版 ¥3,288：24 小时预告 60 秒 / 3 分钟花絮成片 / 全程 20–60 分钟
- **婚礼摄影摄像**：1 档组合
  - 摄影摄像组合 ¥3,298：单机位摄像 + 单机位摄影 / 24 小时预告 30 秒 + 12 张精修图 / 精修 40 张 / 底片 ≥ 800 张 / 全程 20–60 分钟 + 3 分钟花絮成片

业务数据集中在 `src/content/services.ts`（Web）与 `lumen-mp/src/config/services.ts`（小程序），**两份内容需手工同步**。

## 动效降级约定（framer-motion → CSS keyframes）

- 入场上滑 / 缩放：用 `@keyframes` + `animation-delay` 内联控制错峰，触发时机用 `animation-play-state: running/paused` 切换（不靠 React state 来驱动，避免每个 scroll 事件触发 setData）。
- 滚动逐字：父级用 `usePageScroll` + `createSelectorQuery` 量一次 rect，每帧把进度量化到整数 `revealed` 数，只在该整数变化时 setState；字符子节点用 `memo` + `transition: opacity .35s linear` 平滑过渡。
- 进入视口：`useInViewOnce` hook，封装 `createIntersectionObserver` + `getCurrentInstance().page`；**fallback 必须只 fail-open**（API 不可用直接显示），不能用超时兜底，否则远在屏外的 Features 卡会先被动效吃掉。
- Tab / 机位切换这类**局部状态切换**：Web 端用 `motion.span layoutId` 做滑块 + 面板加 `key` 重挂载重播入场；小程序端没有 layoutId，改成条件类名切换，面板靠 `key` 重挂载 + `.panel-in` keyframes 重播。

## 汉字排版约定（巨型标题 / 上标星号）

品牌名是汉字，与拉丁字标的排版参数不通用，改动时别直接套 vw 数值：

- **字号**：按「容器内 N 字铺满」反推，但 mobile 不能用太大（4 字 × 字号 ≤ 栏宽）。当前 Hero：`text-[18vw] md:text-[15vw] lg:text-[14vw] xl:text-[13vw] 2xl:text-[12vw]`。
- **强制单行**：汉字 inline 排版会自动断字（"橙梨 / 影视"自然换两行），必须 h1 加 `whitespace-nowrap` + `WordsPullUp` 传 `wrap={false}`（组件默认 `wrap=true` 保留 About/Features 多词标题的可换行能力）。
- **负字距**：汉字用 `-0.04em`。拉丁那套 `-0.07em` 会让汉字糊在一起。
- **行高**：**`1.05`**。`0.9` 会把中文字顶部/底部裁掉，必须 ≥ 1.0。
- **字重**：`700`。黑体在超大字号下 500 显得单薄。
- **不要加 `overflow: hidden`**：和压缩行高叠加会把字顶部切掉。
- **上标星号 `showAsterisk` 仅适用于拉丁字标**：汉字上方挂西文星号视觉上像"被注释掉的文字"，语义完全不对，**Hero 中文标题不应使用**。如果未来要做品牌签名感，应改成中文设计语言里的元素（如印章 / 句号 / 引号），不要再用西文星号。
- 组件 prop `showAsterisk` 仍保留，API 能力不删；只是 Hero 这个调用方不传。
- **不引入 Noto Serif SC**：Google Fonts 失败时 Windows 回落到 SimSun，超大字号观感很差。Noto Sans SC（思源黑体）fallback 到苹方/雅黑稳定，已满足规范。

## 产物内容校验的正确姿势（易踩坑）

小程序产物里的中文是 `\uXXXX` 转义，直接 `grep '中文'` 恒为 0；且内容会分散在 app.js / pages/index/index.js 等多个分包。

- 用 `lumen-mp/verify-dist.js`（已入库）：递归扫 `dist/**/*.js` → 解码 `\uXXXX` → 逐项比对关键词 → 顺带检查 app.wxss 里的自定义类是否齐全。改完内容跑一次即可回归。
- **禁止用 `node -e "..."` 内联做中文/转义校验**：`\\\\u` 经 bash 与 JS 双重转义后正则会失效，会报出假 MISS。校验脚本必须写成文件执行。
- **CSS 压缩器会去掉前导零**：`0.24em` → `.24em`、`-0.04em` → `-.04em`。按未压缩形式比对会误报 MISS，`verify-dist.js` 已兼容两种写法。
- `postcss-calc: infinity * 1rpx` 警告无害，CssMinimizer 会丢掉该无效声明，最终 `dist/app.wxss` 搜不到 `infinity`。
