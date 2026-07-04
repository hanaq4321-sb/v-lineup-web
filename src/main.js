import './styles/css/public-style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn'
import VueKonva from 'vue-konva' // 全局注册
import router from './router/index'
import 'element-plus/theme-chalk/index.css'
import pinia from './store/store'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus, { locale })
app.use(VueKonva)
app.use(router)
app.use(pinia)
app.mount('#app')
