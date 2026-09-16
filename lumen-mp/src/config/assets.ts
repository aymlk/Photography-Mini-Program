/**
 * 外链资源集中管理。
 *
 * ⚠️ 上线前必须把这些域名配进小程序后台
 *    「开发 → 开发管理 → 开发设置 → 服务器域名 → downloadFile 合法域名」，
 *    否则开发者工具（勾了"不校验合法域名"）能预览，真机一律加载失败。
 */
export const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

export const CARD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

export const ICONS = {
  storyboard:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  critique:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  capsule:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
}

export const CONTACT_EMAIL = 'hello@chengli.studio'

/**
 * 自定义字体。小程序不支持 <link> 引入 Google Fonts，只能用 wx.loadFontFace。
 * 字体文件必须自托管到「已备案 + 已在 downloadFile 白名单」的 HTTPS 域名。
 *
 * 留空数组 = 不加载，自动回落到系统字体（PingFang / 苹方），样式不会崩。
 * 接入示例：
 *   { family: 'Almarai', source: 'url("https://cdn.example.com/fonts/Almarai-Regular.woff2")' }
 */
export const FONT_FACES: { family: string; source: string }[] = []
