import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite' // 图标按需加载工具

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
  },
})
