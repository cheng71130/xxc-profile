<template>
    <div class="resizable-layout" ref="containerRef" :class="{ 'is-vertical': direction === 'vertical' }">
        <div class="first-panel" :style="firstPanelStyle">
            <slot name="first"></slot>
        </div>

        <div class="gap-area" :style="gapStyle">
            <div
                class="resizer"
                @mousedown="startResize"
                @mouseenter="isHovering = true"
                @mouseleave="handleMouseLeave"
                :class="{
                    'resizer-visible': isHovering || isResizing,
                }"
            ></div>
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
    const isHovering = ref(false);

    let startPos = 0;
    let startSize = 0;

    // 计算第一个面板的样式
    const firstPanelStyle = computed(() => {
        if (props.direction === 'horizontal') {
            return { width: `${size.value}px` };
        } else {
            return { height: `${size.value}px` };
        }
    });

    // 计算间隙区域的样式
    const gapStyle = computed(() => {
        if (props.direction === 'horizontal') {
            return { width: `${props.gap}px` };
        } else {
            return { height: `${props.gap}px` };
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

    const handleMouseLeave = () => {
        if (!isResizing.value) {
            isHovering.value = false;
        }
    };

    onMounted(() => {
        if (containerRef.value) {
            const containerSize =
                props.direction === 'horizontal' ? containerRef.value.offsetWidth : containerRef.value.offsetHeight;
            const maxSize = containerSize - props.minSecondSize - props.gap;
            if (size.value > maxSize) {
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
    }

    .first-panel {
        flex-shrink: 0;
        overflow: auto;
    }

    .gap-area {
        flex-shrink: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .resizer {
        background-color: #d1d5db;
        border-radius: 20px;
        opacity: 0;
        transition: all 0.2s ease;

        .resizable-layout:not(.is-vertical) & {
            width: 4px;
            height: 100%;
            cursor: ew-resize;
        }

        .resizable-layout.is-vertical & {
            width: 100%;
            height: 4px;
            cursor: ns-resize;
        }

        &.resizer-visible {
            opacity: 1;
            background-color: var(--el-color-primary);
        }

        &.resizer-visible {
            .resizable-layout:not(.is-vertical) & {
                width: 5px;
            }

            .resizable-layout.is-vertical & {
                height: 5px;
            }
        }
    }

    .second-panel {
        flex: 1;
        overflow: auto;
    }
</style>
