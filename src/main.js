import './style/css/public-style.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import * as fabric from 'fabric'
import 'element-plus/dist/index.css'
import VueKonva from 'vue-konva' // 全局注册

const app = createApp(App)

app.use(ElementPlus)
// app.use(fabric)
app.use(VueKonva)
app.mount('#app')
