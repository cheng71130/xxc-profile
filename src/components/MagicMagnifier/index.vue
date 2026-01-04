<template>
    <div
        class="magnifier-container"
        ref="containerRef"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        :style="cssVars"
    >
        <!-- 1. 底层：原始内容 (保持原样，不被遮挡) -->
        <div class="base-content">
            <slot></slot>
        </div>

        <!-- 2. 透镜窗口 -->
        <div class="lens-window" ref="lensRef" :class="{ 'is-active': isVisible }">
            <!-- 2.1 内部放大内容 (层级最低，被边框压住) -->
            <!-- 修正：现在它被父级 overflow: hidden 裁剪，不会溢出 -->
            <div class="lens-inner-content" ref="innerContentRef">
                <slot></slot>
            </div>

            <!-- 2.2 镜面内部阴影 (增加深邃感) -->
            <div class="lens-inner-shadow"></div>

            <!-- 2.3 高光效果 (还原图片中的月牙反光) -->
            <div class="lens-highlight"></div>

            <!-- 2.4 外边框 (层级最高) -->
            <!-- 修正：改为纯 inset shadow 实现，解决白边问题 -->
            <div class="cartoon-frame"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, computed, onMounted, onUnmounted, type CSSProperties } from 'vue';
    import gsap from 'gsap';

    interface Props {
        scale?: number;
        size?: number;
        smoothness?: number;
        bgColor?: string;
        frameColor?: string;
        lensColor?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        scale: 2.5,
        size: 200,
        smoothness: 0.12,
        bgColor: '#ffffff',
        frameColor: '#cd853f',
        lensColor: '#5eb3d6',
    });

    const containerRef = ref<HTMLDivElement | null>(null);
    const lensRef = ref<HTMLDivElement | null>(null);
    const innerContentRef = ref<HTMLDivElement | null>(null);
    const isVisible = ref(false);

    const mouse = reactive({ x: 0, y: 0 });
    const lensPos = reactive({ x: 0, y: 0 });

    const cssVars = computed<CSSProperties>(() => ({
        '--size': `${props.size}px`,
        '--lens-bg': props.bgColor,
        '--frame-color': props.frameColor,
        '--lens-color': props.lensColor,
        '--frame-width': `${props.size / 10}px`,
    }));

    // --- GSAP 逻辑保持不变 ---
    const tick = () => {
        if (!isVisible.value) return;

        lensPos.x += (mouse.x - lensPos.x) * props.smoothness;
        lensPos.y += (mouse.y - lensPos.y) * props.smoothness;

        const radius = props.size / 2;

        if (lensRef.value) {
            gsap.set(lensRef.value, {
                x: lensPos.x - radius,
                y: lensPos.y - radius,
            });
        }

        if (innerContentRef.value) {
            // 计算反向位移
            const innerX = radius - lensPos.x * props.scale;
            const innerY = radius - lensPos.y * props.scale;

            gsap.set(innerContentRef.value, {
                x: innerX,
                y: innerY,
                scale: props.scale,
                transformOrigin: '0 0',
            });
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!containerRef.value) return;
        const rect = containerRef.value.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        if (!isVisible.value) {
            lensPos.x = mouse.x;
            lensPos.y = mouse.y;
            isVisible.value = true;
            tick();
        }
    };

    const onMouseLeave = () => {
        isVisible.value = false;
    };

    let resizeObserver: ResizeObserver | null = null;
    const syncSize = () => {
        if (containerRef.value && innerContentRef.value) {
            const { width, height } = containerRef.value.getBoundingClientRect();
            innerContentRef.value.style.width = `${width}px`;
            innerContentRef.value.style.height = `${height}px`;
        }
    };

    onMounted(() => {
        gsap.ticker.add(tick);
        if (containerRef.value) {
            resizeObserver = new ResizeObserver(syncSize);
            resizeObserver.observe(containerRef.value);
            syncSize();
        }
    });

    onUnmounted(() => {
        gsap.ticker.remove(tick);
        resizeObserver?.disconnect();
    });
</script>

<style scoped lang="scss">
    .magnifier-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden; /* 限制容器 */
        cursor: none;
        isolation: isolate;
    }

    .base-content {
        width: 100%;
        height: 100%;
    }

    /* --- 透镜主窗口 --- */
    .lens-window {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        pointer-events: none;

        width: var(--size);
        height: var(--size);
        border-radius: 50%;

        /* 核心修复 1：严格的溢出隐藏 */
        overflow: hidden;
        /* Safari/Chrome 兼容性修复：强制 GPU 层级，防止 overflow 失效 */
        transform: translateZ(0);

        background-color: var(--lens-bg);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4); /* 阴影加深一点 */

        opacity: 0;
        /* 这里的 transform 只是为了初始动画，后续会被 GSAP 覆盖 x,y */
        transform: scale(0.8);
        transition: opacity 0.2s ease-out;

        &.is-active {
            opacity: 1;
            /* 移除 transform: scale(1)，避免与 GSAP 冲突 */
        }
    }

    /* --- 1. 卡通厚边框 (Frame) --- */
    /* 核心修复 2：改用 inset box-shadow 绘制边框 */
    .cartoon-frame {
        position: absolute;
        inset: 0;
        z-index: 20; /* 必须在内容之上 */
        border-radius: 50%;
        pointer-events: none;

        /* 
           原理：
           不再使用 border (会增加尺寸) 或 mask (会导致边缘锯齿/白边)。
           直接利用 box-shadow 的第四个参数(spread)来模拟厚度。
           inset 表示向内绘制，所以外边缘绝对平滑。
        */
        box-shadow: 
            /* 1. 主边框色 (实心) - 这一层代替了 border */ inset 0 0 0 var(--frame-width)
                var(--frame-color),
            /* 2. 边框上的光影 (叠加在主色上) */ inset 5px 5px 20px rgba(255, 255, 255, 0.4),
            inset -5px -5px 20px rgba(0, 0, 0, 0.2),
            /* 3. 外缘的一条极细的深色描边，增加分离度 */ 0 0 0 1px rgba(0, 0, 0, 0.15);
    }

    /* --- 2. 镜面内部阴影 --- */
    .lens-inner-shadow {
        position: absolute;
        /* 让阴影从边框内侧开始，避免覆盖边框 */
        inset: 0;
        border-radius: 50%;
        z-index: 15;
        pointer-events: none;

        /* 蓝色玻璃质感 */
        background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.1) 0%,
            var(--lens-color) 60%,
            rgba(0, 0, 0, 0.2) 100%
        );

        mix-blend-mode: multiply;

        /* 仅在边框内侧产生阴影 */
        box-shadow: inset 0 0 20px var(--frame-width) rgba(0, 0, 0, 0.2);
    }

    /* --- 3. 高光 --- */
    .lens-highlight {
        position: absolute;
        z-index: 25; /* 高光在最上层 */
        top: 15%;
        right: 15%;
        width: 60%;
        height: 60%;
        border-radius: 50%;
        pointer-events: none;

        border-top: 5px solid rgba(255, 255, 255, 0.9);
        border-right: 3px solid rgba(255, 255, 255, 0);
        border-left: 3px solid rgba(255, 255, 255, 0);

        transform: rotate(45deg);
        filter: blur(1px);
    }

    /* --- 4. 内部放大内容 --- */
    .lens-inner-content {
        position: absolute;
        top: 0;
        left: 0;
        /* 移除 clip-path，完全依靠父级 lens-window 的 overflow: hidden */
        will-change: transform;
        z-index: 1; /* 最底层 */
    }
</style>
