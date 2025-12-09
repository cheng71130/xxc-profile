<template>
    <div class="demo-container">
        <!-- 顶部操作栏 -->
        <div class="demo-header">
            <div class="header-title">
                <div class="title-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4 6h16M4 12h16M4 18h16"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
                <div class="title-text">
                    <h2>虚拟滚动列表</h2>
                    <span class="data-count">{{ totalCount.toLocaleString() }} 条数据</span>
                </div>
            </div>

            <div class="header-actions">
                <button class="action-btn" @click="scrollToTop">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 19V5M5 12l7-7 7 7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <span>顶部</span>
                </button>

                <button class="action-btn" @click="scrollToRandom">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M12 12l9-5M12 12v9.5M12 12L3 7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <span>随机</span>
                </button>

                <button class="action-btn" @click="scrollToBottom">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 5v14M5 12l7 7 7-7"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <span>底部</span>
                </button>

                <button class="action-btn primary" @click="addMoreData">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <span>追加1000条</span>
                </button>
            </div>
        </div>

        <!-- 信息面板 -->
        <div class="info-panel">
            <div class="info-item">
                <div class="info-label">可视范围</div>
                <div class="info-value">{{ visibleRange.start }} - {{ visibleRange.end }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">渲染项数</div>
                <div class="info-value">{{ visibleRange.end - visibleRange.start + 1 }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">滚动位置</div>
                <div class="info-value">{{ scrollPosition.toFixed(0) }}px</div>
            </div>
            <div class="info-item">
                <div class="info-label">数据状态</div>
                <div class="info-value">{{ listData.length > 0 ? '已加载' : '空' }}</div>
            </div>
        </div>

        <!-- 虚拟滚动列表 -->
        <div class="scroll-wrapper">
            <VirtualScroll
                ref="virtualScrollRef"
                :data-source="listData"
                :estimated-item-height="130"
                :buffer-size="5"
                :dynamic-height="true"
                item-key="id"
                @scroll="handleScroll"
                @visible-change="handleVisibleChange"
            >
                <template #default="{ item, index }">
                    <div class="list-item" :class="{ 'is-even': index % 2 === 0 }">
                        <div class="item-left">
                            <div class="item-avatar">
                                <div class="avatar-bg" :style="{ background: getAvatarColor(index) }">
                                    <span>{{ (index + 1).toString().padStart(4, '0') }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="item-content">
                            <div class="content-header">
                                <h3 class="item-title">{{ item.title }}</h3>
                                <div class="item-badge" v-if="index % 5 === 0">HOT</div>
                            </div>

                            <p class="item-description">{{ item.description }}</p>

                            <div class="item-footer">
                                <div class="footer-tags">
                                    <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
                                </div>
                                <div class="footer-meta">
                                    <span class="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                                            <path
                                                d="M12 6v6l4 2"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                        {{ item.createTime }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="item-right">
                            <button class="item-action" @click="handleItemAction(item)">
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
                        </div>
                    </div>
                </template>
            </VirtualScroll>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import VirtualScroll from '@/components/VirtualScroll/index.vue';

    interface ListItem {
        id: string;
        title: string;
        description: string;
        createTime: string;
        tags: string[];
    }

    // 定义组件暴露的类型
    interface VirtualScrollExpose {
        scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
        scrollToTop: (behavior?: ScrollBehavior) => void;
        scrollToBottom: (behavior?: ScrollBehavior) => void;
        getVisibleRange: () => { start: number; end: number };
    }

    // 生成模拟数据
    const generateData = (start: number, count: number): ListItem[] => {
        const tagPool = ['Vue3', 'TypeScript', 'React', 'Angular', 'Svelte', 'Node.js', 'Vite', 'Webpack'];

        return Array.from({ length: count }, (_, i) => {
            const index = start + i;
            const randomTags = tagPool.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);

            return {
                id: `item-${index}`,
                title: `${['极致性能', '高效开发', '完美体验', '创新设计'][index % 4]} - 列表项 ${index}`,
                description: `这是第 ${index} 条数据的详细描述信息。${
                    index % 3 === 0 ? '此条目包含更丰富的内容，用于验证动态高度计算的准确性和流畅性。' : ''
                }${index % 5 === 0 ? '支持不同长度的文本内容，组件会自动适配并优化渲染性能。' : ''}`,
                createTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                tags: randomTags,
            };
        });
    };

    const listData = ref<ListItem[]>([]);
    const totalCount = computed(() => listData.value.length);

    const virtualScrollRef = ref<VirtualScrollExpose>();
    const visibleRange = ref({ start: 0, end: 0 });
    const scrollPosition = ref(0);

    // 组件挂载后初始化数据
    onMounted(() => {
        console.log('Demo组件已挂载，开始生成数据...');
        listData.value = generateData(0, 1000);
        console.log('数据生成完成，共', listData.value.length, '条');
    });

    // 滚动事件
    const handleScroll = ({ scrollTop, isBottom }: { scrollTop: number; isBottom: boolean }) => {
        scrollPosition.value = scrollTop;
        if (isBottom) {
            console.log('🎯 到达底部，可触发懒加载');
        }
    };

    // 可视区域变化
    const handleVisibleChange = ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
        visibleRange.value = { start: startIndex, end: endIndex };
    };

    // 获取头像颜色
    const getAvatarColor = (index: number): string => {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        ];
        return colors[index % colors.length];
    };

    // 操作方法
    const scrollToTop = () => {
        virtualScrollRef.value?.scrollToTop();
    };

    const scrollToBottom = () => {
        virtualScrollRef.value?.scrollToBottom();
    };

    const scrollToRandom = () => {
        const randomIndex = Math.floor(Math.random() * listData.value.length);
        virtualScrollRef.value?.scrollToIndex(randomIndex);
    };

    const addMoreData = () => {
        const currentLength = listData.value.length;
        listData.value = [...listData.value, ...generateData(currentLength, 1000)];
    };

    const handleItemAction = (item: ListItem) => {
        console.log('点击项目:', item);
    };
</script>

<style scoped lang="scss">
    .demo-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 0;
        border-radius: 1.25rem;
        overflow: hidden;
    }

    // ===== 顶部操作栏 =====
    .demo-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 32px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        gap: 24px;
        flex-wrap: wrap;
        flex-shrink: 0;
    }

    .header-title {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .title-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);

        svg {
            width: 24px;
            height: 24px;
        }
    }

    .title-text {
        h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }

        .data-count {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.4);
            font-weight: 500;
        }
    }

    .header-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        svg {
            width: 18px;
            height: 18px;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        &:active {
            transform: translateY(0);
        }

        &.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: transparent;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

            &:hover {
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                transform: translateY(-2px);
            }
        }
    }

    // ===== 信息面板 =====
    .info-panel {
        display: flex;
        gap: 16px;
        padding: 16px 32px;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        flex-shrink: 0;
    }

    .info-item {
        flex: 1;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        backdrop-filter: blur(10px);
    }

    .info-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 4px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .info-value {
        font-size: 16px;
        color: #ffffff;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    // ===== 滚动容器 =====
    .scroll-wrapper {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        position: relative;
    }

    // ===== 列表项 =====
    .list-item {
        display: flex;
        gap: 20px;
        padding: 20px 32px;
        background: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 3px;
            height: 0;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateX(4px);

            &::before {
                height: 100%;
            }
        }

        &.is-even {
            background: rgba(255, 255, 255, 0.01);
        }
    }

    // 左侧头像
    .item-left {
        flex-shrink: 0;
    }

    .item-avatar {
        width: 72px;
        height: 72px;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .avatar-bg {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 1px;
    }

    // 中间内容
    .item-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .content-header {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .item-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        letter-spacing: -0.3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .item-badge {
        flex-shrink: 0;
        padding: 4px 10px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
    }

    .item-description {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.6);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .item-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
    }

    .footer-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tag {
        padding: 4px 12px;
        background: rgba(102, 126, 234, 0.15);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 6px;
        font-size: 12px;
        color: rgba(102, 126, 234, 1);
        font-weight: 500;
        transition: all 0.2s;

        &:hover {
            background: rgba(102, 126, 234, 0.25);
            border-color: rgba(102, 126, 234, 0.5);
        }
    }

    .footer-meta {
        display: flex;
        gap: 16px;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.4);
        font-variant-numeric: tabular-nums;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    // 右侧操作
    .item-right {
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    .item-action {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        svg {
            width: 20px;
            height: 20px;
        }

        &:hover {
            background: rgba(102, 126, 234, 0.2);
            border-color: rgba(102, 126, 234, 0.4);
            color: #667eea;
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    // 响应式
    @media (max-width: 768px) {
        .demo-header {
            padding: 16px 20px;
        }

        .header-actions {
            width: 100%;
        }

        .action-btn {
            flex: 1;
            justify-content: center;
            min-width: 0;

            span {
                display: none;
            }
        }

        .info-panel {
            padding: 12px 20px;
            flex-wrap: wrap;
        }

        .list-item {
            padding: 16px 20px;
            gap: 12px;
        }

        .item-avatar {
            width: 56px;
            height: 56px;
        }

        .item-title {
            font-size: 16px;
        }

        .item-action {
            width: 36px;
            height: 36px;
        }
    }
</style>
