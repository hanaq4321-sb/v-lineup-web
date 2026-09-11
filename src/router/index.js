import { createWebHistory, createRouter } from 'vue-router'

import Layout from '@/views/Layout.vue'
import LineUpKonva from '@/views/user/LineUpKonva.vue'
import LineUpEditor from '@/views/user/LineUpEditor.vue'
import LineUpPenetrate from '@/views/user/LineUpPenetrate.vue'
import mapPointsEdit from '@/views/user/mapPointsEdit.vue'
import searchResult from '@/views/user/searchResult.vue'

const routes = [
  {
    path: '/',
    redirect: '/lineup',
    children: [
      { path: '/lineup', component: LineUpKonva },
      { path: '/editor', component: LineUpEditor },
      { path: '/penetrate', component: LineUpPenetrate },
      { path: '/pointsEdit', component: mapPointsEdit },
      { path: '/searchResult', component: searchResult },
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
