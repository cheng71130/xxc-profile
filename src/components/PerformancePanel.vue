<template>
    <!-- 只在开发环境渲染 -->
    <div v-if="isDev" class="perf-panel">
        <!-- 浮动按钮 -->
        <button
            class="toggle-btn"
            :class="{ active: visible }"
            :title="visible ? '关闭性能面板' : '打开性能面板'"
            @click="visible = !visible"
        >
            📊
        </button>

        <!-- 面板内容 -->
        <Transition name="slide">
            <div v-if="visible" class="panel">
                <!-- 头部 -->
                <div class="header">
                    <h3>⚡ 性能监控</h3>
                    <div class="actions">
                        <button @click="loadStats" title="刷新">🔄</button>
                        <button @click="handleExport" title="导出">📥</button>
                        <button @click="handleClear" title="清空">🗑️</button>
                    </div>
                </div>

                <!-- 指标卡片 -->
                <div v-if="Object.keys(stats).length > 0" class="metrics">
                    <div
                        v-for="(data, name) in stats"
                        :key="name"
                        class="metric-card"
                        :class="getRating(name, data.latest)"
                    >
                        <div class="metric-name">{{ name }}</div>
                        <div class="metric-value">{{ formatValue(name, data.latest) }}</div>
                        <div class="metric-desc">{{ metricNames[name] || name }}</div>
                        <div class="metric-avg">平均: {{ formatValue(name, data.avg) }}</div>
                    </div>
                </div>

                <!-- 暂无数据 -->
                <div v-else class="empty">
                    <p>📊 暂无性能数据</p>
                    <p>刷新页面后会自动收集</p>
                </div>

                <!-- 优化建议 -->
                <div class="tips">
                    <h4>💡 优化建议</h4>
                    <ul>
                        <li v-for="(tip, i) in suggestions" :key="i">{{ tip }}</li>
                    </ul>
                </div>

                <!-- 工具链接 -->
                <div class="tools">
                    <a href="https://pagespeed.web.dev/" target="_blank" class="tool-link"> PageSpeed Insights </a>
                    <a href="https://web.dev/articles/vitals" target="_blank" class="tool-link"> 了解 Web Vitals </a>
                </div>

                <!-- 底部 -->
                <div class="footer">
                    <span>2026 Edition</span>
                    <span>·</span>
                    <span>Web Vitals 4.x</span>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { clearStorage, getStats } from '@/utils/performance';

    /**
     * 开发环境性能监控面板
     */

    // 判断是否为开发环境
    const isDev = import.meta.env.DEV;

    const visible = ref(false);
    const stats = ref<Record<string, { avg: number; latest: number }>>({});

    onMounted(() => {
        if (isDev) {
            loadStats();

            // 每 2 秒更新一次
            setInterval(loadStats, 2000);
        }
    });

    /**
     * 加载统计数据
     */
    function loadStats() {
        stats.value = getStats();
    }

    /**
     * 获取评级
     */
    function getRating(name: string, value: number): 'good' | 'warning' | 'poor' {
        const thresholds: Record<string, [number, number]> = {
            LCP: [2500, 4000],
            INP: [200, 500],
            CLS: [0.1, 0.25],
            FCP: [1800, 3000],
            TTFB: [800, 1800],
        };

        const [good, poor] = thresholds[name] || [0, 0];

        if (value <= good) return 'good';
        if (value <= poor) return 'warning';
        return 'poor';
    }

    /**
     * 格式化数值
     */
    function formatValue(name: string, value: number): string {
        if (name === 'CLS') {
            return value.toFixed(4);
        }
        return `${value.toFixed(0)}ms`;
    }

    /**
     * 清空历史数据
     */
    function handleClear() {
        if (confirm('确定要清空历史数据吗？')) {
            clearStorage();
            stats.value = {};
        }
    }

    /**
     * 导出数据
     */
    function handleExport() {
        const data = getStats();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * 指标说明
     */
    const metricNames: Record<string, string> = {
        LCP: '最大内容绘制',
        INP: '交互响应时间',
        CLS: '累积布局偏移',
        FCP: '首次内容绘制',
        TTFB: '首字节时间',
    };

    /**
     * 优化建议
     */
    const suggestions = computed(() => {
        const tips: string[] = [];

        Object.entries(stats.value).forEach(([name, data]) => {
            const rating = getRating(name, data.latest);

            if (rating === 'poor') {
                if (name === 'LCP') {
                    tips.push('LCP 过慢：优化最大内容元素（图片/视频）加载');
                } else if (name === 'INP') {
                    tips.push('INP 过高：减少 JS 主线程阻塞，优化事件处理');
                } else if (name === 'CLS') {
                    tips.push('CLS 过高：为图片和内容预留固定空间');
                } else if (name === 'TTFB') {
                    tips.push('TTFB 过高：考虑使用 CDN 加速静态资源');
                }
            }
        });

        if (tips.length === 0) {
            tips.push('性能表现良好！继续保持 🎉');
        }

        return tips;
    });
</script>

<style scoped>
    .perf-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* 浮动按钮 */
    .toggle-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
    }

    .toggle-btn.active {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    /* 面板 */
    .panel {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 360px;
        /* max-height: 600px; */
        overflow-y: auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        padding: 20px;
    }

    /* 头部 */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid #f3f4f6;
    }

    .header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #111827;
    }

    .actions {
        display: flex;
        gap: 8px;
    }

    .actions button {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .actions button:hover {
        background: #f3f4f6;
    }

    /* 指标卡片 */
    .metrics {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
    }

    .metric-card {
        padding: 12px;
        border-radius: 12px;
        text-align: center;
        border: 2px solid;
        transition: transform 0.2s;
    }

    .metric-card:hover {
        transform: translateY(-2px);
    }

    .metric-card.good {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border-color: #10b981;
        color: #166534;
    }

    .metric-card.warning {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-color: #f59e0b;
        color: #92400e;
    }

    .metric-card.poor {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border-color: #ef4444;
        color: #991b1b;
    }

    .metric-name {
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 4px;
        opacity: 0.8;
    }

    .metric-value {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 4px;
    }

    .metric-desc {
        font-size: 10px;
        opacity: 0.7;
        margin-bottom: 4px;
    }

    .metric-avg {
        font-size: 10px;
        opacity: 0.6;
        /* font-style: italic; */
    }

    /* 空状态 */
    .empty {
        text-align: center;
        padding: 40px 20px;
        color: #6b7280;
    }

    .empty p {
        margin: 8px 0;
        font-size: 14px;
    }

    /* 优化建议 */
    .tips {
        padding: 16px;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border-radius: 12px;
        border-left: 4px solid #3b82f6;
        margin-bottom: 16px;
    }

    .tips h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #1e40af;
        font-weight: 600;
    }

    .tips ul {
        margin: 0;
        padding-left: 20px;
        font-size: 12px;
        color: #1e3a8a;
        line-height: 1.6;
    }

    .tips li {
        margin-bottom: 6px;
    }

    /* 工具链接 */
    .tools {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
    }

    .tool-link {
        flex: 1;
        padding: 10px;
        background: #f3f4f6;
        border-radius: 8px;
        text-decoration: none;
        color: #374151;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        transition: all 0.2s;
    }

    .tool-link:hover {
        background: #e5e7eb;
        color: #111827;
        transform: translateY(-1px);
    }

    /* 底部 */
    .footer {
        text-align: center;
        font-size: 11px;
        color: #9ca3af;
        padding-top: 12px;
        border-top: 1px solid #f3f4f6;
    }

    .footer span {
        margin: 0 4px;
    }

    /* 滚动条 */
    .panel::-webkit-scrollbar {
        width: 6px;
    }

    .panel::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
    }

    .panel::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }

    /* 动画 */
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide-enter-from,
    .slide-leave-to {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
</style>
