<template>
    <div ref="containerRef" class="virtual-scroll-container" @scroll="handleScroll">
        <!-- 占位容器，撑开总高度 -->
        <div class="virtual-scroll-phantom" :style="{ height: `${totalHeight}px` }"></div>

        <!-- 可视区域内容 -->
        <div class="virtual-scroll-content" :style="{ transform: `translate3d(0, ${offsetY}px, 0)` }">
            <div v-for="item in visibleData" :key="item.key" :data-index="item.index" class="virtual-scroll-item">
                <slot :item="item.data" :index="item.index"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
    import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

    interface Props {
        // 数据源
        dataSource: T[];
        // 数据唯一key
        itemKey?: keyof T | string;
        // 预估item高度（用于初始计算）
        estimatedItemHeight?: number;
        // 缓冲区数量（上下额外渲染的item数）
        bufferSize?: number;
        // 是否启用动态高度
        dynamicHeight?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        itemKey: 'id' as any,
        estimatedItemHeight: 80,
        bufferSize: 5,
        dynamicHeight: true,
    });

    const emit = defineEmits<{
        scroll: [{ scrollTop: number; isBottom: boolean }];
        visibleChange: [{ startIndex: number; endIndex: number }];
    }>();

    // Refs
    const containerRef = ref<HTMLElement>();
    const scrollTop = ref(0);

    // ==================== 核心优化：使用 Map 替代响应式数组 ====================
    interface ItemPosition {
        index: number;
        height: number;
        top: number;
        bottom: number;
    }

    // 非响应式 Map 存储位置，性能关键！
    const positionCache = new Map<number, ItemPosition>();

    // 用版本号手动控制响应式更新（避免 Vue 追踪 Map 内部）
    const positionVersion = ref(0);

    // 获取item的key
    const getItemKey = (item: T): string | number => {
        return item[props.itemKey as keyof T] as string | number;
    };

    // 初始化positions
    const initPositions = () => {
        positionCache.clear();
        const { estimatedItemHeight } = props;

        for (let i = 0; i < props.dataSource.length; i++) {
            positionCache.set(i, {
                index: i,
                height: estimatedItemHeight,
                top: i * estimatedItemHeight,
                bottom: (i + 1) * estimatedItemHeight,
            });
        }

        positionVersion.value++;
    };

    // 总高度
    const totalHeight = computed(() => {
        // 依赖 positionVersion，位置更新时重新计算
        positionVersion.value;

        if (positionCache.size === 0) return 0;
        const lastPos = positionCache.get(props.dataSource.length - 1);
        return lastPos?.bottom || 0;
    });

    // 容器高度
    const containerHeight = ref(0);

    // ==================== 优化的二分查找 ====================
    const binarySearch = (value: number): number => {
        let left = 0;
        let right = props.dataSource.length - 1;
        let result = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midPos = positionCache.get(mid);

            if (!midPos) break;

            if (midPos.bottom <= value) {
                left = mid + 1;
                result = mid + 1;
            } else if (midPos.top > value) {
                right = mid - 1;
            } else {
                result = mid;
                break;
            }
        }

        return Math.min(result, props.dataSource.length - 1);
    };

    // 可视区域起始索引
    const startIndex = computed(() => {
        positionVersion.value; // 依赖版本号

        let start = binarySearch(scrollTop.value);
        start = Math.max(0, start - props.bufferSize);
        return start;
    });

    // 可视区域结束索引
    const endIndex = computed(() => {
        positionVersion.value;

        let end = binarySearch(scrollTop.value + containerHeight.value);
        end = Math.min(props.dataSource.length - 1, end + props.bufferSize);

        // 在真正接近底部时强制包含最后一项（解决底部留白）
        const container = containerRef.value;
        if (container && props.dataSource.length > 0) {
            const scrollHeight = container.scrollHeight;
            const currentScrollTop = scrollTop.value;
            const clientHeight = containerHeight.value;

            const distanceToBottom = scrollHeight - currentScrollTop - clientHeight;

            // 只在距离底部不足 1.5 屏且确实在底部区域时才强制
            if (distanceToBottom < clientHeight * 1.5 && distanceToBottom >= 0) {
                // 不直接覆盖 end，而是确保至少包含最后一项
                const lastIndex = props.dataSource.length - 1;
                if (end < lastIndex - props.bufferSize) {
                    // 如果 end 离最后一项太远，说明不在底部区域，不做处理
                    return end;
                }
                // 在底部区域，确保包含最后一项
                end = Math.max(end, lastIndex);
            }
        }

        return end;
    });
    // ==================== 对象缓存复用，减少 DOM 重建 ====================
    interface VisibleItem {
        key: string | number;
        index: number;
        data: T;
    }

    // 缓存已创建的对象，避免每次滚动都创建新对象
    const itemObjCache = new Map<string | number, VisibleItem>();

    // 可视区域数据
    const visibleData = computed(() => {
        const result: VisibleItem[] = [];
        const start = startIndex.value;
        const end = endIndex.value;

        for (let i = start; i <= end; i++) {
            const data = props.dataSource[i];
            if (data === undefined) continue;

            const key = getItemKey(data);

            // 尝试复用缓存对象
            let cached = itemObjCache.get(key);

            // 只在数据真正变化时创建新对象
            if (!cached || cached.index !== i || cached.data !== data) {
                cached = { key, index: i, data };
                itemObjCache.set(key, cached);
            }

            result.push(cached);
        }

        return result;
    });

    // 偏移量
    const offsetY = computed(() => {
        positionVersion.value; // 依赖版本号

        const pos = positionCache.get(startIndex.value);
        return pos?.top || 0;
    });

    // ==================== 批量更新高度，避免全量遍历 ====================
    let updatePending = false;

    const updateItemHeight = () => {
        if (!props.dynamicHeight || !containerRef.value || updatePending) return;

        updatePending = true;

        requestAnimationFrame(() => {
            const nodes = containerRef.value?.querySelectorAll('.virtual-scroll-item') as NodeListOf<HTMLElement>;

            if (!nodes || nodes.length === 0) {
                updatePending = false;
                return;
            }

            const heightChanges: Array<{ index: number; oldHeight: number; newHeight: number }> = [];

            nodes.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const index = Number(node.dataset.index);
                const pos = positionCache.get(index);

                if (!pos) return;

                const oldHeight = pos.height;
                const newHeight = rect.height;

                // ✅ 关键：即使高度一样，也要标记为"已测量"
                if (Math.abs(oldHeight - newHeight) > 1) {
                    heightChanges.push({ index, oldHeight, newHeight });
                }
            });

            if (heightChanges.length > 0) {
                heightChanges.sort((a, b) => a.index - b.index);

                let accumulatedDiff = 0;
                let lastIndex = -1;

                heightChanges.forEach(({ index, oldHeight, newHeight }) => {
                    const pos = positionCache.get(index);
                    if (!pos) return;

                    if (lastIndex >= 0 && index > lastIndex + 1) {
                        for (let i = lastIndex + 1; i < index; i++) {
                            const midPos = positionCache.get(i);
                            if (midPos) {
                                midPos.top += accumulatedDiff;
                                midPos.bottom += accumulatedDiff;
                            }
                        }
                    }

                    const diff = newHeight - oldHeight;
                    accumulatedDiff += diff;

                    pos.height = newHeight;
                    pos.bottom = pos.top + newHeight;

                    lastIndex = index;
                });

                if (lastIndex >= 0 && accumulatedDiff !== 0) {
                    for (let i = lastIndex + 1; i < props.dataSource.length; i++) {
                        const pos = positionCache.get(i);
                        if (pos) {
                            pos.top += accumulatedDiff;
                            pos.bottom += accumulatedDiff;
                        }
                    }
                }

                positionVersion.value++;
            }

            updatePending = false;
        });
    };

    const handleScroll = () => {
        if (!containerRef.value) return;

        scrollTop.value = containerRef.value.scrollTop;

        if (props.dynamicHeight) {
            nextTick(() => {
                updateItemHeight();
            });
        }

        const scrollHeight = containerRef.value.scrollHeight;
        const scrollTopValue = containerRef.value.scrollTop;
        const clientHeight = containerRef.value.clientHeight;
        const distanceToBottom = scrollHeight - scrollTopValue - clientHeight;

        // 滚到最后一个数据项时，强制刷新高度
        const isLastItemVisible = endIndex.value >= props.dataSource.length - 1;

        if (isLastItemVisible && props.dynamicHeight) {
            nextTick(() => {
                updateItemHeight();
                // 再延迟一次确保准确
                setTimeout(() => updateItemHeight(), 100);
            });
        }

        const isBottom = isLastItemVisible && distanceToBottom < 50;

        emit('scroll', {
            scrollTop: scrollTopValue,
            isBottom,
        });

        emit('visibleChange', {
            startIndex: startIndex.value,
            endIndex: endIndex.value,
        });
    };

    // 滚动到指定索引
    const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
        if (!containerRef.value || index < 0 || index >= props.dataSource.length) return;

        const pos = positionCache.get(index);
        if (pos) {
            containerRef.value.scrollTo({
                top: pos.top,
                behavior,
            });
        }
    };

    // 滚动到顶部
    const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
        containerRef.value?.scrollTo({ top: 0, behavior });
    };

    // 滚动到底部
    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        containerRef.value?.scrollTo({
            top: totalHeight.value,
            behavior,
        });
    };

    // 观察器：监听容器尺寸变化
    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
        if (containerRef.value) {
            containerHeight.value = containerRef.value.clientHeight;

            resizeObserver = new ResizeObserver((entries) => {
                containerHeight.value = entries[0].contentRect.height;
            });
            resizeObserver.observe(containerRef.value);

            if (props.dynamicHeight) {
                nextTick(() => {
                    updateItemHeight();
                });
            }
        }
    });

    onBeforeUnmount(() => {
        resizeObserver?.disconnect();
    });

    // 监听数据源变化
    watch(
        () => props.dataSource,
        (newData, oldData) => {
            if (!oldData || newData.length !== oldData.length) {
                initPositions();
                itemObjCache.clear();

                nextTick(() => {
                    if (props.dynamicHeight) {
                        updateItemHeight();
                    }
                });
            }
        },
        { immediate: true }
    );

    // 暴露方法给父组件
    defineExpose({
        scrollToIndex,
        scrollToTop,
        scrollToBottom,
        getVisibleRange: () => ({
            start: startIndex.value,
            end: endIndex.value,
        }),
    });
