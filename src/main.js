import './styles/css/public-style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueKonva from 'vue-konva' // 全局注册
import router from './router/index'

import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(VueKonva)
app.use(router)
app.mount('#app')
