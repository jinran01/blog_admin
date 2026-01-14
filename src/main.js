import { createApp } from 'vue'
import "./style.css"
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/icons/blogicon/iconfont.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import App from './App.vue'


const app = createApp(App)
app.use(ElementPlus).use(createPinia()).use(router).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}