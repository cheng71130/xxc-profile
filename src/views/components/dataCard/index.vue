<template>
    <div class="cards-grid">
        <!-- 卡片1: 总收入 -->
        <div class="stat-card">
            <div class="card-header">
                <div class="icon-box revenue">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <div class="card-info">
                    <h3 class="card-title">总收入</h3>
                    <p class="card-subtitle">本月统计</p>
                </div>
            </div>
            <div class="card-body">
                <div class="metric-value">¥{{ formatNumber(stats.revenue.value) }}</div>
                <div class="metric-change" :class="stats.revenue.trend">
                    <svg
                        v-if="stats.revenue.trend === 'up'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                    <span>{{ stats.revenue.change > 0 ? '+' : '' }}{{ stats.revenue.change }}% 环比上月</span>
                </div>
            </div>
            <div class="chart-container">
                <svg class="mini-chart" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 0.3" />
                            <stop offset="100%" style="stop-color: #3b82f6; stop-opacity: 0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0 45 L 33 50 L 66 30 L 100 35 L 133 20 L 166 25 L 200 10 L 200 60 L 0 60 Z"
                        fill="url(#gradient1)"
                    />
                    <path
                        d="M 0 45 L 33 50 L 66 30 L 100 35 L 133 20 L 166 25 L 200 10"
                        fill="none"
                        stroke="#3b82f6"
                        stroke-width="2"
                    />
                </svg>
            </div>
        </div>

        <!-- 卡片2: 用户增长 -->
        <div class="stat-card">
            <div class="card-header">
                <div class="icon-box users">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
                <div class="card-info">
                    <h3 class="card-title">活跃用户</h3>
                    <p class="card-subtitle">本周数据</p>
                </div>
            </div>
            <div class="card-body">
                <div class="metric-value">{{ formatNumber(stats.users.value) }}</div>
                <div class="metric-change" :class="stats.users.trend">
                    <svg
                        v-if="stats.users.trend === 'up'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                    <span>{{ stats.users.change > 0 ? '+' : '' }}{{ stats.users.change }}% 较上周</span>
                </div>
            </div>
            <div class="chart-container">
                <svg class="mini-chart" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color: #10b981; stop-opacity: 0.3" />
                            <stop offset="100%" style="stop-color: #10b981; stop-opacity: 0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0 50 L 33 45 L 66 40 L 100 30 L 133 35 L 166 20 L 200 15 L 200 60 L 0 60 Z"
                        fill="url(#gradient2)"
                    />
                    <path
                        d="M 0 50 L 33 45 L 66 40 L 100 30 L 133 35 L 166 20 L 200 15"
                        fill="none"
                        stroke="#10b981"
                        stroke-width="2"
                    />
                </svg>
            </div>
        </div>

        <!-- 卡片3: 订单数量 -->
        <div class="stat-card">
            <div class="card-header">
                <div class="icon-box orders">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <div class="card-info">
                    <h3 class="card-title">订单总数</h3>
                    <p class="card-subtitle">今日实时</p>
                </div>
            </div>
            <div class="card-body">
                <div class="metric-value">{{ formatNumber(stats.orders.value) }}</div>
                <div class="metric-change" :class="stats.orders.trend">
                    <svg
                        v-if="stats.orders.trend === 'up'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                    <span>{{ stats.orders.change > 0 ? '+' : '' }}{{ stats.orders.change }}% 较昨日</span>
                </div>
            </div>
            <div class="chart-container bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 75%"></div>
                <div class="bar" style="height: 55%"></div>
                <div class="bar" style="height: 85%"></div>
                <div class="bar" style="height: 65%"></div>
                <div class="bar" style="height: 70%"></div>
                <div class="bar" style="height: 50%"></div>
            </div>
        </div>

        <!-- 卡片4: 转化率 -->
        <div class="stat-card">
            <div class="card-header">
                <div class="icon-box conversion">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                </div>
                <div class="card-info">
                    <h3 class="card-title">转化率</h3>
                    <p class="card-subtitle">本月平均</p>
                </div>
            </div>
            <div class="card-body">
                <div class="metric-value">{{ stats.conversion.value }}%</div>
                <div class="metric-change" :class="stats.conversion.trend">
                    <svg
                        v-if="stats.conversion.trend === 'up'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                    <span>{{ stats.conversion.change > 0 ? '+' : '' }}{{ stats.conversion.change }}% 环比上月</span>
                </div>
            </div>
            <div class="chart-container progress-container">
                <div class="progress-ring">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" class="progress-bg" />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            class="progress-fill"
                            :style="{ strokeDashoffset: progressOffset }"
                        />
                    </svg>
                    <div class="progress-text">{{ Math.round(stats.conversion.value) }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';

    // 响应式数据
    const stats = ref({
        revenue: { value: 128450, change: 12.5, trend: 'up' as 'up' | 'down' },
        users: { value: 8542, change: 8.2, trend: 'up' as 'up' | 'down' },
        orders: { value: 1834, change: -3.1, trend: 'down' as 'up' | 'down' },
        conversion: { value: 68.4, change: 5.3, trend: 'up' as 'up' | 'down' },
    });

    // 格式化数字
    const formatNumber = (num: number): string => {
        return num.toLocaleString('zh-CN');
    };

    // 计算环形进度条的偏移量
    const progressOffset = computed(() => {
        const percentage = stats.value.conversion.value;
        const circumference = 2 * Math.PI * 40; // 2πr，r=40
        return circumference - (percentage / 100) * circumference;
    });

    // 模拟数据更新
    const updateStats = () => {
        setInterval(() => {
            // 随机更新数据（可以替换为实际的 API 调用）
            stats.value.revenue.value += Math.floor(Math.random() * 1000 - 500);
            stats.value.users.value += Math.floor(Math.random() * 100 - 50);
            stats.value.orders.value += Math.floor(Math.random() * 20 - 10);

            // 随机更新趋势
            stats.value.revenue.change = Number((Math.random() * 20 - 5).toFixed(1));
            stats.value.revenue.trend = stats.value.revenue.change >= 0 ? 'up' : 'down';

            stats.value.users.change = Number((Math.random() * 15 - 5).toFixed(1));
            stats.value.users.trend = stats.value.users.change >= 0 ? 'up' : 'down';

            stats.value.orders.change = Number((Math.random() * 10 - 5).toFixed(1));
            stats.value.orders.trend = stats.value.orders.change >= 0 ? 'up' : 'down';

            stats.value.conversion.change = Number((Math.random() * 10 - 3).toFixed(1));
            stats.value.conversion.trend = stats.value.conversion.change >= 0 ? 'up' : 'down';
        }, 5000); // 每5秒更新一次
    };

    onMounted(() => {
        console.log('数据卡片组件已加载');
        // updateStats() // 取消注释以启用自动更新
    });

    // 暴露方法供父组件调用
    defineExpose({
        updateData: (newStats: typeof stats.value) => {
            stats.value = newStats;
        },
    });
</script>

<style scoped lang="scss">
    .cards-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        height: fit-content;
    }

    .stat-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
        border-radius: 1rem;
        padding: 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.1);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        &:hover {
            transform: translateY(-4px);
            border-color: rgba(148, 163, 184, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

            &::before {
                opacity: 1;
            }
        }
    }

    .card-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .icon-box {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.3s ease;

        .stat-card:hover & {
            transform: scale(1.1);
        }

        &.revenue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
            color: #3b82f6;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        &.users {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
            color: #10b981;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        &.orders {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%);
            color: #f59e0b;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }

        &.conversion {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
            color: #8b5cf6;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
    }

    .card-info {
        flex: 1;
    }

    .card-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #e2e8f0;
        margin: 0 0 0.25rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .card-subtitle {
        font-size: 0.75rem;
        color: #64748b;
        margin: 0;
    }

    .card-body {
        margin-bottom: 1.5rem;
    }

    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #f8fafc;
        margin-bottom: 0.5rem;
        line-height: 1;
        background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .metric-change {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;

        svg {
            flex-shrink: 0;
        }

        &.up {
            color: #10b981;

            svg {
                stroke: #10b981;
            }
        }

        &.down {
            color: #ef4444;

            svg {
                stroke: #ef4444;
            }
        }
    }

    .chart-container {
        position: relative;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.bars {
            align-items: flex-end;
            gap: 6px;
            padding: 10px 0;
        }

        &.progress-container {
            height: 120px;
        }
    }

    .mini-chart {
        width: 100%;
        height: 80px;
        opacity: 0.9;
    }

    .bar {
        flex: 1;
        background: linear-gradient(to top, rgba(245, 158, 11, 0.6), rgba(245, 158, 11, 0.2));
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;
        min-height: 20%;

        .stat-card:hover & {
            background: linear-gradient(to top, rgba(245, 158, 11, 0.8), rgba(245, 158, 11, 0.3));
        }
    }

    .progress-ring {
        position: relative;
        width: 90px;
        height: 90px;

        svg {
            transform: rotate(-90deg);
            width: 100%;
            height: 100%;
        }

        circle {
            fill: none;
            stroke-width: 8;
        }

        .progress-bg {
            stroke: rgba(148, 163, 184, 0.1);
        }

        .progress-fill {
            stroke: #8b5cf6;
            stroke-dasharray: 251.2;
            transition: stroke-dashoffset 1s ease;
            stroke-linecap: round;
            filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
        }

        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.35rem;
            font-weight: 700;
            color: #8b5cf6;
        }
    }

    // 响应式设计
    @media (max-width: 1200px) {
        .cards-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .cards-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .metric-value {
            font-size: 1.75rem;
        }
    }

    // 动画效果
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .stat-card {
        animation: fadeInUp 0.6s ease forwards;

        @for $i from 1 through 4 {
            &:nth-child(#{$i}) {
                animation-delay: #{$i * 0.1}s;
                opacity: 0;
            }
        }
    }
</style>
