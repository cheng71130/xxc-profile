import type { Directive, DirectiveBinding } from 'vue';

interface ElementWithTimer extends HTMLElement {
    __debounceTimer__?: ReturnType<typeof setTimeout>;
    __throttleTimer__?: ReturnType<typeof setTimeout>;
    __lastExecTime__?: number;
    __originalHandler__?: Function;
}

// 防抖函数
function debounce(fn: Function, delay: number, immediate: boolean = false) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let isFirstCall = true;

    return function (this: any, ...args: any[]) {
        const callNow = immediate && isFirstCall;

        if (timer) clearTimeout(timer);

        if (callNow) {
            fn.apply(this, args);
            isFirstCall = false;
        }

        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(this, args);
            }
            isFirstCall = true;
            timer = null;
        }, delay);
    };
}

// 节流函数
function throttle(fn: Function, delay: number, options: { leading?: boolean; trailing?: boolean } = {}) {
    const { leading = true, trailing = true } = options;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastExecTime = 0;
    let lastArgs: any[] | null = null;
    let lastThis: any = null;

    return function (this: any, ...args: any[]) {
        const now = Date.now();
        const elapsed = now - lastExecTime;

        lastArgs = args;
        lastThis = this;

        // 首次调用且允许立即执行
        if (!lastExecTime && !leading) {
            lastExecTime = now;
        }

        // 时间间隔足够,立即执行
        if (elapsed >= delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            lastExecTime = now;
            fn.apply(this, args);
            lastArgs = null;
        }
        // 时间间隔不够,设置定时器(尾调用)
        else if (!timer && trailing) {
            timer = setTimeout(() => {
                lastExecTime = leading ? Date.now() : 0;
                timer = null;
                if (lastArgs) {
                    fn.apply(lastThis, lastArgs);
                    lastArgs = null;
                }
            }, delay - elapsed);
        }
    };
}

// v-debounce 指令
export const vDebounce: Directive = {
    mounted(el: ElementWithTimer, binding: DirectiveBinding) {
        const { value } = binding;

        if (typeof value === 'function') {
            // 简单用法: v-debounce="handler"
            const debouncedFn = debounce(value, 300, false);
            el.addEventListener('click', debouncedFn as EventListener);
            el.__originalHandler__ = debouncedFn;
        } else if (typeof value === 'object' && value.handler) {
            // 对象配置: v-debounce="{ handler, delay, immediate, event }"
            const { handler, delay = 300, immediate = false, event = 'click' } = value;
            const debouncedFn = debounce(handler, delay, immediate);
            el.addEventListener(event, debouncedFn as EventListener);
            el.__originalHandler__ = debouncedFn;
        }
    },

    unmounted(el: ElementWithTimer) {
        if (el.__originalHandler__) {
            el.removeEventListener('click', el.__originalHandler__ as EventListener);
        }
        if (el.__debounceTimer__) {
            clearTimeout(el.__debounceTimer__);
        }
    },
};

// v-throttle 指令
export const vThrottle: Directive = {
    mounted(el: ElementWithTimer, binding: DirectiveBinding) {
        const { value } = binding;

        if (typeof value === 'function') {
            // 简单用法: v-throttle="handler"
            const throttledFn = throttle(value, 1000, { leading: true, trailing: true });
            el.addEventListener('click', throttledFn as EventListener);
            el.__originalHandler__ = throttledFn;
        } else if (typeof value === 'object' && value.handler) {
            // 对象配置: v-throttle="{ handler, delay, leading, trailing, event }"
            const { handler, delay = 1000, leading = true, trailing = true, event = 'click' } = value;
            const throttledFn = throttle(handler, delay, { leading, trailing });
            el.addEventListener(event, throttledFn as EventListener);
            el.__originalHandler__ = throttledFn;
        }
    },

    unmounted(el: ElementWithTimer) {
        if (el.__originalHandler__) {
            el.removeEventListener('click', el.__originalHandler__ as EventListener);
        }
        if (el.__throttleTimer__) {
            clearTimeout(el.__throttleTimer__);
        }
    },
};

// 插件安装
export default {
    install(app: any) {
        app.directive('debounce', vDebounce);
        app.directive('throttle', vThrottle);
    },
};
