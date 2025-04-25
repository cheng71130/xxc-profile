import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import SvgIcon from './components/svgIcon.vue'
import '@/assets/fonts/dsFont.css' // 引入电子字体样式
import DataVVue3 from '@kjgl77/datav-vue3'
import 'virtual:uno.css'

const app = createApp(App)

// el组件汉化
app.use(ElementPlus, {
	locale: zhCn
})

//全局注册icon-svg
app.component('SvgIcon', SvgIcon)

// 注册所有el-icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.use(DataVVue3)
app.mount('#app')
