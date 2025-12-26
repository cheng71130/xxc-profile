import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import SvgIcon from './components/SvgIcon/index.vue';
import DataVVue3 from '@kjgl77/datav-vue3';
import elegantLoading from './directives/elegantLoading';
import debounceThrottle from './directives/debounce-throttle';
import './styles/index.scss';
import '@/assets/fonts/dsFont.css'; // 电子字体样式
import 'virtual:uno.css';

const app = createApp(App);

// 全局组件
app.component('SvgIcon', SvgIcon);
app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.use(DataVVue3);
app.use(elegantLoading);
app.use(debounceThrottle);

// 等待路由准备就绪后再挂载应用（解决loading后白屏闪烁）
router.isReady().then(() => {
  app.mount('#app')
  setTimeout(() => {
    (window as any).removeLoading?.()
  }, 0) 
})
