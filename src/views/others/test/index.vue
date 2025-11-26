<template>
    <div class="page">
        <div class="header">
            <h2>无限滚动列表</h2>
            <span>已加载: {{ list.length }} 条</span>
        </div>

        <div class="scroll-wrapper">
            <VirtualScroll
                :data-source="list"
                :estimated-item-height="90"
                item-key="id"
                @scroll="handleScroll"
                class="scroll-container"
            >
                <template #default="{ item, index }">
                    <div class="list-item">
                        <div class="item-index">#{{ index + 1 }}</div>
                        <div class="item-content">
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.description }}</p>
                        </div>
                    </div>
                </template>
            </VirtualScroll>

            <transition name="fade">
                <div class="list-footer" v-if="showFooter">
                    <div v-if="loading" class="footer-loading">
                        <span class="loading-spinner"></span>
                        <span>加载中...</span>
                    </div>
                    <div v-else-if="error" class="footer-error">
                        <span>加载失败</span>
                        <button @click="loadMore" class="retry-btn">重试</button>
                    </div>
                    <div v-else-if="noMore" class="footer-end">
                        <span>没有更多了</span>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import VirtualScroll from '@/views/components/virtualScroll/VirtualScroll.vue';

    interface ListItem {
        id: string;
        name: string;
        description: string;
    }

    const list = ref<ListItem[]>([]);
    const loading = ref(false);
    const error = ref(false);
    const noMore = ref(false);
    const page = ref(1);
    const pageSize = 20;
    const totalPages = 5;

    const lastScrollTop = ref(0);
    const isScrollingDown = ref(true);

    const showFooter = computed(() => loading.value || error.value || noMore.value);

    let hideTimer: any = null;
    watch(noMore, (val) => {
        if (val) {
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                noMore.value = false;
            }, 3000);
        }
    });

    const generateData = (pageNum: number): ListItem[] => {
        return Array.from({ length: pageSize }, (_, i) => {
            const id = (pageNum - 1) * pageSize + i + 1;
            return {
                id: `${id}`,
                name: `数据项 ${id}`,
                description: `这是第 ${id} 条数据的描述信息`,
            };
        });
    };

    const fetchData = (pageNum: number): Promise<ListItem[]> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.05) {
                    reject(new Error('加载失败'));
                    return;
                }

                if (pageNum > totalPages) {
                    resolve([]);
                    return;
                }

                resolve(generateData(pageNum));
            }, 1000);
        });
    };

    const loadMore = async () => {
        if (loading.value || noMore.value) return;

        console.log('📥 加载第', page.value, '页');
        loading.value = true;
        error.value = false;

        try {
            const newData = await fetchData(page.value);

            if (newData.length === 0) {
                noMore.value = true;
                console.log('✅ 没有更多数据');
            } else {
                list.value = [...list.value, ...newData];
                page.value++;
                console.log('✅ 加载成功，总数:', list.value.length);
            }
        } catch (err) {
            error.value = true;
            console.error('❌ 加载失败:', err);
        } finally {
            loading.value = false;
        }
    };

    const handleScroll = ({ scrollTop, isBottom }: { scrollTop: number; isBottom: boolean }) => {
        isScrollingDown.value = scrollTop > lastScrollTop.value;
        lastScrollTop.value = scrollTop;

        if (!isScrollingDown.value) {
            return;
        } else if (isBottom && isScrollingDown.value) {
            loadMore();
        }
    };

    loadMore();
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        background: rgba(30, 30, 46, 0.95);
        border-radius: 12px;
        margin-bottom: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #e0e0e0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .header span {
        font-size: 14px;
        color: #b0b0b0;
        background: rgba(102, 126, 234, 0.15);
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid rgba(102, 126, 234, 0.3);
    }

    .scroll-wrapper {
        flex: 1;
        position: relative;
        background: rgba(30, 30, 46, 0.95);
        border-radius: 12px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .scroll-container {
        width: 100%;
        height: 100%;
    }

    .list-item {
        display: flex;
        gap: 16px;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
    }

    .list-item:hover {
        background: linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, rgba(30, 30, 46, 0) 100%);
        transform: translateX(4px);
        border-left: 2px solid rgba(102, 126, 234, 0.5);
    }

    .item-index {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
        font-size: 16px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .item-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .item-content h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #e0e0e0;
    }

    .item-content p {
        margin: 0;
        color: #9ca3af;
        font-size: 14px;
        line-height: 1.5;
    }

    .list-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        text-align: center;
        background: rgba(26, 26, 46, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        z-index: 10;
        pointer-events: none;
    }

    .list-footer > div {
        pointer-events: auto;
    }

    .footer-loading,
    .footer-error,
    .footer-end {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #e0e0e0;
        font-size: 14px;
        padding: 10px 20px;
        background: rgba(30, 30, 46, 0.9);
        border-radius: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(102, 126, 234, 0.3);
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .retry-btn {
        padding: 6px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
    }

    .retry-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.6);
    }

    .retry-btn:active {
        transform: translateY(0);
    }

    .footer-end {
        color: #9ca3af;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
