<template>
    <div
        ref="containerRef"
        class="draggable-container"
        :class="containerClasses"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"
    >
        <TransitionGroup :name="animation" tag="div" class="draggable-list">
            <div
                v-for="(item, index) in localData"
                :key="getItemKey(item, index)"
                :draggable="getDraggable(item)"
                :data-draggable-item="index"
                class="draggable-item"
                :class="getItemClasses(item, index)"
                :style="getItemStyle(item)"
                @mousedown="handleMouseDown($event, item)"
                @dragstart="handleItemDragStart($event, item, index)"
                @dragend="handleDragEnd"
                @dragover.prevent="handleItemDragOver($event, index)"
            >
                <!-- 主内容 -->
                <slot :item="item" :index="index">
                    {{ item }}
                </slot>

                <!-- 拖拽遮罩 -->
                <div v-if="dragIndex === index && isDragging" class="drag-mask">
                    <el-icon class="drag-icon"><Rank /></el-icon>
                </div>

                <!-- 占位指示器 -->
                <div
                    v-if="showPlaceholder && dropIndex === index && dragIndex !== index"
                    class="drop-placeholder"
                    :class="getPlaceholderPosition(index)"
                />
            </div>
        </TransitionGroup>

        <!-- 空状态 -->
        <div v-if="localData.length === 0 && !isDragOver" class="empty-state">
            <slot name="empty">
                <el-icon class="empty-icon"><FolderOpened /></el-icon>
                <p class="empty-text">{{ emptyText }}</p>
            </slot>
        </div>

        <!-- 拖拽进入提示 -->
        <div v-if="isDragOver && localData.length === 0" class="drop-hint">
            <el-icon class="hint-icon"><Plus /></el-icon>
            <span>释放以添加</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import { Rank, FolderOpened, Plus } from '@element-plus/icons-vue';

    type DraggableItem = Record<string, any>;

    interface DragData {
        group: string;
        index: number;
        item: any;
        sourceId: string;
        removeCallback?: () => void;
    }

    interface ChangeEvent {
        oldIndex: number;
        newIndex: number;
        item: any;
    }

    interface AddEvent {
        item: any;
        newIndex: number;
    }

    interface RemoveEvent {
        item: any;
        oldIndex: number;
    }

    interface StartEvent {
        item: any;
        index: number;
    }

    interface EndEvent {
        item: any;
        oldIndex: number;
        newIndex: number;
    }

    interface DraggableProps {
        modelValue: any[];
        itemKey?: string | ((item: any) => string | number);
        disabled?: boolean;
        animation?: string;
        handle?: string; // CSS 选择器，指定拖拽手柄
        group?: string;
        clone?: boolean;
        layout?: 'list' | 'grid';
        gap?: number;
        columns?: number;
        emptyText?: string;
        showPlaceholder?: boolean;
        ghostClass?: string;
        chosenClass?: string;
        dragClass?: string;
    }

    const props = withDefaults(defineProps<DraggableProps>(), {
        itemKey: 'id',
        disabled: false,
        animation: 'flip-list',
        handle: '',
        group: 'default',
        clone: false,
        layout: 'list',
        gap: 12,
        columns: 3,
        emptyText: '暂无数据，拖拽添加',
        showPlaceholder: true,
        ghostClass: '',
        chosenClass: '',
        dragClass: '',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', value: any[]): void;
        (e: 'change', event: ChangeEvent): void;
        (e: 'add', event: AddEvent): void;
        (e: 'remove', event: RemoveEvent): void;
        (e: 'start', event: StartEvent): void;
        (e: 'end', event: EndEvent): void;
    }>();

    // 生成唯一 ID
    const containerId = `draggable-${Math.random().toString(36).substr(2, 9)}`;

    const containerRef = ref<HTMLElement>();
    const localData = ref<any[]>([...props.modelValue]);
    const dragIndex = ref<number>(-1);
    const dropIndex = ref<number>(-1);
    const dragItem = ref<any>(null);
    const isDragOver = ref(false);
    const isDragging = ref(false);
    const dragEnterCount = ref(0);
    const isFromOtherContainer = ref(false);
    const canDrag = ref<boolean>(false); // 新增：控制是否允许拖拽

    // 全局拖拽状态存储
    const DRAG_KEY = '__DRAGGABLE_DATA__';

    watch(
        () => props.modelValue,
        (newVal) => {
            if (!isDragging.value) {
                localData.value = [...newVal];
            }
        },
        { deep: true }
    );

    const containerClasses = computed(() => ({
        [`layout-${props.layout}`]: true,
        'is-disabled': props.disabled,
        'is-drag-over': isDragOver.value,
        'has-handle': !!props.handle,
    }));

    const getDraggable = (item: DraggableItem): boolean => {
        // 如果禁用或 item 被禁用，返回 false
        if (props.disabled || item.disabled) return false;

        // 如果有 handle，返回 true，但实际拖拽通过 mousedown 控制
        return true;
    };

    const getItemKey = (item: DraggableItem, index: number): string | number => {
        if (typeof props.itemKey === 'function') {
            return props.itemKey(item);
        }
        return item[props.itemKey] ?? index;
    };

    const getItemClasses = (item: DraggableItem, index: number) => ({
        'is-dragging': dragIndex.value === index && isDragging.value,
        'is-drop-target': dropIndex.value === index && dragIndex.value !== index,
        'is-disabled': item.disabled,
        [props.ghostClass]: dragIndex.value === index && isDragging.value && props.ghostClass,
        [props.chosenClass]: dragIndex.value === index && isDragging.value && props.chosenClass,
        [props.dragClass]: dragIndex.value === index && isDragging.value && props.dragClass,
    });

    const getItemStyle = (item: DraggableItem) => {
        return item.style || {};
    };

    const getPlaceholderPosition = (index: number): string => {
        if (isFromOtherContainer.value) {
            return 'before';
        }

        if (dragIndex.value === -1) {
            return 'before';
        }

        if (dragIndex.value < index) {
            return 'after';
        } else {
            return 'before';
        }
    };

    // 检查是否点击了拖拽手柄
    const isHandleTarget = (target: HTMLElement): boolean => {
        if (!props.handle) return true;

        // 向上查找，检查是否在 draggable-item 内
        let currentElement: HTMLElement | null = target;
        let itemElement: HTMLElement | null = null;

        // 先找到 draggable-item
        while (currentElement) {
            if (currentElement.hasAttribute('data-draggable-item')) {
                itemElement = currentElement;
                break;
            }
            currentElement = currentElement.parentElement;
        }

        if (!itemElement) {
            return false;
        }

        // 查找手柄元素
        const handleElement = itemElement.querySelector(props.handle);
        if (!handleElement) {
            console.warn(`[Draggable] Handle selector "${props.handle}" not found in item`);
            return true;
        }

        // 检查 target 是否是 handleElement 或其子元素
        currentElement = target;
        while (currentElement && currentElement !== itemElement) {
            if (currentElement === handleElement) {
                return true;
            }
            currentElement = currentElement.parentElement;
        }

        return false;
    };

    // mousedown 事件处理
    const handleMouseDown = (event: MouseEvent, item: DraggableItem) => {
        if (props.disabled || item.disabled) {
            canDrag.value = false;
            return;
        }

        // 如果指定了 handle，检查是否点击了手柄
        if (props.handle) {
            const target = event.target as HTMLElement;
            canDrag.value = isHandleTarget(target);

            if (!canDrag.value) {
                // 阻止默认拖拽行为
                event.preventDefault();
            }
        } else {
            canDrag.value = true;
        }
    };

    const handleItemDragStart = (event: DragEvent, item: DraggableItem, index: number) => {
        if (props.disabled || item.disabled) {
            event.preventDefault();
            return;
        }

        // 如果指定了 handle，但没有通过 mousedown 检查，则阻止拖拽
        if (props.handle && !canDrag.value) {
            event.preventDefault();
            return;
        }

        startDrag(event, item, index);
    };

    const startDrag = (event: DragEvent, item: DraggableItem, index: number) => {
        isDragging.value = true;
        dragIndex.value = index;
        dragItem.value = props.clone ? JSON.parse(JSON.stringify(item)) : item;
        isFromOtherContainer.value = false;

        // 创建删除回调函数
        const removeCallback = () => {
            const newData = [...localData.value];
            newData.splice(index, 1);
            localData.value = newData;
            emit('update:modelValue', newData);
            emit('remove', { item, oldIndex: index });
        };

        const dragData: DragData = {
            group: props.group,
            index,
            item: props.clone ? JSON.parse(JSON.stringify(item)) : item,
            sourceId: containerId,
            removeCallback: props.clone ? undefined : removeCallback,
        };

        // 存储到全局
        (window as any)[DRAG_KEY] = dragData;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = props.clone ? 'copy' : 'move';
            const dataString = JSON.stringify({
                group: dragData.group,
                index: dragData.index,
                item: dragData.item,
                sourceId: dragData.sourceId,
            });
            event.dataTransfer.setData('text/plain', dataString);
            event.dataTransfer.setData('application/json', dataString);
        }

        emit('start', { item, index });
    };

    const handleDragEnd = () => {
        setTimeout(() => {
            isDragging.value = false;
            dragIndex.value = -1;
            dropIndex.value = -1;
            dragItem.value = null;
            isDragOver.value = false;
            dragEnterCount.value = 0;
            isFromOtherContainer.value = false;
            canDrag.value = false;
        }, 100);
    };

    const handleDragOver = (event: DragEvent) => {
        if (props.disabled) return;
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = props.clone ? 'copy' : 'move';
        }
    };

    const handleDragEnter = () => {
        dragEnterCount.value++;
        if (dragEnterCount.value === 1) {
            isDragOver.value = true;

            const dragData = (window as any)[DRAG_KEY] as DragData;
            if (dragData && dragData.sourceId !== containerId && dragData.group === props.group) {
                isFromOtherContainer.value = true;
            }
        }
    };

    const handleDragLeave = () => {
        dragEnterCount.value--;
        if (dragEnterCount.value === 0) {
            isDragOver.value = false;
            dropIndex.value = -1;
        }
    };

    const handleItemDragOver = (event: DragEvent, index: number) => {
        if (props.disabled) return;
        event.preventDefault();
        dropIndex.value = index;
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        isDragOver.value = false;
        dragEnterCount.value = 0;

        if (props.disabled) {
            handleDragEnd();
            return;
        }

        // 获取拖拽数据
        let dragData = (window as any)[DRAG_KEY] as DragData;

        if (!dragData) {
            try {
                let dataStr = event.dataTransfer?.getData('application/json') || '';
                if (!dataStr) {
                    dataStr = event.dataTransfer?.getData('text/plain') || '';
                }
                if (dataStr) {
                    const parsedData = JSON.parse(dataStr);
                    dragData = {
                        ...parsedData,
                        removeCallback: (window as any)[DRAG_KEY]?.removeCallback,
                    };
                }
            } catch (error) {
                console.error('[Draggable] Parse drag data error:', error);
            }
        }

        if (!dragData) {
            console.warn('[Draggable] No drag data found');
            handleDragEnd();
            return;
        }

        if (dragData.group !== props.group) {
            console.warn('[Draggable] Group mismatch:', dragData.group, props.group);
            handleDragEnd();
            return;
        }

        // 跨容器拖拽
        if (dragData.sourceId !== containerId) {
            let targetIndex = dropIndex.value;
            if (targetIndex < 0 || targetIndex >= localData.value.length) {
                targetIndex = localData.value.length;
            }

            // 添加到目标容器
            const newData = [...localData.value];
            newData.splice(targetIndex, 0, dragData.item);
            localData.value = newData;
            emit('update:modelValue', newData);
            emit('add', { item: dragData.item, newIndex: targetIndex });

            // 调用源容器的删除回调
            if (dragData.removeCallback) {
                dragData.removeCallback();
            }

            // 清理全局数据
            setTimeout(() => {
                delete (window as any)[DRAG_KEY];
            }, 200);

            handleDragEnd();
            return;
        }

        // 同容器拖拽
        if (dragIndex.value >= 0 && dropIndex.value >= 0) {
            if (dragIndex.value === dropIndex.value) {
                handleDragEnd();
                return;
            }

            const newData = [...localData.value];
            const [removed] = newData.splice(dragIndex.value, 1);

            let insertIndex = dropIndex.value;
            if (dragIndex.value < dropIndex.value) {
                insertIndex = dropIndex.value;
            }

            newData.splice(insertIndex, 0, removed);

            localData.value = newData;
            emit('update:modelValue', newData);
            emit('change', { oldIndex: dragIndex.value, newIndex: insertIndex, item: removed });
            emit('end', { item: removed, oldIndex: dragIndex.value, newIndex: insertIndex });
        }

        handleDragEnd();
    };

    defineExpose({
        containerRef,
    });
