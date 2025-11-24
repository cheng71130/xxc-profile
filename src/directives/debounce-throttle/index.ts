import type { Directive, DirectiveBinding } from 'vue';

interface ElementWithTimer extends HTMLElement {
    __debounceTimer__?: ReturnType<typeof setTimeout>;
    __throttleTimer__?: ReturnType<typeof setTimeout>;
    __lastExecTime__?: number;
    __originalHandler__?: Function;
    __eventType__?: string;
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

    return function (this: any, ...args: any[]) {
        const now = Date.now();

        // 如果是第一次调用且不需要立即执行
        if (lastExecTime === 0 && !leading) {
            lastExecTime = now;
        }

        const remaining = delay - (now - lastExecTime);

        // 如果到了可以执行的时间
        if (remaining <= 0 || remaining > delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            lastExecTime = now;
            fn.apply(this, args);
        }
        // 如果还在等待中，且需要尾调用
        else if (!timer && trailing) {
            timer = setTimeout(() => {
                lastExecTime = leading ? Date.now() : 0;
                timer = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

// v-debounce 指令
export const vDebounce: Directive = {
    mounted(el: ElementWithTimer, binding: DirectiveBinding) {
        const { value } = binding;

        if (typeof value === 'function') {
            const debouncedFn = debounce(value, 300, false);
            el.addEventListener('click', debouncedFn as EventListener);
            el.__originalHandler__ = debouncedFn;
            el.__eventType__ = 'click';
        } else if (typeof value === 'object' && value.handler) {
            const { handler, delay = 300, immediate = false, event = 'click' } = value;
            const debouncedFn = debounce(handler, delay, immediate);
            el.addEventListener(event, debouncedFn as EventListener);
            el.__originalHandler__ = debouncedFn;
            el.__eventType__ = event;
        }
    },

    unmounted(el: ElementWithTimer) {
        if (el.__originalHandler__ && el.__eventType__) {
            el.removeEventListener(el.__eventType__, el.__originalHandler__ as EventListener);
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
            const throttledFn = throttle(value, 1000, { leading: true, trailing: true });
            el.addEventListener('click', throttledFn as EventListener);
            el.__originalHandler__ = throttledFn;
            el.__eventType__ = 'click';
        } else if (typeof value === 'object' && value.handler) {
            const { handler, delay = 1000, leading = true, trailing = true, event = 'click' } = value;
            const throttledFn = throttle(handler, delay, { leading, trailing });
            el.addEventListener(event, throttledFn as EventListener);
            el.__originalHandler__ = throttledFn;
            el.__eventType__ = event;
        }
    },

    unmounted(el: ElementWithTimer) {
        if (el.__originalHandler__ && el.__eventType__) {
            el.removeEventListener(el.__eventType__, el.__originalHandler__ as EventListener);
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
