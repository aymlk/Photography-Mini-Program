import path from 'node:path'
import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import { WeappTailwindcss } from 'weapp-tailwindcss/webpack'

const projectRoot = path.resolve(__dirname, '..')

const weappTailwindcssOptions = {
  cssOptions: {
    // 把 rem 转成 rpx，保证 Tailwind 的间距/字号在小程序上等比缩放
    rem2rpx: true,
  },
  tailwindcssBasedir: projectRoot,
  cssEntries: [path.resolve(projectRoot, 'src/app.css')],
}

type ChainLike = { merge: (opts: Record<string, unknown>) => void }

function registerWeappTailwindcss(chain: ChainLike) {
  chain.merge({
    plugin: {
      install: {
        plugin: WeappTailwindcss,
        args: [weappTailwindcssOptions],
      },
    },
  })
}

export default defineConfig(() => {
  const config: UserConfigExport<'webpack5'> = {
    projectName: 'lumen-mp',
    date: '2026-9-6',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-platform-weapp'],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      // prebundle 会干扰 weapp-tailwindcss 的定位与排错，关闭
      prebundle: { enable: false },
    },
    cache: { enable: false },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: { selectorBlackList: ['no-px'] },
        },
        cssModules: { enable: false },
      },
      webpackChain(chain) {
        registerWeappTailwindcss(chain as unknown as ChainLike)
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      postcss: {
        autoprefixer: { enable: true, config: {} },
        cssModules: { enable: false },
      },
      webpackChain(chain) {
        registerWeappTailwindcss(chain as unknown as ChainLike)
      },
    },
  }

  return config
})
