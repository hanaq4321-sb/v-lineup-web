import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite' // 图标按需加载工具
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// const a = import.meta.env.VITE_APP_BASEURL
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue(), vueDevTools(), Icons()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          // 获取请求路径中包含/api的请求
          // target: 'http://127.0.0.1:8080',
          target: env.VITE_APP_BASEURL,
          changeOrigin: true, // 修改源
          rewrite: (path) => path.replace(/^\/api/, ''), // /api替换为空
        },
      },
      headers: {
        // 'Cross-Origin-Opener-Policy': 'same-origin',
        // 'Cross-Origin-Embedder-Policy': 'require-corp',
        'Access-Control-Allow-Origin': 'https://v-lineup.top', // 允许从不同源oss上获取资源
      },
    },
    optimizeDeps: { exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] },
  }
})
