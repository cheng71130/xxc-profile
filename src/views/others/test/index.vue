<template>
    <div class="dashboard-container">
        <!-- 精致背景层 -->
        <div class="bg-layer">
            <!-- 渐变基底 -->
            <div class="gradient-base"></div>

            <!-- 流动粒子 -->
            <div class="particles-flow">
                <div v-for="i in 40" :key="i" class="particle" :style="getParticleStyle(i)"></div>
            </div>

            <!-- 光束装饰 -->
            <div class="light-beams">
                <div class="beam beam-1"></div>
                <div class="beam beam-2"></div>
                <div class="beam beam-3"></div>
            </div>

            <!-- 网格装饰 -->
            <div class="grid-decoration"></div>
        </div>

        <!-- 顶部标题区 -->
        <header class="page-header">
            <div class="header-content">
                <div class="title-left">
                    <div class="accent-line"></div>
                </div>
                <div class="title-center">
                    <h1 class="main-title">智能数据驾驶舱</h1>
                    <p class="sub-title">INTELLIGENT DATA COCKPIT SYSTEM</p>
                </div>
                <div class="title-right">
                    <div class="time-display">
                        <div class="time-value">{{ currentTime }}</div>
                        <div class="date-value">{{ currentDate }}</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主体内容 -->
        <div class="main-content">
            <!-- 左侧 -->
            <div class="panel-column left">
                <!-- 数据概览 -->
                <div class="panel-box overview-panel">
                    <div class="panel-header">
                        <div class="header-glow"></div>
                        <span class="header-text">数据概览</span>
                    </div>
                    <div class="overview-grid">
                        <div v-for="(item, idx) in overviewData" :key="idx" class="overview-card">
                            <div class="card-bg"></div>
                            <div class="card-icon">{{ item.icon }}</div>
                            <div class="card-info">
                                <div class="card-value">{{ item.value.toLocaleString() }}</div>
                                <div class="card-label">{{ item.label }}</div>
                            </div>
                            <div class="card-trend" :class="item.trend">
                                <span>{{ item.trend === 'up' ? '↑' : '↓' }}</span>
                                {{ item.change }}%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 趋势图表 -->
                <div class="panel-box chart-panel">
                    <div class="panel-header">
                        <div class="header-glow"></div>
                        <span class="header-text">营收趋势</span>
                    </div>
                    <div class="chart-wrapper" ref="chart1Ref"></div>
                </div>
            </div>

            <!-- 中间 -->
            <div class="panel-column center">
                <!-- 地图 -->
                <div class="panel-box map-panel">
                    <div class="panel-header">
                        <div class="header-glow"></div>
                        <span class="header-text">全国业务分布</span>
                    </div>
                    <div class="map-wrapper">
                        <div class="map-bg">
                            <!-- 网格背景 -->
                            <div class="map-grid"></div>

                            <!-- 连接线 -->
                            <svg class="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style="stop-color: #667eea; stop-opacity: 0" />
                                        <stop offset="50%" style="stop-color: #667eea; stop-opacity: 0.6" />
                                        <stop offset="100%" style="stop-color: #667eea; stop-opacity: 0" />
                                    </linearGradient>
                                </defs>
                                <line x1="58" y1="20" x2="70" y2="40" stroke="url(#lineGradient)" stroke-width="0.15" />
                                <line x1="70" y1="40" x2="62" y2="70" stroke="url(#lineGradient)" stroke-width="0.15" />
                                <line x1="62" y1="70" x2="42" y2="48" stroke="url(#lineGradient)" stroke-width="0.15" />
                                <line x1="42" y1="48" x2="68" y2="44" stroke="url(#lineGradient)" stroke-width="0.15" />
                            </svg>

                            <!-- 城市点位 -->
                            <div
                                v-for="(point, idx) in mapPoints"
                                :key="idx"
                                class="map-point"
                                :style="{ left: point.x + '%', top: point.y + '%' }"
                            >
                                <div class="point-ripple"></div>
                                <div class="point-ripple" style="animation-delay: 0.5s"></div>
                                <div class="point-core"></div>
                                <div class="point-label">
                                    <div class="label-name">{{ point.name }}</div>
                                    <div class="label-value">{{ point.value }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 实时数据 -->
                <div class="panel-box realtime-panel">
                    <div class="panel-header">
                        <div class="header-glow"></div>
                        <span class="header-text">实时监控</span>
                    </div>
                    <div class="realtime-grid">
                        <div v-for="(item, idx) in realtimeData" :key="idx" class="realtime-item">
                            <div class="item-icon">{{ item.icon }}</div>
                            <div class="item-info">
                                <div class="item-value">{{ item.value }}</div>
                                <div class="item-label">{{ item.label }}</div>
                            </div>
                            <div class="item-bar">
                                <div class="bar-fill" :style="{ width: item.percent + '%' }">
                                    <div class="bar-light"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧 -->
            <div class="panel-column right">
                <!-- 排行榜 -->
                <div class="panel-box ranking-panel">
                    <div class="panel-header">
                        <div class="header-glow"></div>
                        <span class="header-text">销售排行</span>
                    </div>
                    <div class="ranking-list">
                        <div v-for="(item, idx) in rankingData" :key="idx" class="rank-item">
                            <div class="rank-num" :class="'rank-' + (idx + 1)">
                                {{ idx + 1 }}
                            </div>
                            <div class="rank-content">
                                <div class="rank-name">{{ item.name }}</div>
                                <div class="rank-bar">
                                    <div class="bar-track">
                                        <div class="bar-progress" :style="{ width: item.percent + '%' }">
                                            <div class="bar-shine"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rank-value">{{ item.value }}</div>
                        </div>
                    </div>
                </div>

                <!-- 占比图表 -->
                <div class="panel-box chart-panel">
                    <div class="panel-header">
                        <div class="header-glow"></div>
                        <span class="header-text">产品占比</span>
                    </div>
                    <div class="chart-wrapper" ref="chart2Ref"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import * as echarts from 'echarts';

    const currentTime = ref('');
    const currentDate = ref('');

    const updateTime = () => {
        const now = new Date();
        currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        currentDate.value = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
        });
    };

    // 粒子样式
    const getParticleStyle = (i: number) => {
        const size = Math.random() * 4 + 2;
        return {
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            width: size + 'px',
            height: size + 'px',
            animationDelay: Math.random() * 20 + 's',
            animationDuration: Math.random() * 30 + 20 + 's',
        };
    };

    // 数据概览
    const overviewData = ref([
        { icon: '💰', label: '总营收', value: 8956234, trend: 'up', change: 18.5 },
        { icon: '📦', label: '订单数', value: 45678, trend: 'up', change: 12.3 },
        { icon: '👥', label: '用户数', value: 123456, trend: 'up', change: 25.8 },
        { icon: '⚡', label: '转化率', value: 78.5, trend: 'down', change: 3.2 },
    ]);

    // 地图点位
    const mapPoints = ref([
        { name: '北京', value: '¥2.8M', x: 58, y: 20 },
        { name: '上海', value: '¥3.5M', x: 70, y: 40 },
        { name: '深圳', value: '¥3.2M', x: 62, y: 70 },
        { name: '成都', value: '¥1.9M', x: 42, y: 48 },
        { name: '杭州', value: '¥2.3M', x: 68, y: 44 },
    ]);

    // 实时数据
    const realtimeData = ref([
        { icon: '🚀', label: 'API请求', value: '1.2K/s', percent: 85 },
        { icon: '💾', label: '数据量', value: '3.8TB', percent: 72 },
        { icon: '🔄', label: '同步率', value: '99.9%', percent: 99 },
        { icon: '🛡️', label: '安全级', value: 'S级', percent: 100 },
    ]);

    // 排行榜
    const rankingData = ref([
        { name: '华东区域', value: '¥3.2M', percent: 95 },
        { name: '华南区域', value: '¥2.8M', percent: 88 },
        { name: '华北区域', value: '¥2.4M', percent: 76 },
        { name: '西南区域', value: '¥1.9M', percent: 65 },
        { name: '华中区域', value: '¥1.6M', percent: 55 },
        { name: '东北区域', value: '¥1.3M', percent: 48 },
        { name: '西北区域', value: '¥1.0M', percent: 38 },
    ]);

    const chart1Ref = ref<HTMLElement>();
    const chart2Ref = ref<HTMLElement>();
    let charts: echarts.ECharts[] = [];
    let timer: number;

    // 趋势图
    const initChart1 = () => {
        if (!chart1Ref.value) return;
        const chart = echarts.init(chart1Ref.value);
        charts.push(chart);

        chart.setOption({
            grid: {
                left: '8%',
                right: '5%',
                top: '12%',
                bottom: '12%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: '#667eea',
                borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 14 },
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(102, 126, 234, 0.5)',
                    },
                },
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
                axisLine: {
                    show: true,
                    lineStyle: { color: 'rgba(102, 126, 234, 0.2)' },
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 12,
                    fontStyle: 'italic',
                    margin: 12,
                },
                axisTick: { show: false },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        type: 'dashed',
                    },
                },
                axisLine: { show: false },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 12,
                    fontStyle: 'italic',
                    margin: 12,
                },
                axisTick: { show: false },
            },
            series: [
                {
                    data: [820, 932, 901, 1290, 1330, 1520, 1680, 1890],
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 4,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#667eea' },
                            { offset: 1, color: '#f093fb' },
                        ]),
                        shadowColor: 'rgba(102, 126, 234, 0.5)',
                        shadowBlur: 15,
                        shadowOffsetY: 5,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
                            { offset: 1, color: 'rgba(102, 126, 234, 0.05)' },
                        ]),
                    },
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#667eea',
                        borderWidth: 3,
                        shadowColor: 'rgba(102, 126, 234, 1)',
                        shadowBlur: 10,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(102, 126, 234, 1)',
                        },
                    },
                },
            ],
        });
    };

    // 饼图
    const initChart2 = () => {
        if (!chart2Ref.value) return;
        const chart = echarts.init(chart2Ref.value);
        charts.push(chart);

        chart.setOption({
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                borderColor: '#667eea',
                borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 14 },
                formatter: '{b}<br/>{c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: '8%',
                top: 'center',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 13,
                    fontStyle: 'italic',
                },
                itemGap: 15,
                itemWidth: 20,
                itemHeight: 14,
            },
            series: [
                {
                    type: 'pie',
                    radius: ['45%', '70%'],
                    center: ['35%', '50%'],
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: 'rgba(0, 0, 0, 0.3)',
                        borderWidth: 3,
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    label: {
                        show: true,
                        formatter: '{b}\n{d}%',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 12,
                        fontStyle: 'italic',
                        lineHeight: 18,
                    },
                    labelLine: {
                        lineStyle: { color: 'rgba(255, 255, 255, 0.3)' },
                        length: 15,
                        length2: 10,
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 10,
                        itemStyle: {
                            shadowBlur: 30,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.8)',
                        },
                    },
                    data: [
                        {
                            value: 1048,
                            name: '产品A',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#667eea' },
                                    { offset: 1, color: '#764ba2' },
                                ]),
                            },
                        },
                        {
                            value: 735,
                            name: '产品B',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#f093fb' },
                                    { offset: 1, color: '#f5576c' },
                                ]),
                            },
                        },
                        {
                            value: 580,
                            name: '产品C',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#4facfe' },
                                    { offset: 1, color: '#00f2fe' },
                                ]),
                            },
                        },
                        {
                            value: 484,
                            name: '产品D',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#43e97b' },
                                    { offset: 1, color: '#38f9d7' },
                                ]),
                            },
                        },
                    ],
                },
            ],
        });
    };

    const initCharts = () => {
        setTimeout(() => {
            initChart1();
            initChart2();
        }, 100);
    };

    const handleResize = () => {
        charts.forEach((chart) => chart.resize());
    };

    onMounted(() => {
        updateTime();
        timer = window.setInterval(updateTime, 1000);
        initCharts();
        window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
        clearInterval(timer);
        charts.forEach((chart) => chart.dispose());
        window.removeEventListener('resize', handleResize);
    });
