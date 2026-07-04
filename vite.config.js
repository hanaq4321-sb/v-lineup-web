import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite' // 图标按需加载工具
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// https://vite.dev/config/
export default defineConfig({
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
        target: 'http://127.0.0.1:8080',
        changeOrigin: true, // 修改源
        rewrite: (path) => path.replace(/^\/api/, ''), // /api替换为空
      },
    },
    headers: {
      // 'Cross-Origin-Opener-Policy': 'same-origin',
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': 'http://tgd4482f0.hd-bkt.clouddn.com', // 允许从不同源oss上获取资源
    },
  },
  optimizeDeps: { exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] },
})
