<template>
    <div
        ref="containerRef"
        class="draggable-container"
        :class="containerClasses"
        :style="containerStyle"
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
                class="draggable-item"
                :class="getItemClasses(item, index)"
                :style="getItemStyle(item)"
                @dragstart="handleItemDragStart($event, item, index)"
                @dragend="handleDragEnd"
                @dragover.prevent="handleItemDragOver($event, index)"
            >
                <!-- 拖拽手柄 -->
                <div
                    v-if="handle"
                    class="drag-handle"
                    :draggable="true"
                    @dragstart.stop="handleHandleDragStart($event, item, index)"
                    @dragend.stop="handleDragEnd"
                    @click.stop
                >
                    <slot name="handle" :item="item" :index="index">
                        <el-icon><Rank /></el-icon>
                    </slot>
                </div>

                <!-- 主内容 -->
                <div class="item-content" :class="{ 'with-handle': handle }">
                    <slot :item="item" :index="index">
                        {{ item }}
                    </slot>
                </div>

                <!-- 删除按钮 -->
                <div v-if="removable" class="item-remove" @click.stop="removeItem(index)">
                    <slot name="remove" :item="item" :index="index">
                        <el-icon><Close /></el-icon>
                    </slot>
                </div>

                <!-- 拖拽遮罩 -->
                <div v-if="dragIndex === index && isDragging" class="drag-mask">
                    <el-icon class="drag-icon"><Rank /></el-icon>
                </div>

                <!-- 占位指示器 - 修复位置逻辑 -->
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
    import { Rank, Close, FolderOpened, Plus } from '@element-plus/icons-vue';

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
        handle?: boolean;
        removable?: boolean;
        group?: string;
        clone?: boolean;
        layout?: 'list' | 'grid';
        gap?: number;
        columns?: number;
        tag?: string;
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
        handle: false,
        removable: false,
        group: 'default',
        clone: false,
        layout: 'list',
        gap: 12,
        columns: 3,
        tag: 'div',
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
        'has-handle': props.handle,
    }));

    const containerStyle = computed(() => {
        const baseStyle: Record<string, string> = {};
        return baseStyle;
    });

    const getDraggable = (item: DraggableItem): boolean => {
        if (props.disabled || item.disabled) return false;
        return !props.handle;
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

    // 🔥 修复提示线位置逻辑
    const getPlaceholderPosition = (index: number): string => {
        // 跨容器拖拽，始终显示在目标位置上方
        if (isFromOtherContainer.value) {
            return 'before';
        }

        // 同容器拖拽
        if (dragIndex.value === -1) {
            return 'before';
        }

        // 从上往下拖：提示线在目标元素下方（因为原位置在上面，删除后位置前移）
        if (dragIndex.value < index) {
            return 'after';
        }
        // 从下往上拖：提示线在目标元素上方
        else {
            return 'before';
        }
    };

    const handleItemDragStart = (event: DragEvent, item: DraggableItem, index: number) => {
        if (props.handle) {
            event.preventDefault();
            return;
        }
        startDrag(event, item, index);
    };

    const handleHandleDragStart = (event: DragEvent, item: DraggableItem, index: number) => {
        startDrag(event, item, index);
    };

    const startDrag = (event: DragEvent, item: DraggableItem, index: number) => {
        if (props.disabled || item.disabled) {
            event.preventDefault();
            return;
        }

        isDragging.value = true;
        dragIndex.value = index;
        dragItem.value = props.clone ? JSON.parse(JSON.stringify(item)) : item;
        isFromOtherContainer.value = false;

        // 🔥 创建删除回调函数
        const removeCallback = () => {
            console.log('🗑️ Remove callback executed, removing item at index:', index);
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
            removeCallback: props.clone ? undefined : removeCallback, // clone 模式不需要删除
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
            // 注意：不要删除 DRAG_KEY，因为 drop 可能还没执行完
        }, 100);
    };

    const handleDragOver = (event: DragEvent) => {
        if (props.disabled) return;
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = props.clone ? 'copy' : 'move';
        }
    };

    const handleDragEnter = (event: DragEvent) => {
        dragEnterCount.value++;
        if (dragEnterCount.value === 1) {
            isDragOver.value = true;

            const dragData = (window as any)[DRAG_KEY] as DragData;
            if (dragData && dragData.sourceId !== containerId && dragData.group === props.group) {
                isFromOtherContainer.value = true;
            }
        }
    };

    const handleDragLeave = (event: DragEvent) => {
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
                console.error('Parse drag data error:', error);
            }
        }

        if (!dragData) {
            console.warn('❌ No drag data found');
            handleDragEnd();
            return;
        }

        if (dragData.group !== props.group) {
            console.warn('❌ Group mismatch:', dragData.group, props.group);
            handleDragEnd();
            return;
        }

        // 🔥 跨容器拖拽
        if (dragData.sourceId !== containerId) {
            console.log('🔄 Cross-container drag detected');
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

            // 🔥 调用源容器的删除回调
            if (dragData.removeCallback) {
                console.log('🗑️ Calling remove callback from source container');
                dragData.removeCallback();
            }

            console.log('✅ Cross-container drag completed');

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

    const removeItem = (index: number) => {
        const item = localData.value[index];
        const newData = [...localData.value];
        newData.splice(index, 1);
        localData.value = newData;
        emit('update:modelValue', newData);
        emit('remove', { item, oldIndex: index });
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

        &.layout-grid {
            .draggable-list {
                display: grid;
                grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
                gap: var(--grid-gap, 16px);
            }

            .draggable-item {
                flex-direction: column;
                align-items: stretch;
                padding: 0 !important;

                .drag-handle {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    z-index: 10;
                }

                .item-remove {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    z-index: 10;
                }

                .item-content {
                    padding: 0;
                }
            }
        }
    }

    .draggable-list {
        display: flex;
        flex-direction: column;
        gap: var(--list-gap, 12px);
        min-height: 60px;
    }

    .draggable-container.layout-grid .draggable-list {
        display: grid !important;
        grid-template-columns: repeat(var(--grid-columns, 3), 1fr) !important;
        gap: var(--grid-gap, 16px) !important;
    }

    .draggable-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        // border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;

        &[draggable='true'] {
            cursor: grab;

            &:active {
                cursor: grabbing;
            }
        }

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(102, 126, 234, 0.3);
        }

        &.is-dragging {
            opacity: 0.4;
            cursor: grabbing;
        }

        &.is-drop-target {
            border-color: rgba(102, 126, 234, 0.6);
        }

        &.is-disabled {
            opacity: 0.5;
            cursor: not-allowed;

            .drag-handle {
                opacity: 0.3;
                cursor: not-allowed;
            }
        }
    }

    .drag-handle {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        color: rgba(255, 255, 255, 0.4);
        cursor: grab;
        border-radius: 6px;
        transition: all 0.2s;
        background: rgba(255, 255, 255, 0.03);

        &:hover {
            background: rgba(102, 126, 234, 0.15);
            color: #667eea;
        }

        &:active {
            cursor: grabbing;
        }

        .el-icon {
            font-size: 18px;
        }
    }

    .item-content {
        flex: 1;
        min-width: 0;

        &.with-handle {
            cursor: default;
        }
    }

    .item-remove {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        color: rgba(255, 255, 255, 0.4);
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s;
        z-index: 10;
        background: rgba(255, 255, 255, 0.03);

        &:hover {
            background: rgba(245, 108, 108, 0.15);
            color: #f56c6c;
        }

        .el-icon {
            font-size: 16px;
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
