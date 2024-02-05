import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import 'default-passive-events'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'
// 统一注册所有 element-ui 图标
import { loadIcon } from './utils/icon'
import pinia from './stores/index'
const app = createApp(App)

// app.use(createPinia())
app.use(router).use(pinia)
app.use(ElementPlus, {
  locale: zhCn
})

loadIcon(app)

app.mount('#app')
