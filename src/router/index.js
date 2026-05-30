import { createWebHistory, createRouter } from 'vue-router'

import Layout from '@/views/Layout.vue'
import LineUpKonva from '@/views/components/LineUpKonva.vue'
import LineUpEditorCopy from '@/views/components/LineUpEditor copy.vue'
import LineUpEditor from '@/views/components/LineUpEditor.vue'
import LineUpPenetrate from '@/views/components/LineUpPenetrate.vue'

const routes = [
  {
    path: '/',
    redirect: '/lineup',
    children: [
      { path: '/lineup', component: LineUpKonva },
      { path: '/editor', component: LineUpEditorCopy },
      { path: '/penetrate', component: LineUpPenetrate },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
