import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import SvgIcon from './components/svgIcon.vue';
import DataVVue3 from '@kjgl77/datav-vue3';
import elegantLoading from './directives/elegantLoading/index';
import './styles/index.scss';
import '@/assets/fonts/dsFont.css'; // 电子字体样式
import 'virtual:uno.css';

const app = createApp(App);

// 全局组件
app.component('SvgIcon', SvgIcon);

// 注册所有el-icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.use(DataVVue3);
app.use(elegantLoading);
app.mount('#app');
