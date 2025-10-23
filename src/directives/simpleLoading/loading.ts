import { Directive, DirectiveBinding } from 'vue';

interface LoadingElement extends HTMLElement {
    __loadingInstance?: HTMLElement;
    __originalPosition?: string;
}

const loadingDirective: Directive = {
    mounted(el: LoadingElement, binding: DirectiveBinding) {
        if (binding.value) {
            appendLoading(el);
        }
    },

    updated(el: LoadingElement, binding: DirectiveBinding) {
        if (binding.value !== binding.oldValue) {
            if (binding.value) {
                appendLoading(el);
            } else {
                removeLoading(el);
            }
        }
    },

    unmounted(el: LoadingElement) {
        removeLoading(el);
    },
};

// 创建 loading 遮罩层
function createLoadingElement(el: HTMLElement): HTMLElement {
    const loadingWrapper = document.createElement('div');
    loadingWrapper.className = 'simple-loading-mask';

    // ✅ 自动继承父元素的圆角
    const computedStyle = window.getComputedStyle(el);
    const borderRadius = computedStyle.borderRadius || '0';

    loadingWrapper.style.cssText = `  
    position: absolute;  
    top: 0;  
    left: 0;  
    right: 0;  
    bottom: 0;  
    display: flex;  
    flex-direction: column;  
    align-items: center;  
    justify-content: center;  
    background-color: rgba(255, 255, 255, 0.9);  
    backdrop-filter: blur(2px);  
    z-index: 2000;  
    opacity: 0;  
    transition: opacity 0.3s ease;
    border-radius: ${borderRadius};
  `;

    // 创建旋转圆环
    const spinner = document.createElement('div');
    spinner.className = 'simple-loading-spinner';
    spinner.style.cssText = `  
    width: 35px;  
    height: 35px;  
    border: 3px solid #f3f3f3;  
    border-top: 3px solid var(--el-color-primary);  
    border-radius: 50%;  
    animation: simple-spin 0.8s linear infinite;  
  `;

    // 创建加载文字
    const text = document.createElement('div');
    // text.textContent = '加载中...';
    text.textContent = '';
    text.style.cssText = `  
    margin-top: 12px;  
    font-size: 14px;  
    color: var(--el-color-primary);  
    font-weight: 500;  
  `;

    loadingWrapper.appendChild(spinner);
    loadingWrapper.appendChild(text);

    return loadingWrapper;
}

// 添加 loading
function appendLoading(el: LoadingElement) {
    if (el.__loadingInstance) {
        return;
    }

    // 设置父元素为相对定位
    const position = window.getComputedStyle(el).position;
    if (position === 'static' || position === '') {
        el.__originalPosition = position;
        el.style.position = 'relative';
    }

    // ✅ 传入 el 参数以获取圆角
    const loadingInstance = createLoadingElement(el);
    el.__loadingInstance = loadingInstance;
    el.appendChild(loadingInstance);

    // 触发淡入动画
    setTimeout(() => {
        loadingInstance.style.opacity = '1';
    }, 10);
}

// 移除 loading
function removeLoading(el: LoadingElement) {
    const loadingInstance = el.__loadingInstance;
    if (!loadingInstance) {
        return;
    }

    // 淡出动画
    loadingInstance.style.opacity = '0';

    // 动画结束后移除
    setTimeout(() => {
        if (loadingInstance.parentNode) {
            loadingInstance.parentNode.removeChild(loadingInstance);
        }
        el.__loadingInstance = undefined;

        // 恢复原始 position
        if (el.__originalPosition !== undefined) {
            el.style.position = el.__originalPosition;
        }
    }, 300);
}

export default loadingDirective;
