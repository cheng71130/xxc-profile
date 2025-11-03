<template>
    <div class="lazy-image-demo animate__animated animate__fadeIn">
        <!-- 顶部操作栏 -->
        <div class="demo-actions">
            <el-radio-group v-model="currentDemo" size="large">
                <el-radio-button label="skeleton">骨架屏占位</el-radio-button>
                <el-radio-button label="progressive">渐进式加载</el-radio-button>
                <el-radio-button label="error">失败重试</el-radio-button>
                <el-radio-button label="hover">Hover遮罩</el-radio-button>
                <el-radio-button label="virtual">虚拟滚动</el-radio-button>
            </el-radio-group>

            <el-button type="primary" @click="reloadCurrent" :icon="RefreshRight"> 重新加载 </el-button>
        </div>

        <!-- 骨架屏占位 -->
        <div v-if="currentDemo === 'skeleton'" class="demo-grid" :key="skeletonKey">
            <LazyImage
                v-for="i in 6"
                :key="`skeleton-${i}-${skeletonKey}`"
                :src="`https://picsum.photos/800/600?random=${i + skeletonKey * 100}`"
                aspect-ratio="16/9"
                alt="骨架屏示例"
                show-skeleton
            >
                <template #badge>
                    <div class="badge-number">#{{ i }}</div>
                </template>
            </LazyImage>
        </div>

        <!-- 渐进式加载 -->
        <div v-if="currentDemo === 'progressive'" class="demo-grid" :key="progressiveKey">
            <LazyImage
                v-for="item in hdImages"
                :key="`progressive-${item.id}-${progressiveKey}`"
                :src="item.src"
                progressive
                :thumbnail-width="100"
                aspect-ratio="16/9"
                alt="渐进式加载"
            >
                <template #badge>
                    <el-tag type="success" effect="dark" size="small">
                        <el-icon><Picture /></el-icon>
                        高清
                    </el-tag>
                </template>
            </LazyImage>
        </div>

        <!-- 失败重试 -->
        <div v-if="currentDemo === 'error'" class="demo-grid-error" :key="errorKey">
            <div class="image-card">
                <LazyImage
                    :src="`https://invalid-url-example-test.com/image-1.jpg?t=${errorKey}`"
                    aspect-ratio="4/3"
                    show-retry
                    alt="手动重试"
                />
                <div class="card-footer">
                    <span class="card-title">加载失败，手动重试</span>
                    <el-tag type="warning" size="small">失败</el-tag>
                </div>
            </div>

            <div class="image-card">
                <LazyImage
                    :src="`https://invalid-url-example-test.com/image-2.jpg?t=${errorKey}`"
                    :fallback-src="`https://picsum.photos/600/450?random=${errorKey + 999}`"
                    aspect-ratio="4/3"
                    alt="备用图片"
                />
                <div class="card-footer">
                    <span class="card-title">失败后显示备用图</span>
                    <el-tag type="info" size="small">降级</el-tag>
                </div>
            </div>

            <div class="image-card">
                <LazyImage
                    :src="`https://invalid-url-example-test.com/image-3.jpg?t=${errorKey}`"
                    aspect-ratio="4/3"
                    error-message="图片走丢了 😢"
                    :show-retry="false"
                    alt="自定义错误"
                />
                <div class="card-footer">
                    <span class="card-title">自定义错误提示</span>
                    <el-tag type="danger" size="small">错误</el-tag>
                </div>
            </div>

            <div class="image-card">
                <LazyImage
                    :src="`https://invalid-url-example-test.com/image-4.jpg?t=${errorKey}`"
                    aspect-ratio="4/3"
                    alt="自定义错误样式"
                >
                    <template #error="{ retry }">
                        <div class="custom-error">
                            <div class="error-emoji">💔</div>
                            <p class="error-text">加载失败</p>
                            <el-button type="primary" :icon="RefreshRight" round @click="retry"> 重试 </el-button>
                        </div>
                    </template>
                </LazyImage>
                <div class="card-footer">
                    <span class="card-title">自定义错误内容</span>
                    <el-tag type="danger" size="small">定制</el-tag>
                </div>
            </div>
        </div>

        <!-- Hover遮罩 -->
        <div v-if="currentDemo === 'hover'" class="demo-grid" :key="hoverKey">
            <LazyImage
                v-for="img in hoverImages"
                :key="`hover-${img.id}-${hoverKey}`"
                :src="`${img.src}&t=${hoverKey}`"
                aspect-ratio="16/9"
                :alt="img.title"
                show-mask
            >
                <template #mask>
                    <div class="hover-mask">
                        <div class="mask-content">
                            <h3 class="mask-title">{{ img.title }}</h3>
                            <p class="mask-desc">{{ img.description }}</p>
                            <div class="mask-actions">
                                <el-button type="primary" circle>
                                    <el-icon><ZoomIn /></el-icon>
                                </el-button>
                                <el-button type="success" circle>
                                    <el-icon><Download /></el-icon>
                                </el-button>
                                <el-button type="info" circle>
                                    <el-icon><Share /></el-icon>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </template>
            </LazyImage>
        </div>

        <!-- 虚拟滚动 -->
        <div v-if="currentDemo === 'virtual'">
            <div class="demo-virtual">
                <VirtualScroll
                    :key="virtualKey"
                    :data-source="virtualImages"
                    :estimated-item-height="280"
                    :buffer-size="3"
                    item-key="id"
                >
                    <template #default="{ item, index }">
                        <div class="virtual-item">
                            <div class="virtual-image">
                                <LazyImage
                                    :src="`${item.src}&t=${virtualKey}`"
                                    aspect-ratio="16/9"
                                    :alt="item.title"
                                    show-skeleton
                                    :threshold="500"
                                >
                                    <template #badge>
                                        <el-tag type="info" effect="dark" size="small"> #{{ index + 1 }} </el-tag>
                                    </template>
                                </LazyImage>
                            </div>
                            <div class="virtual-info">
                                <div class="info-header">
                                    <h4>{{ item.title }}</h4>
                                    <el-tag size="small">{{ item.category }}</el-tag>
                                </div>
                                <div class="info-meta">
                                    <span
                                        ><el-icon><Clock /></el-icon> {{ item.time }}</span
                                    >
                                    <span
                                        ><el-icon><View /></el-icon> {{ item.views }}</span
                                    >
                                    <span
                                        ><el-icon><Document /></el-icon> {{ item.size }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </template>
                </VirtualScroll>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import LazyImage from './LazyImage.vue';
    import VirtualScroll from '../virtualScroll/VirtualScroll.vue';
    import { RefreshRight, Picture, ZoomIn, Download, Share, Clock, View, Document } from '@element-plus/icons-vue';

    const currentDemo = ref('skeleton');

    // 每个 tab 独立的 key
    const skeletonKey = ref(0);
    const progressiveKey = ref(0);
    const errorKey = ref(0);
    const hoverKey = ref(0);
    const virtualKey = ref(0);

    const hdImages = [
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
        },
        {
            id: 2,
            src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        },
        {
            id: 4,
            src: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65',
        },
        {
            id: 5,
            src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        },
    ];

    const hoverImages = [
        {
            id: 1,
            src: 'https://picsum.photos/1200/675?random=30',
            title: '壮丽山河',
            description: '大自然的鬼斧神工，令人叹为观止',
        },
        {
            id: 2,
            src: 'https://picsum.photos/1200/675?random=31',
            title: '都市霓虹',
            description: '繁华都市，灯火辉煌的夜景',
        },
        {
            id: 3,
            src: 'https://picsum.photos/1200/675?random=32',
            title: '宁静湖泊',
            description: '平静的湖面倒映着天空的颜色',
        },
        {
            id: 4,
            src: 'https://picsum.photos/1200/675?random=33',
            title: '星空银河',
            description: '浩瀚宇宙中璀璨的星河',
        },
    ];

    const virtualImages = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        src: `https://picsum.photos/800/450?random=${100 + i}`,
        title: `精美图片 ${i + 1}`,
        category: ['风景', '人物', '建筑', '动物', '美食'][Math.floor(Math.random() * 5)],
        time: `${Math.floor(Math.random() * 24)}小时前`,
        views: `${(Math.random() * 10 + 1).toFixed(1)}k`,
        size: `${(Math.random() * 3 + 1).toFixed(2)} MB`,
    }));

    // 只重新加载当前 tab
    const reloadCurrent = () => {
        switch (currentDemo.value) {
            case 'skeleton':
                skeletonKey.value++;
                break;
            case 'progressive':
                progressiveKey.value++;
                break;
            case 'error':
                errorKey.value++;
                break;
            case 'hover':
                hoverKey.value++;
                break;
            case 'virtual':
                virtualKey.value++;
                break;
        }
    };
