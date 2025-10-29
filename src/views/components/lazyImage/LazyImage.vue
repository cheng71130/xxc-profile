<template>
    <div
        ref="containerRef"
        class="lazy-image-container"
        :class="{ 'is-loading': loading, 'is-error': error }"
        :style="containerStyle"
    >
        <!-- 骨架屏占位 -->
        <transition name="skeleton-fade">
            <div v-if="showSkeleton && loading && !imageLoaded && !error" class="image-skeleton">
                <div class="skeleton-shimmer"></div>
                <div class="skeleton-icon">
                    <svg viewBox="0 0 64 64" fill="none">
                        <rect
                            x="8"
                            y="8"
                            width="48"
                            height="48"
                            rx="4"
                            stroke="currentColor"
                            stroke-width="2"
                            opacity="0.35"
                        />
                        <path
                            d="M 12 42 L 20 28 L 28 36 L 40 20 L 52 36 L 52 52 L 12 52 Z"
                            fill="currentColor"
                            opacity="0.15"
                        />
                        <path
                            d="M 12 42 L 20 28 L 28 36 L 40 20 L 52 36"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            opacity="0.4"
                        />
                        <circle cx="44" cy="20" r="4" fill="currentColor" opacity="0.3" />
                        <circle cx="44" cy="20" r="2" fill="currentColor" opacity="0.45" />
                    </svg>
                </div>
            </div>
        </transition>

        <!-- 自定义占位符 -->
        <transition name="placeholder-fade">
            <div v-if="loading && !showSkeleton && !imageLoaded && !error" class="image-placeholder">
                <slot name="placeholder">
                    <div class="default-placeholder">
                        <div class="placeholder-spinner"></div>
                        <span v-if="showProgress" class="placeholder-text">{{ progress }}%</span>
                    </div>
                </slot>
            </div>
        </transition>

        <!-- 模糊预览（渐进式加载-缩略图） -->
        <transition name="preview-fade">
            <img
                v-if="progressive && thumbnailSrc && thumbnailLoaded && !imageLoaded && !error"
                :src="thumbnailSrc"
                class="image-preview"
                :alt="alt"
            />
        </transition>

        <!-- 主图片 -->
        <transition name="image-fade">
            <img
                v-show="imageLoaded && !error"
                ref="imageRef"
                :src="currentSrc"
                :alt="alt"
                class="lazy-image"
                @load="handleLoad"
                @error="handleError"
            />
        </transition>

        <!-- 加载失败 -->
        <transition name="error-fade">
            <div v-if="error" class="image-error">
                <slot name="error" :retry="manualRetry">
                    <div class="error-content">
                        <div class="error-icon">
                            <svg viewBox="0 0 48 48" fill="none">
                                <rect
                                    x="8"
                                    y="8"
                                    width="32"
                                    height="32"
                                    rx="3"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    opacity="0.5"
                                />
                                <path
                                    d="M 8 32 L 16 24 L 20 28 L 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    opacity="0.4"
                                />
                                <circle cx="24" cy="24" r="8" fill="currentColor" opacity="0.15" />
                                <line
                                    x1="24"
                                    y1="20"
                                    x2="24"
                                    y2="25"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                                <circle cx="24" cy="28" r="0.8" fill="currentColor" />
                            </svg>
                        </div>
                        <p class="error-message">{{ errorMessage }}</p>
                        <button v-if="showRetry" class="error-retry-btn" @click="manualRetry">
                            <svg class="retry-icon" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M23 4v6h-6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <span>重试</span>
                        </button>
                    </div>
                </slot>
            </div>
        </transition>

        <!-- 遮罩层（hover效果等） -->
        <transition name="mask-fade">
            <div v-if="showMask && imageLoaded && !error" class="image-mask">
                <slot name="mask"></slot>
            </div>
        </transition>

        <!-- 图片标签 -->
        <div v-if="$slots.badge && imageLoaded && !error" class="image-badge">
            <slot name="badge"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

    interface Props {
        src: string;
        fallbackSrc?: string;
        alt?: string;
        width?: string | number;
        height?: string | number;
        aspectRatio?: string | number;
        fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
        showSkeleton?: boolean;
        showProgress?: boolean;
        showMask?: boolean;
        lazy?: boolean;
        threshold?: number;
        showRetry?: boolean;
        webpFallback?: boolean;
        errorMessage?: string;
        timeout?: number;
        progressive?: boolean;
        thumbnailWidth?: number;
        imageWidth?: number;
    }

    const props = withDefaults(defineProps<Props>(), {
        alt: '',
        fit: 'cover',
        showSkeleton: true,
        showProgress: false,
        showMask: false,
        lazy: true,
        threshold: 100,
        showRetry: true,
        webpFallback: true,
        errorMessage: '图片加载失败',
        timeout: 30000,
        progressive: false,
        thumbnailWidth: 100,
    });

    const emit = defineEmits<{
        load: [Event];
        error: [Error];
    }>();

    const containerRef = ref<HTMLElement>();
    const imageRef = ref<HTMLImageElement>();
    const loading = ref(true); // 初始为 true，确保骨架屏立即显示
    const imageLoaded = ref(false);
    const thumbnailLoaded = ref(false);
    const error = ref(false);
    const progress = ref(0);
    const currentSrc = ref('');
    const thumbnailSrc = ref('');

    let observer: IntersectionObserver | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const containerStyle = computed(() => {
        const style: Record<string, string> = {
            width: '100%',
        };

        if (props.aspectRatio) {
            style.aspectRatio = String(props.aspectRatio);
        } else {
            if (props.height) {
                style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
            }
        }

        return style;
    });

    // 添加 URL 参数生成图片 URL
    const buildImageUrl = (url: string, width?: number): string => {
        if (!url) return '';

        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);

            if (width) {
                params.set('w', String(width));
            }

            urlObj.search = params.toString();
            return urlObj.toString();
        } catch {
            return url;
        }
    };

    const checkWebPSupport = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!props.webpFallback) {
                resolve(true);
                return;
            }

            const webP = new Image();
            webP.onload = () => resolve(webP.width === 1);
            webP.onerror = () => resolve(false);
            webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
        });
    };

    const getRealSrc = async (src: string): Promise<string> => {
        if (!src.endsWith('.webp') || !props.webpFallback) {
            return src;
        }

        const supportsWebP = await checkWebPSupport();
        if (supportsWebP) {
            return src;
        }

        return src.replace(/\.webp$/i, '.jpg');
    };

    // 加载缩略图（渐进式加载第一步）
    const loadThumbnail = async () => {
        if (!props.progressive || !props.src) return;

        const thumbUrl = buildImageUrl(props.src, props.thumbnailWidth);
        const realThumbUrl = await getRealSrc(thumbUrl);
        thumbnailSrc.value = realThumbUrl;

        const img = new Image();
        img.onload = () => {
            thumbnailLoaded.value = true;
        };
        img.onerror = () => {
            thumbnailLoaded.value = false;
        };
        img.src = realThumbUrl;
    };

    // 加载主图
    const loadImage = async () => {
        if (!props.src) return;

        loading.value = true;
        error.value = false;
        imageLoaded.value = false;
        thumbnailLoaded.value = false;
        progress.value = 0;

        // 如果启用渐进式加载，先加载缩略图
        if (props.progressive) {
            await loadThumbnail();
        }

        // 构建主图 URL
        const mainUrl = props.imageWidth ? buildImageUrl(props.src, props.imageWidth) : props.src;
        const realSrc = await getRealSrc(mainUrl);
        currentSrc.value = realSrc;

        try {
            if (props.showProgress) {
                const progressInterval = setInterval(() => {
                    if (progress.value < 90) {
                        progress.value += Math.random() * 20;
                    }
                }, 300);

                setTimeout(() => clearInterval(progressInterval), props.timeout);
            }

            if (props.timeout > 0) {
                timeoutId = setTimeout(() => {
                    if (!imageLoaded.value) {
                        handleError(new Event('timeout'));
                    }
                }, props.timeout);
            }
        } catch (err) {
            handleError(err as Event);
        }
    };

    const handleLoad = (e: Event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        setTimeout(() => {
            loading.value = false;
            imageLoaded.value = true;
            error.value = false;
            progress.value = 100;

            emit('load', e);
        }, 150);
    };

    const handleError = (e: Event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        // 尝试备用图片
        if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
            currentSrc.value = props.fallbackSrc;
        } else {
            imageLoaded.value = false;
            thumbnailLoaded.value = false;
            loading.value = false;
            error.value = true;
            emit('error', new Error(props.errorMessage));
        }
    };

    const manualRetry = () => {
        error.value = false;
        loading.value = true;
        imageLoaded.value = false;
        thumbnailLoaded.value = false;

        setTimeout(() => {
            loadImage();
        }, 100);
    };

    // threshold实现
    const initLazyLoad = () => {
        if (!props.lazy || !containerRef.value) {
            loadImage();
            return;
        }

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const rect = entry.boundingClientRect;
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const threshold = props.threshold;

                    const isInView = rect.top < viewportHeight + threshold && rect.bottom > -threshold;

                    if (isInView) {
                        loadImage();
                        if (observer && containerRef.value) {
                            observer.unobserve(containerRef.value);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            }
        );

        observer.observe(containerRef.value);
    };

    defineExpose({
        retry: manualRetry,
        reload: () => {
            imageLoaded.value = false;
            thumbnailLoaded.value = false;
            error.value = false;
            loading.value = true;
            loadImage();
        },
    });

    onMounted(() => {
        initLazyLoad();
    });

    onBeforeUnmount(() => {
        if (observer && containerRef.value) {
            observer.unobserve(containerRef.value);
            observer.disconnect();
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    watch(
        () => props.src,
        async (newSrc, oldSrc) => {
            if (!newSrc || newSrc === oldSrc) return;

            imageLoaded.value = false;
            thumbnailLoaded.value = false;
            error.value = false;
            loading.value = true;

            if (!props.lazy) {
                loadImage();
            } else {
                initLazyLoad();
            }
        }
    );
</script>

<style scoped lang="scss">
    .lazy-image-container {
        position: relative;
        display: block;
        overflow: hidden;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .image-skeleton {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.02) 0%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0.02) 100%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 2s ease-in-out infinite;
        z-index: 2;
        border-radius: 12px;
    }

    .skeleton-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.12) 50%,
            transparent 60%,
            transparent 100%
        );
        animation: shimmer 2.5s infinite;
    }

    .skeleton-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        color: rgba(255, 255, 255, 0.25);

        svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
        }
    }

    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .skeleton-fade-leave-active {
        transition: opacity 0.4s ease;
    }

    .skeleton-fade-leave-to {
        opacity: 0;
    }

    .image-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.03);
        z-index: 2;
    }

    .default-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .placeholder-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.08);
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    .placeholder-text {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .placeholder-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .placeholder-fade-leave-to {
        opacity: 0;
    }

    .image-preview {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: v-bind(fit);
        filter: blur(20px);
        transform: scale(1.1);
        z-index: 1;
    }

    .preview-fade-enter-active {
        transition: opacity 0.6s ease;
    }

    .preview-fade-enter-from {
        opacity: 0;
    }

    .preview-fade-leave-active {
        transition: opacity 1s ease;
    }

    .preview-fade-leave-to {
        opacity: 0;
    }

    .lazy-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: v-bind(fit);
        position: relative;
        z-index: 3;
    }

    .image-fade-enter-active {
        transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .image-fade-enter-from {
        opacity: 0;
        transform: scale(0.96);
    }

    .image-error {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
        z-index: 4;
    }

    .error-fade-enter-active {
        transition: all 0.4s ease;
    }

    .error-fade-enter-from {
        opacity: 0;
        transform: scale(0.95);
    }

    .error-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        padding: 28px;
        text-align: center;
    }

    .error-icon {
        width: 56px;
        height: 56px;
        color: rgba(245, 108, 108, 0.7);
        animation: error-shake 0.5s ease;

        svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 2px 12px rgba(245, 108, 108, 0.25));
        }
    }

    @keyframes error-shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-4px);
        }
        75% {
            transform: translateX(4px);
        }
    }

    .error-message {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        letter-spacing: 0.3px;
    }

    .error-retry-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 15px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
        border: 1.5px solid rgba(102, 126, 234, 0.3);
        border-radius: 32px;
        color: #8b9cee;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        margin-top: 4px;

        .retry-icon {
            width: 16px;
            height: 16px;
            transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        &:hover {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
            border-color: rgba(102, 126, 234, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
            color: #a5b4f5;

            .retry-icon {
                transform: rotate(360deg);
            }
        }

        &:active {
            transform: translateY(0);

            .retry-icon {
                transform: rotate(360deg) scale(0.9);
            }
        }
    }

    .image-mask {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.65);
        opacity: 0;
        transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 5;

        .lazy-image-container:hover & {
            opacity: 1;
        }
    }

    .mask-fade-enter-active,
    .mask-fade-leave-active {
        transition: opacity 0.35s;
    }

    .mask-fade-enter-from,
    .mask-fade-leave-to {
        opacity: 0;
    }

    .image-badge {
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 6;
    }

    @media (max-width: 768px) {
        .skeleton-icon {
            width: 64px;
            height: 64px;
        }

        .placeholder-spinner {
            width: 32px;
            height: 32px;
        }

        .error-icon {
            width: 48px;
            height: 48px;
        }

        .error-content {
            padding: 24px;
            gap: 12px;
        }
    }
</style>
