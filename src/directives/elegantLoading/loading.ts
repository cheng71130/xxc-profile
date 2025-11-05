import { Directive, DirectiveBinding } from 'vue';

interface LoadingElement extends HTMLElement {
    __loadingInstance?: HTMLElement;
    __originalPosition?: string;
}

interface LoadingOptions {
    show?: boolean;
    type?: 'spinner' | 'dots' | 'bars' | 'ring' | 'pulse' | 'gradient';
    text?: string;
    color?: string;
    background?: string;
}

const loadingDirective: Directive = {
    mounted(el: LoadingElement, binding: DirectiveBinding) {
        const shouldShow = typeof binding.value === 'object' ? binding.value.show !== false : binding.value;
        if (shouldShow) {
            const options = typeof binding.value === 'object' ? binding.value : { type: 'spinner' };
            appendLoading(el, options);
        }
    },

    updated(el: LoadingElement, binding: DirectiveBinding) {
        const oldValue = binding.oldValue;
        const newValue = binding.value;

        const shouldShow = typeof newValue === 'object' ? newValue.show !== false : newValue;
        const wasShown = typeof oldValue === 'object' ? oldValue.show !== false : oldValue;

        if (shouldShow !== wasShown) {
            if (shouldShow) {
                const options = typeof newValue === 'object' ? newValue : { type: 'spinner' };
                appendLoading(el, options);
            } else {
                removeLoading(el);
            }
        }
    },

    unmounted(el: LoadingElement) {
        removeLoading(el);
    },
};

// 样式函数
function createSpinnerLoading(options: LoadingOptions): string {
    const color = options.color || 'var(--el-color-primary)';
    return `
        <div class="loading-spinner" style="
            width: 35px;
            height: 35px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid ${color};
            border-radius: 50%;
            animation: custom-spin 0.8s linear infinite;
        "></div>
    `;
}

function createDotsLoading(options: LoadingOptions): string {
    const color = options.color || 'var(--el-color-primary)';
    return `
        <div style="display: flex; gap: 8px;">
            <div class="loading-dot" style="
                width: 12px;
                height: 12px;
                background-color: ${color};
                border-radius: 50%;
                animation: dots-bounce 1.4s infinite ease-in-out both;
                animation-delay: -0.32s;
            "></div>
            <div class="loading-dot" style="
                width: 12px;
                height: 12px;
                background-color: ${color};
                border-radius: 50%;
                animation: dots-bounce 1.4s infinite ease-in-out both;
                animation-delay: -0.16s;
            "></div>
            <div class="loading-dot" style="
                width: 12px;
                height: 12px;
                background-color: ${color};
                border-radius: 50%;
                animation: dots-bounce 1.4s infinite ease-in-out both;
            "></div>
        </div>
    `;
}

function createBarsLoading(options: LoadingOptions): string {
    const color = options.color || 'var(--el-color-primary)';
    return `
        <div style="display: flex; gap: 5px; align-items: center;">
            <div class="loading-bar" style="
                width: 4px;
                height: 35px;
                background-color: ${color};
                border-radius: 2px;
                animation: bars-scale 1s infinite ease-in-out;
                animation-delay: 0s;
            "></div>
            <div class="loading-bar" style="
                width: 4px;
                height: 35px;
                background-color: ${color};
                border-radius: 2px;
                animation: bars-scale 1s infinite ease-in-out;
                animation-delay: 0.1s;
            "></div>
            <div class="loading-bar" style="
                width: 4px;
                height: 35px;
                background-color: ${color};
                border-radius: 2px;
                animation: bars-scale 1s infinite ease-in-out;
                animation-delay: 0.2s;
            "></div>
            <div class="loading-bar" style="
                width: 4px;
                height: 35px;
                background-color: ${color};
                border-radius: 2px;
                animation: bars-scale 1s infinite ease-in-out;
                animation-delay: 0.3s;
            "></div>
            <div class="loading-bar" style="
                width: 4px;
                height: 35px;
                background-color: ${color};
                border-radius: 2px;
                animation: bars-scale 1s infinite ease-in-out;
                animation-delay: 0.4s;
            "></div>
        </div>
    `;
}

function createRingLoading(options: LoadingOptions): string {
    const color = options.color || 'var(--el-color-primary)';
    return `
        <div style="position: relative; width: 50px; height: 50px;">
            <div style="
                position: absolute;
                width: 50px;
                height: 50px;
                border: 4px solid transparent;
                border-top-color: ${color};
                border-radius: 50%;
                animation: ring-rotate 1.2s linear infinite;
            "></div>
            <div style="
                position: absolute;
                width: 35px;
                height: 35px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 4px solid transparent;
                border-bottom-color: ${color};
                border-radius: 50%;
                animation: ring-rotate-reverse 0.8s linear infinite;
            "></div>
        </div>
    `;
}

function createPulseLoading(options: LoadingOptions): string {
    const color = options.color || 'var(--el-color-primary)';
    return `
        <div style="position: relative; width: 50px; height: 50px;">
            <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: ${color};
                border-radius: 50%;
                opacity: 0.6;
                animation: pulse-scale 1.5s infinite ease-in-out;
            "></div>
            <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: ${color};
                border-radius: 50%;
                opacity: 0.6;
                animation: pulse-scale 1.5s infinite ease-in-out;
                animation-delay: -0.75s;
            "></div>
        </div>
    `;
}

function createGradientLoading(): string {
    return `
        <div style="
            width: 35px;
            height: 35px;
            border: 4px solid transparent;
            border-radius: 50%;
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%) border-box;
            animation: gradient-rotate 1.5s linear infinite;
        ">
            <div style="
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
            "></div>
        </div>
    `;
}

// 创建 loading 遮罩层
function createLoadingElement(el: HTMLElement, options: LoadingOptions): HTMLElement {
    const loadingWrapper = document.createElement('div');
    loadingWrapper.className = 'custom-loading-mask';

    const bgColor = options.background || 'rgba(255, 255, 255, 0.9)';

    // 自动继承父元素的圆角
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
        background-color: ${bgColor};
        backdrop-filter: blur(2px);
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: ${borderRadius};
    `;

    // 根据类型选择样式
    let loadingHTML = '';
    switch (options.type) {
        case 'dots':
            loadingHTML = createDotsLoading(options);
            break;
        case 'bars':
            loadingHTML = createBarsLoading(options);
            break;
        case 'ring':
            loadingHTML = createRingLoading(options);
            break;
        case 'pulse':
            loadingHTML = createPulseLoading(options);
            break;
        case 'gradient':
            loadingHTML = createGradientLoading();
            break;
        case 'spinner':
        default:
            loadingHTML = createSpinnerLoading(options);
            break;
    }

    loadingWrapper.innerHTML = loadingHTML;

    // 添加文字
    if (options.text) {
        const text = document.createElement('div');
        text.textContent = options.text;
        text.style.cssText = `
            margin-top: 16px;
            font-size: 14px;
            color: ${options.color || 'var(--el-color-primary)'};
            font-weight: 500;
        `;
        loadingWrapper.appendChild(text);
    }

    return loadingWrapper;
}

// 添加 loading
function appendLoading(el: LoadingElement, options: LoadingOptions) {
    if (el.__loadingInstance) {
        return;
    }

    // 设置父元素为相对定位
    const position = window.getComputedStyle(el).position;
    if (position === 'static' || position === '') {
        el.__originalPosition = position;
        el.style.position = 'relative';
    }

    // 传入 el 参数以获取圆角
    const loadingInstance = createLoadingElement(el, options);
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
