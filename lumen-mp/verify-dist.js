// 校验 dist 产物完整性。
// - 中文产物会被 \uXXXX 转义，必须解码后再 grep
// - CSS 压缩器会去掉前导零（0.24em → .24em），比对时要兼容两种写法
// - 加新内容时，把关键词加进 NEED 数组即可
const fs = require('fs')
const path = require('path')

const dist = path.join(__dirname, 'dist')
const jsFiles = [
  ...fs.readdirSync(dist).filter((f) => f.endsWith('.js')).map((f) => path.join(dist, f)),
  ...fs
    .readdirSync(path.join(dist, 'pages/index'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => path.join(dist, 'pages/index', f)),
]

let bundle = ''
for (const f of jsFiles) bundle += fs.readFileSync(f, 'utf8') + '\n'
// 双层 decode 避免嵌套转义；同时处理 \uXXXX、\xXX 等 JS 字符串转义。
const decodeOnce = (s) =>
  s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
const decoded = decodeOnce(decodeOnce(bundle))

const NEED = [
  // 品牌
  '橙梨影视',
  // 服务与套系
  '服务与套系',
  '婚礼摄影',
  '婚礼摄像',
  '摄影摄像',
  // 婚礼摄影
  '单机摄影',
  '双机摄影',
  '¥1,498',
  '¥2,598',
  '精修 40 张',
  '精修 70 张',
  '当天预告 12 张',
  '当天预告 16 张',
  '底片 ≥ 800 张',
  '底片 ≥ 1500 张',
  // 婚礼摄像
  '单机摄像',
  '双机摄像',
  '双机摄像 · 标准版',
  '双机摄像 · 完整版',
  '¥1,888',
  '¥3,288',
  '24 小时预告 30 秒',
  '24 小时预告 60 秒',
  '3 分钟花絮成片',
  '全程 20–60 分钟',
  // 组合
  '摄影摄像组合',
  '¥3,298',
  '单机位摄像 + 单机位摄影',
  // 通用
  '了解详情',
  '底片全送，不设二次收费',
  // About
  '婚礼影像',
  '把镜头交给了婚礼',
]

let miss = 0
for (const k of NEED) {
  const n = decoded.split(k).length - 1
  if (n === 0) miss++
  console.log(`${n ? '  OK  ' : ' MISS '} ${k}  x${n}`)
}
console.log(`内容缺失: ${miss} / ${NEED.length}`)

const wxss = fs.readFileSync(path.join(dist, 'app.wxss'), 'utf8')
console.log(`\napp.wxss ${fs.statSync(path.join(dist, 'app.wxss')).size} B`)

console.log('\n自定义类:')
for (const cls of ['panel-in', 'card-enter', 'pull-up', 'bg-noise', 'scroll-char']) {
  console.log(`  .${cls}: ${wxss.includes('.' + cls) ? 'OK' : 'MISS'}`)
}

console.log('\n汉字标题任意值（兼容压缩去前导零）:')
for (const v of ['14vw', '15vw', '15.5vw', '16vw', '16.5vw']) {
  console.log(`  ${v}: ${wxss.includes(v) ? 'OK' : 'MISS'}`)
}
for (const v of ['.24em', '0.24em', '.04em', '0.04em', '.26em', '0.26em', '-.04em', '-0.04em']) {
  console.log(`  ${v}: ${wxss.includes(v) ? 'OK' : 'MISS'}`)
}
console.log(`\n  nowrap: ${wxss.includes('nowrap') ? 'OK' : 'MISS'}`)

// 残留检查：Hero 不应再传 showAsterisk 给 WordsPullUp（除组件 API 定义处）。
// bundle 里 showAsterisk 出现 > 3 次（即 4 处：type + 默认值 + render 三元 + 导出 prop 注释）
// 说明 Hero 又把它传回来了。
const showAsteriskCount = decoded.split('showAsterisk').length - 1
console.log(`\nshowAsterisk 出现 ${showAsteriskCount} 次（>4 即 Hero 误传，应 ≤4）`)