</script>

<style scoped>
    .virtual-scroll-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        /* 硬件加速 */
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        /* CSS containment 优化 */
        contain: layout style paint;
    }

    .virtual-scroll-phantom {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        z-index: -1;
        pointer-events: none;
    }

    .virtual-scroll-content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        /* 使用3D变换触发GPU加速 */
        will-change: transform;
    }

    .virtual-scroll-item {
        width: 100%;
        /* 防止内容溢出 */
        box-sizing: border-box;
        /* CSS containment 优化每个 item */
        contain: layout style paint;
    }

    /* 优化滚动性能 */
    .virtual-scroll-container {
        /* 移动端流畅滚动 */
        -webkit-overflow-scrolling: touch;
        /* 滚动吸附（可选） */
        scroll-behavior: smooth;
    }

    /* 精美滚动条样式 */
    .virtual-scroll-container::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    .virtual-scroll-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 4px;
    }

    .virtual-scroll-container::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(100, 180, 255, 0.3) 0%, rgba(80, 140, 255, 0.4) 100%);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 8px rgba(100, 180, 255, 0.15);
    }

    .virtual-scroll-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(120, 200, 255, 0.5) 0%, rgba(100, 160, 255, 0.6) 100%);
        box-shadow: 0 0 12px rgba(120, 200, 255, 0.3);
    }

    .virtual-scroll-container::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, rgba(140, 220, 255, 0.6) 0%, rgba(120, 180, 255, 0.7) 100%);
    }

    /* Firefox滚动条 */
    .virtual-scroll-container {
        scrollbar-width: thin;
        scrollbar-color: rgba(100, 180, 255, 0.3) rgba(255, 255, 255, 0.02);
    }
</style>
