import { createWebHistory, createRouter } from 'vue-router'

import Layout from '@/views/Layout.vue'
import LineUpKonva from '@/views/user/LineUpKonva.vue'
import LineUpEditorCopy from '@/views/user/LineUpEditor copy.vue'
import LineUpEditor from '@/views/user/LineUpEditor.vue'
import LineUpPenetrate from '@/views/user/LineUpPenetrate.vue'
import mapPointsEdit from '@/views/user/mapPointsEdit.vue'

const routes = [
  {
    path: '/',
    redirect: '/lineup',
    children: [
      { path: '/lineup', component: LineUpKonva },
      { path: '/editor', component: LineUpEditorCopy },
      { path: '/penetrate', component: LineUpPenetrate },
      { path: '/pointsEdit', component: mapPointsEdit },
    ],
  },
  // {
  //   path:'/admin',
  //   redirect:'/admin'
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
