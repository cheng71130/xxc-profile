<template>
    <div class="skeleton-wrapper">
        <!-- 骨架屏层 - 绝对定位覆盖 -->
        <div v-show="loading" class="skeleton-layer" :style="{ opacity: loading ? 1 : 0, ...skeletonContainerStyle }">
            <!-- 自动生成的骨架屏 -->
            <template v-if="auto && skeletonNodes.length > 0">
                <div
                    v-for="(node, index) in skeletonNodes"
                    :key="index"
                    class="skeleton-node"
                    :class="`skeleton-${node.type}`"
                    :style="node.style"
                >
                    <div v-if="showShimmer" class="skeleton-shimmer"></div>
                </div>
            </template>

            <!-- 手动骨架屏插槽 -->
            <template v-else-if="$slots.skeleton">
                <slot name="skeleton"></slot>
            </template>

            <!-- 默认骨架屏 -->
            <template v-else>
                <div class="skeleton-default">
                    <div class="skeleton-block"></div>
                    <div class="skeleton-block"></div>
                    <div class="skeleton-block short"></div>
                </div>
            </template>
        </div>

        <!-- 实际内容层 - 始终渲染保持高度 -->
        <div ref="contentRef" class="content-layer" :style="{ opacity: loading ? 0 : 1 }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

    interface SkeletonNode {
        type: 'text' | 'image' | 'circle' | 'rect' | 'button' | 'input' | 'card';
        style: Record<string, string>;
        className?: string;
    }

    interface Props {
        loading: boolean;
        auto?: boolean;
        showShimmer?: boolean;
        throttle?: number;
        ignoreSelectors?: string[];
        imageMinSize?: number;
        textMinHeight?: number;
    }

    const props = withDefaults(defineProps<Props>(), {
        auto: true,
        showShimmer: true,
        throttle: 100,
        ignoreSelectors: () => ['.skeleton-ignore', 'script', 'style', 'link'],
        imageMinSize: 20,
        textMinHeight: 10,
    });

    const contentRef = ref<HTMLElement>();
    const skeletonNodes = ref<SkeletonNode[]>([]);
    const skeletonContainerStyle = ref<Record<string, string>>({});
    let resizeObserver: ResizeObserver | null = null;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    // 判断元素是否应该被忽略
    const shouldIgnore = (element: Element): boolean => {
        if (!element || !(element instanceof HTMLElement)) return true;

        for (const selector of props.ignoreSelectors) {
            if (element.matches(selector)) return true;
        }

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
            return true;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width < 5 || rect.height < 5) {
            return true;
        }

        return false;
    };

    // 判断元素类型
    const getElementType = (element: HTMLElement): SkeletonNode['type'] => {
        const tagName = element.tagName.toLowerCase();
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        if (tagName === 'img' || tagName === 'svg' || element.classList.contains('image')) {
            const borderRadius = parseFloat(style.borderRadius);
            if (borderRadius >= rect.width / 2 && Math.abs(rect.width - rect.height) < 5) {
                return 'circle';
            }
            return 'image';
        }

        if (tagName === 'button' || element.getAttribute('role') === 'button') {
            return 'button';
        }

        if (tagName === 'input' || tagName === 'textarea') {
            return 'input';
        }

        const hasBackground =
            style.backgroundColor &&
            style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            style.backgroundColor !== 'transparent';
        const hasBorder = style.borderWidth && parseFloat(style.borderWidth) > 0;
        const hasShadow = style.boxShadow && style.boxShadow !== 'none';

        if (hasBackground || hasBorder || hasShadow) {
            return 'card';
        }

        if (tagName.match(/^(h[1-6]|p|span|div|a|label)$/)) {
            return 'text';
        }

        return 'rect';
    };

    // 提取元素样式
    const extractStyle = (element: HTMLElement, type: SkeletonNode['type']): Record<string, string> => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);

        let parentRect = { top: 0, left: 0 };

        if (contentRef.value && contentRef.value.children.length > 0) {
            const containerElement = contentRef.value.children[0] as HTMLElement;
            parentRect = containerElement.getBoundingClientRect();
        }

        const style: Record<string, string> = {
            position: 'absolute',
            top: `${rect.top - parentRect.top}px`,
            left: `${rect.left - parentRect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            borderRadius:
                computedStyle.borderRadius !== '0px'
                    ? computedStyle.borderRadius
                    : type === 'circle'
                    ? '50%'
                    : type === 'image' || type === 'button'
                    ? '8px'
                    : type === 'card'
                    ? '12px'
                    : type === 'input'
                    ? '8px'
                    : '6px',
        };

        if (type === 'text') {
            const fontSize = parseFloat(computedStyle.fontSize);
            const maxHeight = fontSize * 2.5;
            if (rect.height > maxHeight) {
                style.height = `${maxHeight}px`;
            }
            if (rect.height < props.textMinHeight) {
                style.height = `${props.textMinHeight}px`;
            }
        }

        return style;
    };
    // 分析元素
    const analyzeElement = (element: HTMLElement, nodes: SkeletonNode[]): void => {
        if (shouldIgnore(element)) return;

        const children = Array.from(element.children).filter((child) => child instanceof HTMLElement) as HTMLElement[];

        const hasTextContent = Array.from(element.childNodes).some(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );

        if (children.length === 0 || (hasTextContent && children.length < 3)) {
            const type = getElementType(element);
            const rect = element.getBoundingClientRect();

            if (type === 'image' || type === 'circle') {
                if (rect.width < props.imageMinSize || rect.height < props.imageMinSize) {
                    return;
                }
            }

            const style = extractStyle(element, type);
            nodes.push({ type, style });
            return;
        }

        children.forEach((child) => analyzeElement(child, nodes));
    };

    // 生成骨架屏
    const generateSkeleton = () => {
        if (!props.auto || !contentRef.value || props.loading) {
            return;
        }

        const nodes: SkeletonNode[] = [];
        const children = Array.from(contentRef.value.children) as HTMLElement[];

        // 👇 新增：提取第一个子元素的容器样式
        if (children.length > 0) {
            const firstChild = children[0];
            const computedStyle = window.getComputedStyle(firstChild);

            // 提取需要的样式属性
            const containerStyle = {
                background: computedStyle.background,
                backgroundColor: computedStyle.backgroundColor,
                border: computedStyle.border,
                borderRadius: computedStyle.borderRadius,
                boxShadow: computedStyle.boxShadow,
                backdropFilter: computedStyle.backdropFilter,
                padding: computedStyle.padding,
            };

            // 将容器样式存储到某个地方，后面应用到 skeleton-layer
            skeletonContainerStyle.value = containerStyle;
        }

        children.forEach((child) => {
            analyzeElement(child, nodes);
        });

        skeletonNodes.value = nodes;
    };

    // 节流生成
    const throttledGenerate = () => {
        if (throttleTimer) {
            clearTimeout(throttleTimer);
        }

        throttleTimer = setTimeout(() => {
            generateSkeleton();
        }, props.throttle);
    };

    watch(
        () => props.loading,
        async (isLoading) => {
            if (!isLoading && props.auto) {
                await nextTick();
                setTimeout(() => {
                    generateSkeleton();
                }, 100);
            }
        },
        { immediate: false }
    );

    onMounted(async () => {
        await nextTick();

        if (contentRef.value && props.auto) {
            resizeObserver = new ResizeObserver(() => {
                if (!props.loading) {
                    throttledGenerate();
                }
            });

            resizeObserver.observe(contentRef.value);

            if (!props.loading) {
                setTimeout(() => {
                    generateSkeleton();
                }, 100);
            }
        }
    });

    onBeforeUnmount(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
        if (throttleTimer) {
            clearTimeout(throttleTimer);
        }
    });

    defineExpose({
        regenerate: generateSkeleton,
    });
</script>

<style scoped lang="scss">
    .skeleton-wrapper {
        position: relative;
        width: 100%;
    }

    // 骨架屏层 - 绝对定位覆盖，不占空间
    .skeleton-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        pointer-events: none;
        // transition: opacity 0.4s ease;
    }

    // 内容层 - 始终占据空间，决定容器高度
    .content-layer {
        position: relative;
        width: 100%;
        transition: opacity 1s ease;
        pointer-events: auto;
    }

    // 骨架屏节点样式
    .skeleton-node {
        overflow: hidden;
        position: relative;

        &.skeleton-text {
            background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(255, 255, 255, 0.06) 100%
            );
            border-radius: 4px;
        }

        &.skeleton-image {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%);
            border-radius: 8px;
        }

        &.skeleton-circle {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.15) 100%);
            border-radius: 50%;
        }

        &.skeleton-button {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%);
            border-radius: 8px;
        }

        &.skeleton-input {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }

        &.skeleton-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.06) 100%);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        &.skeleton-rect {
            background: rgba(255, 255, 255, 0.06);
            border-radius: 6px;
        }
    }

    // 闪光效果
    .skeleton-shimmer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
        animation: shimmer 2s infinite;
        transform: translateX(-100%);
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    // 默认骨架屏
    .skeleton-default {
        padding: 20px;

        .skeleton-block {
            height: 16px;
            background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(255, 255, 255, 0.06) 100%
            );
            border-radius: 4px;
            margin-bottom: 12px;
            position: relative;
            overflow: hidden;

            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
                animation: shimmer 2s infinite;
                transform: translateX(-100%);
            }

            &.short {
                width: 60%;
            }
        }
    }
</style>
