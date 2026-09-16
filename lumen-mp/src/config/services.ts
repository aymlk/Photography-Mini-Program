/**
 * 婚礼服务业务数据，与价格表一一对应。
 * 三大类别：婚礼摄影 / 婚礼摄像 / 婚礼摄影摄像。
 *
 * 与 Web 站 src/content/services.ts 内容保持一致。
 */

export type ServicePackage = {
  id: string
  number: string
  name: string
  price: string
  /** 卡片顶部标签，例如「精修 40 张 / 当天预告 12 张」 */
  highlights: string[]
  /** 详细说明清单 */
  items: string[]
}

/** 婚礼摄影 */
export const PHOTO_PACKAGES: ServicePackage[] = [
  {
    id: 'photo-single',
    number: '01',
    name: '单机摄影.',
    price: '¥1,498',
    highlights: ['精修 40 张', '当天预告 12 张', '底片 ≥ 800 张'],
    items: [
      '1 位摄影师单机位全程跟拍',
      '底片拍摄不少于 800 张，全部原片交付',
      '精修 40 张，当天预告 12 张',
      '云相册交付，可随时下载与分享',
    ],
  },
  {
    id: 'photo-dual',
    number: '02',
    name: '双机摄影.',
    price: '¥2,598',
    highlights: ['精修 70 张', '当天预告 16 张', '底片 ≥ 1500 张'],
    items: [
      '2 位摄影师双机位协同跟拍',
      '底片拍摄不少于 1500 张，全部原片交付',
      '精修 70 张，当天预告 16 张',
      '多角度记录仪式与宾客反应',
      '云相册交付，可随时下载与分享',
    ],
  },
]

/** 婚礼摄像 */
export const VIDEO_PACKAGES: ServicePackage[] = [
  {
    id: 'video-single',
    number: '01',
    name: '单机摄像.',
    price: '¥1,498',
    highlights: ['24 小时预告 30 秒', '全程 20–60 分钟'],
    items: [
      '1 位摄像师单机位全程记录',
      '婚礼后 24 小时内交付 30 秒预告',
      '完整成片 20–60 分钟，保留仪式原声',
      '适合小型婚礼与户外仪式',
    ],
  },
  {
    id: 'video-dual-basic',
    number: '02',
    name: '双机摄像 · 标准版.',
    price: '¥1,888',
    highlights: ['3 分钟花絮成片', '全程 20–60 分钟'],
    items: [
      '2 位摄像师双机位协同拍摄',
      '主机记录仪式主线，副机捕捉细节与宾客',
      '交付 3 分钟花絮高光成片',
      '完整纪录片 20–60 分钟',
    ],
  },
  {
    id: 'video-dual-pro',
    number: '03',
    name: '双机摄像 · 完整版.',
    price: '¥3,288',
    highlights: ['24 小时预告 60 秒', '3 分钟花絮成片', '全程 20–60 分钟'],
    items: [
      '2 位摄像师双机位协同拍摄',
      '婚礼后 24 小时内交付 60 秒预告',
      '3 分钟花絮成片 + 20–60 分钟完整纪录片',
      '双路收音 + 稳定器，仪式全程无死角',
    ],
  },
]

/** 婚礼摄影摄像 */
export const COMBO_PACKAGES: ServicePackage[] = [
  {
    id: 'combo-single',
    number: '01',
    name: '摄影摄像组合.',
    price: '¥3,298',
    highlights: ['单机位摄像 + 单机位摄影', '24 小时预告 30 秒', '精修 40 张'],
    items: [
      '1 位摄影师 + 1 位摄像师协同跟拍',
      '24 小时内交付 30 秒视频预告',
      '当天精修预告图 12 张',
      '精修 40 张，底片不少于 800 张',
      '完整视频 20–60 分钟 + 3 分钟花絮成片',
      '云相册交付，可随时下载与分享',
    ],
  },
]

/** 通用承诺 */
export const SERVICE_PROMISES = [
  '底片全送，不设二次收费',
  '签约前一对一沟通，确认流程与风格',
  '交付后 7 天内可免费微调一次',
]