</script>

<style scoped lang="scss">
    .draggable-container {
        position: relative;
        min-height: 60px;
        border-radius: 12px;
        transition: background 0.2s, border-color 0.2s;

        &.is-drag-over {
            background: rgba(102, 126, 234, 0.05);
        }

        &.is-disabled {
            opacity: 0.6;
            cursor: not-allowed;

            .draggable-item {
                cursor: not-allowed;
            }
        }

        &.has-handle {
            .draggable-item {
                cursor: default;
            }
        }

        &.layout-grid {
            .draggable-list {
                display: grid;
                grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
                gap: var(--grid-gap, 16px);
            }
        }
    }

    .draggable-list {
        display: flex;
        flex-direction: column;
        gap: var(--list-gap, 12px);
        min-height: 60px;
    }

    .draggable-item {
        position: relative;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;

        &[draggable='true'] {
            cursor: grab;

            &:active {
                cursor: grabbing;
            }
        }

        &.is-dragging {
            opacity: 0.4;
            cursor: grabbing;
        }

        &.is-drop-target {
            // 用户可以通过插槽自定义样式，这里不添加默认样式
            min-height: 0;
        }

        &.is-disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .drag-mask {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 10px;
        pointer-events: none;
        z-index: 1000;

        .drag-icon {
            font-size: 32px;
            color: #667eea;
            animation: drag-pulse 1s ease infinite;
        }
    }

    @keyframes drag-pulse {
        0%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.8;
        }
    }

    .drop-placeholder {
        position: absolute;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
        pointer-events: none;
        z-index: 100;

        &.before {
            top: -7px;
        }

        &.after {
            bottom: -7px;
        }

        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(102, 126, 234, 0.8);
        }

        &::before {
            left: -4px;
        }

        &::after {
            right: -4px;
        }
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 180px;
        color: rgba(255, 255, 255, 0.3);

        .empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-text {
            margin: 0;
            font-size: 14px;
        }
    }

    .drop-hint {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #667eea;
        font-size: 16px;
        font-weight: 600;
        background: rgba(102, 126, 234, 0.08);
        border: 2px dashed rgba(102, 126, 234, 0.4);
        border-radius: 12px;
        pointer-events: none;

        .hint-icon {
            font-size: 24px;
        }
    }

    // 动画
    .flip-list-move {
        transition: transform 0.3s ease;
    }

    .flip-list-enter-active {
        transition: all 0.3s ease;
    }

    .flip-list-leave-active {
        transition: all 0.2s ease;
        position: absolute;
        opacity: 0;
    }

    .flip-list-enter-from {
        opacity: 0;
        transform: translateY(-10px);
    }

    .flip-list-leave-to {
        opacity: 0;
        transform: translateX(20px);
    }
</style>
