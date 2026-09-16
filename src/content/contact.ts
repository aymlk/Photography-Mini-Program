/**
 * 联系方式 —— 占位值集中在本文。
 * 用户提供真实信息后，只改本文件的 CONTACT 对象即可，组件不用动。
 *
 * 地图坐标使用 GCJ-02（火星坐标），腾讯地图 / 高德地图通用。
 */

export type ContactLocation = {
  /** 纬度 */
  lat: number
  /** 经度 */
  lng: number
  /** 地图上的显示名 */
  label: string
  /** 详细地址 */
  detail: string
}

export type ContactInfo = {
  /** 工作室名 */
  studio: string
  /** 一句话简介（显示在工作室名下方） */
  tagline: string
  /** 微信（占位） */
  wechat: string
  /** 电话（占位） */
  phone: string
  /** 邮箱 */
  email: string
  /** 营业/接单说明 */
  hours: string
  location: ContactLocation
}

export const CONTACT: ContactInfo = {
  studio: '橙梨影视',
  tagline: '婚礼摄影 · 婚礼摄像 · 品牌影像',
  wechat: 'chengli_studio', // TODO 占位：替换为真实微信号
  phone: '138-0000-0000', // TODO 占位：替换为真实电话
  email: 'hello@chengli.studio',
  hours: '全年接单，建议提前 2–3 个月预约档期',
  location: {
    // 浙江省杭州市桐庐县（桐君街道一带）
    lat: 29.8012,
    lng: 119.6895,
    label: '杭州市 · 桐庐县',
    detail: '浙江省杭州市桐庐县',
  },
}

/** 电话去掉分隔符，用于 tel: 链接与复制 */
export const PHONE_RAW = CONTACT.phone.replace(/[^\d+]/g, '')

/**
 * 腾讯地图 URI API —— 官方跳转协议，无需申请 key。
 * 在浏览器中打开会显示该坐标的定位（marker）。
 */
export function tencentMapUri(loc: ContactLocation = CONTACT.location): string {
  const marker = [
    `coord:${loc.lat},${loc.lng}`,
    `title:${encodeURIComponent(loc.label)}`,
    `addr:${encodeURIComponent(loc.detail)}`,
  ].join(';')
  return `https://apis.map.qq.com/uri/v1/marker?marker=${marker}&referer=chengli-studio`
}
