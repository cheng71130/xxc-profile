<template>
    <div
        ref="containerRef"
        class="draggable-container"
        :class="containerClasses"
        :style="containerStyle"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
    >
        <TransitionGroup :name="animation" :tag="tag">
            <div
                v-for="(item, index) in localData"
                :key="getItemKey(item, index)"
                :draggable="!disabled && !item.disabled"
                class="draggable-item"
                :class="getItemClasses(item, index)"
                :style="getItemStyle(item)"
                @dragstart="handleDragStart($event, item, index)"
                @dragend="handleDragEnd"
                @dragenter="handleItemDragEnter(index)"
            >
                <!-- 拖拽手柄 -->
                <div v-if="handle" class="drag-handle" @mousedown.stop>
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
                <div v-if="removable" class="item-remove" @click="removeItem(index)">
                    <slot name="remove" :item="item" :index="index">
                        <el-icon><Close /></el-icon>
                    </slot>
                </div>

                <!-- 拖拽遮罩 -->
                <div v-if="dragIndex === index" class="drag-mask">
                    <el-icon class="drag-icon"><Rank /></el-icon>
                </div>

                <!-- 占位指示器 -->
                <div
                    v-if="showPlaceholder && dropIndex === index && dragIndex !== index"
                    class="drop-placeholder"
                    :class="placeholderPosition"
                />
            </div>
        </TransitionGroup>

        <!-- 空状态 -->
        <div v-if="localData.length === 0" class="empty-state">
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
    import { ref, computed, watch, nextTick } from 'vue';
    import { Rank, Close, FolderOpened, Plus } from '@element-plus/icons-vue';

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
        'update:modelValue': [value: any[]];
        change: [event: { oldIndex: number; newIndex: number; item: any }];
        add: [event: { item: any; newIndex: number }];
        remove: [event: { item: any; oldIndex: number }];
        start: [event: { item: any; index: number }];
        end: [event: { item: any; oldIndex: number; newIndex: number }];
    }>();

    const containerRef = ref<HTMLElement>();
    const localData = ref<any[]>([...props.modelValue]);
    const dragIndex = ref<number>(-1);
    const dropIndex = ref<number>(-1);
    const dragItem = ref<any>(null);
    const isDragOver = ref(false);
    const dragEnterCount = ref(0);

    watch(
        () => props.modelValue,
        (newVal) => {
            localData.value = [...newVal];
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
        if (props.layout === 'grid') {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
                gap: `${props.gap}px`,
            };
        }
        return {
            display: 'flex',
            flexDirection: 'column',
            gap: `${props.gap}px`,
        };
    });

    const getItemKey = (item: any, index: number) => {
        if (typeof props.itemKey === 'function') {
            return props.itemKey(item);
        }
        return item[props.itemKey] ?? index;
    };

    const getItemClasses = (item: any, index: number) => ({
        'is-dragging': dragIndex.value === index,
        'is-drop-target': dropIndex.value === index && dragIndex.value !== index,
        'is-disabled': item.disabled,
        [props.ghostClass]: dragIndex.value === index && props.ghostClass,
        [props.chosenClass]: dragIndex.value === index && props.chosenClass,
        [props.dragClass]: dragIndex.value === index && props.dragClass,
    });

    const getItemStyle = (item: any) => {
        return item.style || {};
    };

    const placeholderPosition = computed(() => {
        if (dragIndex.value < dropIndex.value) {
            return 'after';
        }
        return 'before';
    });

    const handleDragStart = (event: DragEvent, item: any, index: number) => {
        if (props.disabled || item.disabled) {
            event.preventDefault();
            return;
        }

        dragIndex.value = index;
        dragItem.value = props.clone ? JSON.parse(JSON.stringify(item)) : item;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = props.clone ? 'copy' : 'move';
            event.dataTransfer.setData('text/plain', JSON.stringify({ group: props.group, index, item }));

            // 设置拖拽图像
            const dragImage = (event.target as HTMLElement).cloneNode(true) as HTMLElement;
            dragImage.style.opacity = '0.8';
            dragImage.style.transform = 'rotate(3deg)';
            document.body.appendChild(dragImage);
            event.dataTransfer.setDragImage(dragImage, 0, 0);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        }

        emit('start', { item, index });
    };

    const handleDragEnd = () => {
        dragIndex.value = -1;
        dropIndex.value = -1;
        dragItem.value = null;
        isDragOver.value = false;
        dragEnterCount.value = 0;
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
        }
    };

    const handleDragLeave = () => {
        dragEnterCount.value--;
        if (dragEnterCount.value === 0) {
            isDragOver.value = false;
        }
    };

    const handleItemDragEnter = (index: number) => {
        if (dragIndex.value === -1 || dragIndex.value === index) return;
        dropIndex.value = index;
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        isDragOver.value = false;
        dragEnterCount.value = 0;

        if (props.disabled) return;

        try {
            const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');

            // 跨容器拖拽
            if (data.group !== props.group) {
                const targetIndex = dropIndex.value >= 0 ? dropIndex.value : localData.value.length;
                localData.value.splice(targetIndex, 0, data.item);
                emit('update:modelValue', localData.value);
                emit('add', { item: data.item, newIndex: targetIndex });
                handleDragEnd();
                return;
            }

            // 同容器拖拽
            if (dragIndex.value >= 0 && dropIndex.value >= 0 && dragIndex.value !== dropIndex.value) {
                const newData = [...localData.value];
                const [removed] = newData.splice(dragIndex.value, 1);
                const insertIndex = dragIndex.value < dropIndex.value ? dropIndex.value - 1 : dropIndex.value;
                newData.splice(insertIndex, 0, removed);

                localData.value = newData;
                emit('update:modelValue', newData);
                emit('change', { oldIndex: dragIndex.value, newIndex: insertIndex, item: removed });
                emit('end', { item: removed, oldIndex: dragIndex.value, newIndex: insertIndex });
            }
        } catch (error) {
            console.error('Drop error:', error);
        }

        handleDragEnd();
    };

    const removeItem = (index: number) => {
        const item = localData.value[index];
        localData.value.splice(index, 1);
        emit('update:modelValue', localData.value);
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
        padding: 12px;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.is-drag-over {
            background: rgba(102, 126, 234, 0.08);
            border-color: rgba(102, 126, 234, 0.4);
        }

        &.is-disabled {
            opacity: 0.6;
            cursor: not-allowed;

            .draggable-item {
                cursor: not-allowed;
            }
        }
    }

    .draggable-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        cursor: grab;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(102, 126, 234, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        &:active {
            cursor: grabbing;
        }

        &.is-dragging {
            opacity: 0.4;
            cursor: grabbing;
            transform: scale(0.95);
        }

        &.is-drop-target {
            border-color: rgba(102, 126, 234, 0.6);
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        &.is-disabled {
            opacity: 0.5;
            cursor: not-allowed;

            .drag-handle {
                opacity: 0.3;
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
        background: rgba(102, 126, 234, 0.2);
        border-radius: 10px;
        backdrop-filter: blur(2px);

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
        box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
        animation: placeholder-glow 1s ease infinite;

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
            box-shadow: 0 0 8px rgba(102, 126, 234, 0.8);
        }

        &::before {
            left: -4px;
        }

        &::after {
            right: -4px;
        }
    }

    @keyframes placeholder-glow {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.6;
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
        animation: hint-pulse 1.5s ease infinite;

        .hint-icon {
            font-size: 24px;
        }
    }

    @keyframes hint-pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }

    // 动画
    .flip-list-move {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .flip-list-enter-active {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .flip-list-leave-active {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: absolute;
    }

    .flip-list-enter-from {
        opacity: 0;
        transform: scale(0.8) translateY(-20px);
    }

    .flip-list-leave-to {
        opacity: 0;
        transform: scale(0.8) translateX(30px);
    }

    // 网格布局特殊样式
    .layout-grid {
        .draggable-item {
            flex-direction: column;
            align-items: stretch;

            .drag-handle {
                align-self: flex-start;
            }

            .item-remove {
                position: absolute;
                top: 8px;
                right: 8px;
            }
        }

        .drop-placeholder {
            &.before {
                left: -7px;
                top: 0;
                bottom: 0;
                width: 3px;
                height: auto;
            }

            &.after {
                right: -7px;
                left: auto;
                top: 0;
                bottom: 0;
                width: 3px;
                height: auto;
            }

            &::before {
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
            }

            &::after {
                bottom: -4px;
                top: auto;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
</style>
