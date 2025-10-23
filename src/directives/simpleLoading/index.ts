import { App } from 'vue';
import loadingDirective from './loading';

// 添加全局 CSS 动画
const style = document.createElement('style');
style.textContent = `
  @keyframes custom-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

export default {
    install(app: App) {
        app.directive('custom-loading', loadingDirective);
    },
};
