<template>
    <Teleport to="body">
        <Transition name="preview-modal">
            <div
                v-if="visible"
                ref="modalRef"
                class="image-preview-modal"
                @click.self="handleMaskClick"
                @wheel.prevent="handleWheel"
                @touchstart.prevent="handleTouchStart"
                @touchmove.prevent="handleTouchMove"
                @touchend.prevent="handleTouchEnd"
            >
                <!-- 工具栏 -->
                <div class="preview-toolbar">
                    <div class="toolbar-left">
                        <span v-if="images.length > 1" class="image-counter">
                            {{ currentIndex + 1 }} / {{ images.length }}
                        </span>
                    </div>

                    <div class="toolbar-center">
                        <button class="toolbar-btn" title="放大 (滚轮向上)" @click="zoomIn">
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                                <path
                                    d="M11 8v6M8 11h6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M21 21l-4.35-4.35"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>

                        <button class="toolbar-btn" title="缩小 (滚轮向下)" @click="zoomOut">
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                                <path d="M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                <path
                                    d="M21 21l-4.35-4.35"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>

                        <button class="toolbar-btn" title="1:1 显示" @click="resetZoom">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>

                        <button class="toolbar-btn" title="向左旋转" @click="rotateLeft">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M2.5 2v6h6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M2.66 15.57a10 10 0 1 0 .57-8.38"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>

                        <button class="toolbar-btn" title="向右旋转" @click="rotateRight">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21.5 2v6h-6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M21.34 15.57a10 10 0 1 1-.57-8.38"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>

                        <button v-if="downloadable" class="toolbar-btn" title="下载图片" @click="downloadImage">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <polyline
                                    points="7 10 12 15 17 10"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <line
                                    x1="12"
                                    y1="15"
                                    x2="12"
                                    y2="3"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="toolbar-right">
                        <button class="toolbar-btn close-btn" title="关闭 (ESC)" @click="close">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 图片容器 -->
                <div class="preview-container">
                    <!-- 左箭头 -->
                    <Transition name="arrow-fade">
                        <button
                            v-if="images.length > 1"
                            class="preview-arrow arrow-left"
                            :class="{ disabled: currentIndex === 0 && !loop }"
                            @click="prev"
                        >
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M15 18l-6-6 6-6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </Transition>

                    <!-- 图片 -->
                    <div
                        ref="imageWrapperRef"
                        class="image-wrapper"
                        :style="wrapperStyle"
                        @mousedown="handleMouseDown"
                        @dblclick="handleDoubleClick"
                    >
                        <img
                            ref="imageRef"
                            :src="currentImage.src"
                            :alt="currentImage.alt || ''"
                            class="preview-image"
                            :style="imageStyle"
                            draggable="false"
                            @load="handleImageLoad"
                            @error="handleImageError"
                        />

                        <!-- 加载中 -->
                        <Transition name="loading-fade">
                            <div v-if="loading" class="preview-loading">
                                <div class="loading-spinner"></div>
                            </div>
                        </Transition>

                        <!-- 加载失败 -->
                        <Transition name="error-fade">
                            <div v-if="imageError" class="preview-error">
                                <div class="error-icon">
                                    <svg viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" />
                                        <path
                                            d="M24 14v12"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                        <circle cx="24" cy="32" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                                <p>图片加载失败</p>
                            </div>
                        </Transition>
                    </div>

                    <!-- 右箭头 -->
                    <Transition name="arrow-fade">
                        <button
                            v-if="images.length > 1"
                            class="preview-arrow arrow-right"
                            :class="{ disabled: currentIndex === images.length - 1 && !loop }"
                            @click="next"
                        >
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M9 18l6-6-6-6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </Transition>
                </div>

                <!-- 缩略图列表 -->
                <Transition name="thumbs-fade">
                    <div v-if="showThumbnails && normalizedImages.length > 1" class="preview-thumbnails">
                        <div class="thumbnails-wrapper">
                            <div
                                v-for="(image, index) in normalizedImages"
                                :key="index"
                                class="thumbnail-item"
                                :class="{ active: index === currentIndex }"
                                @click="switchTo(index)"
                            >
                                <img :src="image.thumb || image.src" :alt="image.alt || ''" />
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

    export interface PreviewImage {
        src: string;
        alt?: string;
        thumb?: string;
    }

    interface Props {
        images: string[] | PreviewImage[];
        initialIndex?: number;
        loop?: boolean;
        maskClosable?: boolean;
        downloadable?: boolean;
        showThumbnails?: boolean;
        zoomRate?: number;
        minZoom?: number;
        maxZoom?: number;
    }

    const props = withDefaults(defineProps<Props>(), {
        initialIndex: 0,
        loop: true,
        maskClosable: true,
        downloadable: true,
        showThumbnails: true,
        zoomRate: 0.15,
        minZoom: 0.1,
        maxZoom: 5,
    });

    const emit = defineEmits<{
        close: [];
        change: [index: number];
        switch: [prev: number, current: number];
    }>();

    const visible = ref(false);
    const currentIndex = ref(0);
    const loading = ref(false);
    const imageError = ref(false);

    // 变换状态
    const scale = ref(1);
    const rotate = ref(0);
    const offsetX = ref(0);
    const offsetY = ref(0);

    // DOM 引用
    const modalRef = ref<HTMLElement>();
    const imageRef = ref<HTMLImageElement>();
    const imageWrapperRef = ref<HTMLElement>();

    // 拖拽状态
    const isDragging = ref(false);
    const dragStart = { x: 0, y: 0 };
    const dragOffset = { x: 0, y: 0 };

    // 触摸状态
    let initialDistance = 0;
    let initialScale = 1;
    let touchStartTime = 0;

    // 标准化图片数据
    const normalizedImages = computed<PreviewImage[]>(() => {
        return props.images.map((img) => {
            if (typeof img === 'string') {
                return { src: img };
            }
            return img;
        });
    });

    const currentImage = computed(() => normalizedImages.value[currentIndex.value] || { src: '' });

    const imageStyle = computed(() => {
        return {
            transform: `scale(${scale.value}) rotate(${rotate.value}deg) translate(${offsetX.value}px, ${offsetY.value}px)`,
            transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isDragging.value ? 'grabbing' : scale.value > 1 ? 'grab' : 'default',
        };
    });

    const wrapperStyle = computed(() => {
        return {
            cursor: isDragging.value ? 'grabbing' : 'default',
        };
    });

    // 打开预览
    const open = (index: number = props.initialIndex) => {
        currentIndex.value = Math.max(0, Math.min(index, normalizedImages.value.length - 1));
        visible.value = true;
        resetTransform();

        nextTick(() => {
            document.body.style.overflow = 'hidden';
        });
    };

    // 关闭预览
    const close = () => {
        visible.value = false;
        document.body.style.overflow = '';
        emit('close');
    };

    // 重置变换
    const resetTransform = () => {
        scale.value = 1;
        rotate.value = 0;
        offsetX.value = 0;
        offsetY.value = 0;
    };

    // 放大
    const zoomIn = () => {
        const newScale = Math.min(scale.value + props.zoomRate, props.maxZoom);
        scale.value = Math.round(newScale * 100) / 100;
    };

    // 缩小
    const zoomOut = () => {
        const newScale = Math.max(scale.value - props.zoomRate, props.minZoom);
        scale.value = Math.round(newScale * 100) / 100;

        // 如果缩小后偏移过大，重置位置
        if (scale.value === 1) {
            offsetX.value = 0;
            offsetY.value = 0;
        }
    };

    // 重置缩放
    const resetZoom = () => {
        scale.value = 1;
        offsetX.value = 0;
        offsetY.value = 0;
    };

    // 向左旋转
    const rotateLeft = () => {
        rotate.value -= 90;
        offsetX.value = 0;
        offsetY.value = 0;
    };

    // 向右旋转
    const rotateRight = () => {
        rotate.value += 90;
        offsetX.value = 0;
        offsetY.value = 0;
    };

    // 上一张
    const prev = () => {
        if (currentIndex.value > 0) {
            switchTo(currentIndex.value - 1);
        } else if (props.loop) {
            switchTo(normalizedImages.value.length - 1);
        }
    };

    // 下一张
    const next = () => {
        if (currentIndex.value < normalizedImages.value.length - 1) {
            switchTo(currentIndex.value + 1);
        } else if (props.loop) {
            switchTo(0);
        }
    };

    // 切换到指定索引
    const switchTo = (index: number) => {
        if (index === currentIndex.value) return;

        const prevIndex = currentIndex.value;
        currentIndex.value = index;
        resetTransform();

        emit('switch', prevIndex, index);
        emit('change', index);
    };

    // 下载图片
    const downloadImage = async () => {
        try {
            const response = await fetch(currentImage.value.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image-${currentIndex.value + 1}.${blob.type.split('/')[1] || 'jpg'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('下载图片失败:', error);
        }
    };

    // 处理遮罩点击
    const handleMaskClick = () => {
        if (props.maskClosable) {
            close();
        }
    };

    // 处理滚轮缩放
    const handleWheel = (e: WheelEvent) => {
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    };

    // 处理鼠标拖拽
    const handleMouseDown = (e: MouseEvent) => {
        if (scale.value <= 1) return;

        isDragging.value = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
        dragOffset.x = offsetX.value;
        dragOffset.y = offsetY.value;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.value) return;

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        offsetX.value = dragOffset.x + dx / scale.value;
        offsetY.value = dragOffset.y + dy / scale.value;
    };

    const handleMouseUp = () => {
        isDragging.value = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // 处理双击
    const handleDoubleClick = () => {
        if (scale.value > 1) {
            resetZoom();
        } else {
            scale.value = 2;
        }
    };

    // 处理触摸事件
    let touches: Touch[] = [];

    const handleTouchStart = (e: TouchEvent) => {
        touches = Array.from(e.touches);
        touchStartTime = Date.now();

        if (touches.length === 2) {
            initialDistance = getTouchDistance(touches[0], touches[1]);
            initialScale = scale.value;
        } else if (touches.length === 1 && scale.value > 1) {
            isDragging.value = true;
            dragStart.x = touches[0].clientX;
            dragStart.y = touches[0].clientY;
            dragOffset.x = offsetX.value;
            dragOffset.y = offsetY.value;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        touches = Array.from(e.touches);

        if (touches.length === 2) {
            const distance = getTouchDistance(touches[0], touches[1]);
            const newScale = (distance / initialDistance) * initialScale;
            scale.value = Math.max(props.minZoom, Math.min(newScale, props.maxZoom));
        } else if (touches.length === 1 && isDragging.value) {
            const dx = touches[0].clientX - dragStart.x;
            const dy = touches[0].clientY - dragStart.y;

            offsetX.value = dragOffset.x + dx / scale.value;
            offsetY.value = dragOffset.y + dy / scale.value;
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        const touchDuration = Date.now() - touchStartTime;

        // 双击检测
        if (e.touches.length === 0 && touchDuration < 300) {
            handleDoubleClick();
        }

        isDragging.value = false;
        touches = [];
    };

    const getTouchDistance = (touch1: Touch, touch2: Touch): number => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // 处理图片加载
    const handleImageLoad = () => {
        loading.value = false;
        imageError.value = false;
    };

    const handleImageError = () => {
        loading.value = false;
        imageError.value = true;
    };

    // 键盘事件
    const handleKeydown = (e: KeyboardEvent) => {
        if (!visible.value) return;

        switch (e.key) {
            case 'Escape':
                close();
                break;
            case 'ArrowLeft':
                prev();
                break;
            case 'ArrowRight':
                next();
                break;
            case '+':
            case '=':
                zoomIn();
                break;
            case '-':
            case '_':
                zoomOut();
                break;
            case '0':
                resetZoom();
                break;
        }
    };

    // 监听图片切换
    watch(
        () => currentImage.value.src,
        () => {
            loading.value = true;
            imageError.value = false;
        }
    );

    onMounted(() => {
        document.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.overflow = '';
    });

    defineExpose({
        open,
        close,
        next,
        prev,
        zoomIn,
        zoomOut,
        resetZoom,
        rotateLeft,
        rotateRight,
    });
</script>

<style scoped lang="scss">
    .image-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .preview-modal-enter-active,
    .preview-modal-leave-active {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .preview-modal-enter-from,
    .preview-modal-leave-to {
        opacity: 0;
        backdrop-filter: blur(0px);
        -webkit-backdrop-filter: blur(0px);
    }

    // 工具栏
    .preview-toolbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
        z-index: 10;
    }

    .toolbar-left,
    .toolbar-center,
    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .toolbar-center {
        gap: 4px;
    }

    .image-counter {
        color: rgba(255, 255, 255, 0.85);
        font-size: 14px;
        font-weight: 500;
        padding: 6px 14px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(10px);
    }

    .toolbar-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.08);
        border: none;
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);

        svg {
            width: 20px;
            height: 20px;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
            transform: translateY(-1px);
        }

        &:active {
            transform: translateY(0);
        }

        &.close-btn:hover {
            background: rgba(245, 108, 108, 0.2);
            color: #f56c6c;
        }
    }

    // 图片容器
    .preview-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .preview-image {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        transform-origin: center;
        will-change: transform;
    }

    .preview-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-fade-enter-active,
    .loading-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .loading-fade-enter-from,
    .loading-fade-leave-to {
        opacity: 0;
    }

    .preview-error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        color: rgba(255, 255, 255, 0.6);

        .error-icon {
            width: 64px;
            height: 64px;
            color: rgba(245, 108, 108, 0.7);

            svg {
                width: 100%;
                height: 100%;
            }
        }

        p {
            margin: 0;
            font-size: 14px;
        }
    }

    .error-fade-enter-active,
    .error-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .error-fade-enter-from,
    .error-fade-leave-to {
        opacity: 0;
    }

    // 箭头
    .preview-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        z-index: 5;

        svg {
            width: 24px;
            height: 24px;
        }

        &:hover:not(.disabled) {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            transform: translateY(-50%) scale(1.1);
        }

        &.disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        &.arrow-left {
            left: 32px;
        }

        &.arrow-right {
            right: 32px;
        }
    }

    .arrow-fade-enter-active,
    .arrow-fade-leave-active {
        transition: all 0.3s ease;
    }

    .arrow-fade-enter-from,
    .arrow-fade-leave-to {
        opacity: 0;
        transform: translateY(-50%) scale(0.8);
    }

    // 缩略图
    .preview-thumbnails {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 24px 24px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
        z-index: 10;
    }

    .thumbnails-wrapper {
        display: flex;
        gap: 12px;
        justify-content: center;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 8px 0;

        &::-webkit-scrollbar {
            height: 4px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }
    }

    .thumbnail-item {
        flex-shrink: 0;
        width: 80px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        background: rgba(255, 255, 255, 0.05);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &:hover {
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        &.active {
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
        }
    }

    .thumbs-fade-enter-active,
    .thumbs-fade-leave-active {
        transition: all 0.3s ease;
    }

    .thumbs-fade-enter-from,
    .thumbs-fade-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }

    // 响应式
    @media (max-width: 768px) {
        .preview-toolbar {
            height: 56px;
            padding: 0 16px;
        }

        .toolbar-btn {
            width: 36px;
            height: 36px;

            svg {
                width: 18px;
                height: 18px;
            }
        }

        .toolbar-center {
            gap: 2px;
        }

        .preview-arrow {
            width: 40px;
            height: 40px;

            &.arrow-left {
                left: 16px;
            }

            &.arrow-right {
                right: 16px;
            }
        }

        .preview-thumbnails {
            padding: 12px 16px 16px;
        }

        .thumbnail-item {
            width: 60px;
            height: 45px;
        }
    }
</style>
