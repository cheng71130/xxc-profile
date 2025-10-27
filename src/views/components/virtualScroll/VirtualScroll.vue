<template>
  <div 
    ref="containerRef" 
    class="virtual-scroll-container"
    @scroll="handleScroll"
  >
    <!-- 占位容器，撑开总高度 -->
    <div 
      class="virtual-scroll-phantom" 
      :style="{ height: `${totalHeight}px` }"
    ></div>
    
    <!-- 可视区域内容 -->
    <div 
      class="virtual-scroll-content"
      :style="{ transform: `translate3d(0, ${offsetY}px, 0)` }"
    >
      <div
        v-for="item in visibleData"
        :key="getItemKey(item.data)"
        :data-index="item.index"
        class="virtual-scroll-item"
      >
        <slot :item="item.data" :index="item.index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

interface Props {
  // 数据源
  dataSource: T[]
  // 数据唯一key
  itemKey?: keyof T | string
  // 预估item高度（用于初始计算）
  estimatedItemHeight?: number
  // 缓冲区数量（上下额外渲染的item数）
  bufferSize?: number
  // 是否启用动态高度
  dynamicHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'id' as any,
  estimatedItemHeight: 80,
  bufferSize: 5,
  dynamicHeight: true
})

const emit = defineEmits<{
  scroll: [{ scrollTop: number; isBottom: boolean }]
  visibleChange: [{ startIndex: number; endIndex: number }]
}>()

// Refs
const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

// 存储每个item的实际高度和位置
interface ItemPosition {
  index: number
  height: number
  top: number
  bottom: number
}

const positions = ref<ItemPosition[]>([])

// 获取item的key
const getItemKey = (item: T): string | number => {
  return item[props.itemKey as keyof T] as string | number
}

// 初始化positions
const initPositions = () => {
  positions.value = props.dataSource.map((_, index) => ({
    index,
    height: props.estimatedItemHeight,
    top: index * props.estimatedItemHeight,
    bottom: (index + 1) * props.estimatedItemHeight
  }))
}

// 总高度
const totalHeight = computed(() => {
  if (positions.value.length === 0) return 0
  return positions.value[positions.value.length - 1].bottom
})

// 容器高度
const containerHeight = ref(0)

// 可视区域起始索引（二分查找优化）
const startIndex = computed(() => {
  let start = binarySearch(positions.value, scrollTop.value)
  start = Math.max(0, start - props.bufferSize)
  return start
})

// 可视区域结束索引
const endIndex = computed(() => {
  let end = binarySearch(positions.value, scrollTop.value + containerHeight.value)
  end = Math.min(positions.value.length - 1, end + props.bufferSize)
  return end
})

// 可视区域数据
const visibleData = computed(() => {
  return positions.value
    .slice(startIndex.value, endIndex.value + 1)
    .map(pos => ({
      index: pos.index,
      data: props.dataSource[pos.index]
    }))
    .filter(item => item.data !== undefined)
})

// 偏移量
const offsetY = computed(() => {
  return positions.value[startIndex.value]?.top || 0
})

// 二分查找：找到scrollTop对应的item索引（O(log n)复杂度）
const binarySearch = (list: ItemPosition[], value: number): number => {
  let left = 0
  let right = list.length - 1
  let mid = 0

  while (left <= right) {
    mid = Math.floor((left + right) / 2)
    const midValue = list[mid].bottom

    if (midValue === value) {
      return mid + 1
    } else if (midValue < value) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return left
}

// 更新item实际高度（使用RAF优化性能）
let updatePending = false
const updateItemHeight = () => {
  if (!props.dynamicHeight || !containerRef.value || updatePending) return

  updatePending = true
  requestAnimationFrame(() => {
    const nodes = containerRef.value?.querySelectorAll('.virtual-scroll-item') as NodeListOf<HTMLElement>
    
    if (!nodes || nodes.length === 0) {
      updatePending = false
      return
    }

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      const index = Number(node.dataset.index)
      const oldHeight = positions.value[index]?.height || 0
      const newHeight = rect.height

      // 高度变化时更新（添加容差避免频繁更新）
      if (Math.abs(oldHeight - newHeight) > 1) {
        positions.value[index].height = newHeight
        positions.value[index].bottom = positions.value[index].top + newHeight

        // 更新后续所有item的位置
        for (let i = index + 1; i < positions.value.length; i++) {
          positions.value[i].top = positions.value[i - 1].bottom
          positions.value[i].bottom = positions.value[i].top + positions.value[i].height
        }
      }
    })

    updatePending = false
  })
}

// 滚动事件处理（使用节流优化）
let scrollTimer: ReturnType<typeof setTimeout> | null = null
const handleScroll = () => {
  if (!containerRef.value) return
  
  scrollTop.value = containerRef.value.scrollTop

  // 动态高度更新
  if (props.dynamicHeight) {
    nextTick(() => {
      updateItemHeight()
    })
  }

  // 节流触发事件
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  scrollTimer = setTimeout(() => {
    const isBottom = 
      containerRef.value!.scrollHeight - 
      containerRef.value!.scrollTop - 
      containerRef.value!.clientHeight < 10

    emit('scroll', {
      scrollTop: scrollTop.value,
      isBottom
    })

    emit('visibleChange', {
      startIndex: startIndex.value,
      endIndex: endIndex.value
    })
  }, 100)
}

// 滚动到指定索引
const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
  if (!containerRef.value || index < 0 || index >= positions.value.length) return
  
  containerRef.value.scrollTo({
    top: positions.value[index].top,
    behavior
  })
}

// 滚动到顶部
const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  containerRef.value?.scrollTo({ top: 0, behavior })
}

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  containerRef.value?.scrollTo({ 
    top: totalHeight.value, 
    behavior 
  })
}

// 观察器：监听容器尺寸变化
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight

    // 监听容器尺寸变化
    resizeObserver = new ResizeObserver((entries) => {
      containerHeight.value = entries[0].contentRect.height
    })
    resizeObserver.observe(containerRef.value)

    // 初始化高度更新
    if (props.dynamicHeight) {
      nextTick(() => {
        updateItemHeight()
      })
    }
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})

// 监听数据源变化（性能优化：浅比较）
watch(
  () => props.dataSource,
  (newData, oldData) => {
    // 如果数据长度变化或引用变化，重新初始化
    if (!oldData || newData.length !== oldData.length) {
      initPositions()
      nextTick(() => {
        if (props.dynamicHeight) {
          updateItemHeight()
        }
      })
    }
  },
  { immediate: true }
)

// 暴露方法给父组件
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  getVisibleRange: () => ({
    start: startIndex.value,
    end: endIndex.value
  })
})
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
  background: linear-gradient(
    180deg,
    rgba(100, 180, 255, 0.3) 0%,
    rgba(80, 140, 255, 0.4) 100%
  );
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(100, 180, 255, 0.15);
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(120, 200, 255, 0.5) 0%,
    rgba(100, 160, 255, 0.6) 100%
  );
  box-shadow: 0 0 12px rgba(120, 200, 255, 0.3);
}

.virtual-scroll-container::-webkit-scrollbar-thumb:active {
  background: linear-gradient(
    180deg,
    rgba(140, 220, 255, 0.6) 0%,
    rgba(120, 180, 255, 0.7) 100%
  );
}

/* Firefox滚动条 */
.virtual-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 180, 255, 0.3) rgba(255, 255, 255, 0.02);
}
</style>
