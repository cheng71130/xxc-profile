<template>
    <div
        class="resizable-layout"
        ref="containerRef"
        :class="{ 'is-vertical': direction === 'vertical', 'is-horizontal': direction === 'horizontal' }"
    >
        <div class="first-panel" :style="firstPanelStyle">
            <slot name="first"></slot>
        </div>

        <div class="gap-area" :style="gapStyle" @mousedown="startResize">
            <div class="resizer" :class="{ 'is-resizing': isResizing }"></div>
        </div>

        <div class="second-panel">
            <slot name="second"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

    interface Props {
        direction?: 'horizontal' | 'vertical';
        defaultSize?: number;
        minFirstSize?: number;
        minSecondSize?: number;
        gap?: number;
    }

    const props = withDefaults(defineProps<Props>(), {
        direction: 'horizontal',
        defaultSize: 400,
        minFirstSize: 200,
        minSecondSize: 200,
        gap: 10,
    });

    const containerRef = ref<HTMLElement | null>(null);
    const size = ref(props.defaultSize);
    const isResizing = ref(false);

    let startPos = 0;
    let startSize = 0;

    const firstPanelStyle = computed(() => {
        if (props.direction === 'horizontal') {
            return { width: `${size.value}px` };
        } else {
            return { height: `${size.value}px` };
        }
    });

    const gapStyle = computed(() => {
        if (props.direction === 'horizontal') {
            return {
                width: `${props.gap}px`,
                height: '100%',
                cursor: 'ew-resize',
            };
        } else {
            return {
                width: '100%',
                height: `${props.gap}px`,
                cursor: 'ns-resize',
            };
        }
    });

    const startResize = (e: MouseEvent) => {
        isResizing.value = true;
        startPos = props.direction === 'horizontal' ? e.clientX : e.clientY;
        startSize = size.value;

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
        document.body.style.cursor = props.direction === 'horizontal' ? 'ew-resize' : 'ns-resize';
        document.body.style.userSelect = 'none';

        e.stopPropagation();
        e.preventDefault();
    };

    const handleResize = (e: MouseEvent) => {
        if (!isResizing.value || !containerRef.value) return;

        const currentPos = props.direction === 'horizontal' ? e.clientX : e.clientY;
        const delta = currentPos - startPos;
        const newSize = startSize + delta;

        const containerSize =
            props.direction === 'horizontal' ? containerRef.value.offsetWidth : containerRef.value.offsetHeight;
        const maxSize = containerSize - props.minSecondSize - props.gap;

        if (newSize >= props.minFirstSize && newSize <= maxSize) {
            size.value = newSize;
        }
    };

    const stopResize = () => {
        isResizing.value = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    onMounted(() => {
        if (containerRef.value) {
            const containerSize =
                props.direction === 'horizontal' ? containerRef.value.offsetWidth : containerRef.value.offsetHeight;
            const maxSize = containerSize - props.minSecondSize - props.gap;
            // 初始化时校验尺寸
            if (size.value > maxSize && maxSize > 0) {
                size.value = maxSize;
            }
        }
    });

    onBeforeUnmount(() => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    });
</script>

<style scoped lang="scss">
    .resizable-layout {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;

        &.is-vertical {
            flex-direction: column;
        }

        &.is-horizontal {
            flex-direction: row;
        }
    }

    .first-panel {
        flex-shrink: 0;
        overflow: auto;
    }

    .gap-area {
        flex-shrink: 0;
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;

        // 这里的 hover 控制子元素 resizer 的显隐
        &:hover .resizer {
            opacity: 1;
            background-color: var(--el-color-primary);

            // Hover 时的尺寸膨胀逻辑
            &.horizontal-bar {
                height: 4px; // 垂直布局时的横条，变粗
            }
            &.vertical-bar {
                width: 4px; // 水平布局时的竖条，变粗
            }
        }
    }

    .resizer {
        background-color: #d1d5db;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.2s ease, background-color 0.2s ease; // 只过渡颜色和透明度，不过渡尺寸防止抖动
        pointer-events: none; // 穿透，不影响鼠标事件

        // 拖拽中状态
        &.is-resizing {
            opacity: 1;
            background-color: var(--el-color-primary);
        }
    }

    // 垂直布局场景（上下分布，中间是横条）
    .is-vertical > .gap-area > .resizer {
        width: 100%; // 关键：横条要铺满宽度
        height: 2px; // 默认高度
        min-height: 2px; // 防止被压缩
    }
    // Hover/Active 状态变粗 (可选)
    .is-vertical > .gap-area:hover > .resizer,
    .is-vertical > .gap-area > .resizer.is-resizing {
        height: 4px;
    }

    // 水平布局场景（左右分布，中间是竖条）
    .is-horizontal > .gap-area > .resizer {
        height: 100%; // 关键：竖条要铺满高度
        width: 2px; // 默认宽度
        min-width: 2px; // 防止被压缩
    }
    // Hover/Active 状态变粗 (可选)
    .is-horizontal > .gap-area:hover > .resizer,
    .is-horizontal > .gap-area > .resizer.is-resizing {
        width: 4px;
    }

    .second-panel {
        flex: 1;
        overflow: auto;
        // 关键：确保第二面板也是 flex 容器或者占满空间，防止内部嵌套坍塌
        position: relative;
    }
</style>
