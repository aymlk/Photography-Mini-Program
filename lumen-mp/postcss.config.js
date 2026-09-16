/**
 * 这个文件必须存在。
 *
 * postcss-loader 会沿目录向上查找 postcss 配置，上级目录是 Web 站的
 * postcss.config.js（按 Tailwind v3 方式注册了 tailwindcss），会被误加载并导致
 * "It looks like you're trying to use tailwindcss directly as a PostCSS plugin"。
 *
 * Tailwind 的编译由 weapp-tailwindcss 插件接管，这里不要注册任何插件。
 */
module.exports = {
  plugins: {},
}
