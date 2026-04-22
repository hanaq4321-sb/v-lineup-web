import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite' // 图标按需加载工具
import imagemin from 'unplugin-imagemin/vite' //将图片压缩为webp

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), Icons()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // build: {
  //   assetsInclude: ['**/*.png', '**/*.jpg', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.jpeg'],
  //   assetsInlineLimit: 0,
  // },
})

// imagemin({
//   mode: 'sharp',
//   compress: {
//     jpg: {
//       quality: 80,
//     },
//     jpeg: {
//       quality: 80,
//     },
//     png: {
//       quality: 80,
//     },
//     webp: {
//       quality: 80,
//     },
//   },
//   conversion: [
//     { from: 'png', to: 'webp' },
//     { from: 'jpg', to: 'webp' },
//     { from: 'jpeg', to: 'webp' },
//   ],
//   cache: false,
// }),