</script>

<style scoped lang="scss">
    .lazy-image-demo {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
    }

    .demo-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(10px);
        flex-wrap: wrap;

        :deep(.el-radio-button) {
            --el-radio-button-checked-bg-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --el-radio-button-checked-border-color: #667eea;
        }

        :deep(.el-radio-button__inner) {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            transition: all 0.3s;

            &:hover {
                color: #667eea;
                border-color: rgba(102, 126, 234, 0.5);
            }
        }

        :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
    }

    .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
        gap: 24px;
    }

    .demo-grid-error {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
        gap: 24px;
    }

    :deep(.demo-grid-error .lazy-image-container),
    :deep(.demo-grid-error .image-skeleton) {
        border-radius: unset;
    }

    .image-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-4px);
            border-color: rgba(102, 126, 234, 0.4);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-top: 1px solid rgba(255, 255, 255, 0.04);

        .card-title {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.85);
        }
    }

    .badge-number {
        padding: 6px 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5);
        letter-spacing: 0.5px;
    }

    .custom-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 24px;

        .error-emoji {
            font-size: 52px;
            animation: error-bounce 0.6s ease;
        }

        .error-text {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.65);
        }
    }

    @keyframes error-bounce {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    .hover-mask {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mask-content {
        text-align: center;
        color: #ffffff;
        padding: 24px;
        animation: mask-fade-in 0.4s ease;

        .mask-title {
            margin: 0 0 10px 0;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .mask-desc {
            margin: 0 0 24px 0;
            font-size: 14px;
            opacity: 0.92;
            line-height: 1.5;
        }

        .mask-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
    }

    @keyframes mask-fade-in {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .demo-virtual {
        height: 620px;
        // border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        overflow: hidden;
    }

    .virtual-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        transition: all 0.3s;
        margin-bottom: 16px;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(102, 126, 234, 0.3);
            transform: translateX(4px);
        }
    }

    .virtual-image {
        flex-shrink: 0;
        width: 280px;
    }

    .virtual-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-width: 0;

        .info-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;

            h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .info-meta {
            display: flex;
            gap: 20px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.5);

            span {
                display: flex;
                align-items: center;
                gap: 6px;

                .el-icon {
                    font-size: 14px;
                }
            }
        }
    }

    @media (max-width: 1024px) {
        .demo-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        }

        .demo-grid-error {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
    }

    @media (max-width: 768px) {
        .demo-actions {
            flex-direction: column;
            align-items: stretch;

            :deep(.el-radio-group) {
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            :deep(.el-radio-button) {
                width: 100%;
            }
        }

        .demo-grid,
        .demo-grid-error {
            grid-template-columns: 1fr;
            gap: 16px;
        }

        .virtual-item {
            flex-direction: column;
        }

        .virtual-image {
            width: 100%;
        }

        .demo-virtual {
            height: 600px;
        }
    }
</style>
