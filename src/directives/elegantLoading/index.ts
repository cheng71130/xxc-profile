import { App } from 'vue';
import loadingDirective from './loading';

// 添加全局 CSS 动画
const style = document.createElement('style');
style.textContent = `
  /* 旋转动画 */
  @keyframes custom-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* 三点跳动 */
  @keyframes dots-bounce {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* 竖条波浪 */
  @keyframes bars-scale {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }

  /* 双环旋转 */
  @keyframes ring-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes ring-rotate-reverse {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(-360deg); }
  }

  /* 脉冲动画 */
  @keyframes pulse-scale {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  /* 渐变旋转 */
  @keyframes gradient-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default {
    install(app: App) {
        app.directive('elegant-loading', loadingDirective);
    }
};