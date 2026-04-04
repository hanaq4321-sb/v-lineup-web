import { createWebHistory, createRouter } from 'vue-router'

import Layout from '@/views/Layout.vue'
import LineUpKonva from '@/views/components/LineUpKonva.vue'
import LineUpEditor from '@/views/components/LineUpEditor.vue'

const routes = [
  {
    path: '/',
    redirect: '/lineup',
    children: [
      { path: '/lineup', component: LineUpKonva },
      { path: '/editor', component: LineUpEditor },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