</script>

<style scoped lang="scss">
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .dashboard-container {
        width: 100vw;
        height: 100vh;
        background: #030712;
        overflow: hidden;
        position: relative;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }

    // ===== 背景层 =====
    .bg-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .gradient-base {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 20% 10%, rgba(102, 126, 234, 0.15), transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(240, 147, 251, 0.12), transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.08), transparent 60%);
    }

    .particles-flow {
        position: absolute;
        inset: 0;
        overflow: hidden;
    }

    .particle {
        position: absolute;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.8), transparent);
        border-radius: 50%;
        animation: particleFloat linear infinite;
        opacity: 0.6;
    }

    @keyframes particleFloat {
        0% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            transform: translate(-100px, -100vh);
            opacity: 0;
        }
    }

    .light-beams {
        position: absolute;
        inset: 0;
        overflow: hidden;
    }

    .beam {
        position: absolute;
        width: 1px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.4), transparent);
        animation: beamMove 8s ease-in-out infinite;
    }

    .beam-1 {
        left: 20%;
        animation-delay: 0s;
    }

    .beam-2 {
        left: 50%;
        animation-delay: 2.6s;
    }

    .beam-3 {
        left: 80%;
        animation-delay: 5.2s;
    }

    @keyframes beamMove {
        0%,
        100% {
            transform: translateY(-100%);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
    }

    .grid-decoration {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
        background-size: 100px 100px;
    }

    // ===== 标题区 =====
    .page-header {
        position: relative;
        z-index: 10;
        padding: 25px 50px;
    }

    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .title-left {
        flex: 1;

        .accent-line {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #667eea, transparent);
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.8);
        }
    }

    .title-center {
        text-align: center;
        padding: 0 40px;
    }

    .main-title {
        font-size: 42px;
        font-weight: 800;
        font-style: italic;
        background: linear-gradient(135deg, #667eea, #f093fb, #43e97b);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 8px;
        text-transform: uppercase;
        animation: gradientShift 5s linear infinite;
        margin-bottom: 6px;
        text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
        filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.3));
    }

    .sub-title {
        font-size: 11px;
        font-style: italic;
        color: rgba(255, 255, 255, 0.4);
        letter-spacing: 6px;
        font-weight: 300;
    }

    @keyframes gradientShift {
        to {
            background-position: 200% center;
        }
    }

    .title-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }

    .time-display {
        text-align: right;

        .time-value {
            font-size: 24px;
            font-weight: 700;
            font-style: italic;
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #667eea, #f093fb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 2px;
            margin-bottom: 3px;
        }

        .date-value {
            font-size: 11px;
            font-style: italic;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 1px;
        }
    }

    // ===== 主体内容 =====
    .main-content {
        position: relative;
        z-index: 1;
        display: flex;
        gap: 20px;
        padding: 0 50px 40px;
        height: calc(100vh - 120px);
    }

    .panel-column {
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 0;

        &.left,
        &.right {
            flex: 1;
        }

        &.center {
            flex: 1.6;
        }
    }

    // ===== 面板盒子 =====
    .panel-box {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.3));
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 25px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);

        // 微弱内发光
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), transparent);
            pointer-events: none;
        }
    }

    // 面板标题
    .panel-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 25px;
        position: relative;
        z-index: 1;
    }

    .header-glow {
        width: 4px;
        height: 20px;
        background: linear-gradient(180deg, #667eea, #f093fb);
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.8), 0 0 20px rgba(102, 126, 234, 0.4);
    }

    .header-text {
        font-size: 18px;
        font-weight: 600;
        font-style: italic;
        color: rgba(255, 255, 255, 0.95);
        letter-spacing: 3px;
        text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }

    // ===== 数据概览 =====
    .overview-panel {
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            position: relative;
            z-index: 1;
        }
    }

    .overview-card {
        position: relative;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(240, 147, 251, 0.05));
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: hidden;
    }

    .card-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 100% 0%, rgba(102, 126, 234, 0.15), transparent 70%);
    }

    .card-icon {
        font-size: 36px;
        filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.6));
        position: relative;
        z-index: 1;
    }

    .card-info {
        position: relative;
        z-index: 1;

        .card-value {
            font-size: 30px;
            font-weight: 800;
            font-style: italic;
            background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.7));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 6px;
            letter-spacing: 1px;
        }

        .card-label {
            font-size: 13px;
            font-style: italic;
            color: rgba(255, 255, 255, 0.6);
            letter-spacing: 1px;
        }
    }

    .card-trend {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        font-style: italic;
        align-self: flex-start;
        position: relative;
        z-index: 1;

        &.up {
            background: linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.1));
            color: #43e97b;
            box-shadow: 0 0 20px rgba(67, 233, 123, 0.3);
        }

        &.down {
            background: linear-gradient(135deg, rgba(245, 87, 108, 0.2), rgba(240, 147, 251, 0.1));
            color: #f5576c;
            box-shadow: 0 0 20px rgba(245, 87, 108, 0.3);
        }
    }

    // ===== 图表 =====
    .chart-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .chart-wrapper {
        flex: 1;
        position: relative;
        z-index: 1;
        min-height: 280px;
    }

    // ===== 地图 =====
    .map-panel {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .map-wrapper {
        flex: 1;
        position: relative;
        z-index: 1;
        border-radius: 12px;
        overflow: hidden;
        min-height: 0;
    }

    .map-bg {
        width: 100%;
        height: 100%;
        position: relative;
        background: radial-gradient(ellipse at 30% 30%, rgba(102, 126, 234, 0.12), transparent 60%),
            radial-gradient(ellipse at 70% 70%, rgba(240, 147, 251, 0.12), transparent 60%);
    }

    .map-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(rgba(102, 126, 234, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.08) 1px, transparent 1px);
        background-size: 60px 60px;
    }

    .map-lines {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    .map-point {
        position: absolute;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    .point-core {
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(102, 126, 234, 1), 0 0 40px rgba(102, 126, 234, 0.6),
            0 0 60px rgba(102, 126, 234, 0.3);
        position: relative;
        z-index: 3;
    }

    .point-ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(102, 126, 234, 0.6);
        animation: ripple 2.5s ease-out infinite;
    }

    @keyframes ripple {
        0% {
            width: 12px;
            height: 12px;
            opacity: 1;
        }
        100% {
            width: 70px;
            height: 70px;
            opacity: 0;
        }
    }

    .point-label {
        position: absolute;
        top: 28px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 8px;
        white-space: nowrap;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);

        .label-name {
            font-size: 12px;
            font-style: italic;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 4px;
        }

        .label-value {
            font-size: 16px;
            font-weight: 700;
            font-style: italic;
            background: linear-gradient(135deg, #667eea, #f093fb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    // ===== 实时数据 =====
    .realtime-panel {
        .realtime-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            position: relative;
            z-index: 1;
        }
    }

    .realtime-item {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(240, 147, 251, 0.05));
        border-radius: 12px;
        padding: 20px 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .item-icon {
        font-size: 36px;
        filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.6));
    }

    .item-info {
        text-align: center;
        width: 100%;

        .item-value {
            font-size: 20px;
            font-weight: 700;
            font-style: italic;
            color: #fff;
            margin-bottom: 5px;
        }

        .item-label {
            font-size: 11px;
            font-style: italic;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 1px;
        }
    }

    .item-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 3px;
        overflow: hidden;
        position: relative;
    }

    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #f093fb);
        border-radius: 3px;
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.8);
        transition: width 1.5s ease;
        position: relative;
    }

    .bar-light {
        position: absolute;
        right: 0;
        top: 0;
        width: 30px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6));
        animation: lightMove 2s ease-in-out infinite;
    }

    @keyframes lightMove {
        0%,
        100% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
    }

    // ===== 排行榜 =====
    .ranking-panel {
        flex: 1.2;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .ranking-list {
        flex: 1;
        position: relative;
        z-index: 1;
        overflow-y: auto;
        padding-right: 5px;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.5);
            border-radius: 2px;

            &:hover {
                background: rgba(102, 126, 234, 0.7);
            }
        }
    }

    .rank-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        margin-bottom: 12px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(240, 147, 251, 0.05));
        border-radius: 10px;
    }

    .rank-num {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 800;
        font-style: italic;
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.6);

        &.rank-1 {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
        }

        &.rank-2 {
            background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
            color: #000;
            box-shadow: 0 0 25px rgba(192, 192, 192, 0.6);
        }

        &.rank-3 {
            background: linear-gradient(135deg, #cd7f32, #e8a87c);
            color: #000;
            box-shadow: 0 0 25px rgba(205, 127, 50, 0.6);
        }
    }

    .rank-content {
        flex: 1;
        min-width: 0;
    }

    .rank-name {
        font-size: 14px;
        font-style: italic;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 10px;
    }

    .rank-bar {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .bar-track {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        overflow: hidden;
    }

    .bar-progress {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #f093fb);
        border-radius: 4px;
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.8);
        transition: width 1.5s ease;
        position: relative;
    }

    .bar-shine {
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
        animation: shine 2.5s ease-in-out infinite;
    }

    @keyframes shine {
        0%,
        100% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
    }

    .rank-value {
        font-size: 15px;
        font-weight: 700;
        font-style: italic;
        background: linear-gradient(135deg, #667eea, #f093fb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        flex-shrink: 0;
    }
</style>
