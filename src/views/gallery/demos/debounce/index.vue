<template>
    <div class="demo-container">
        <!-- 顶部操作栏 -->
        <div class="demo-actions">
            <el-radio-group v-model="currentDemo" size="large">
                <el-radio-button label="debounce">防抖示例</el-radio-button>
                <el-radio-button label="throttle">节流示例</el-radio-button>
                <el-radio-button label="scroll">滚动节流</el-radio-button>
                <el-radio-button label="compare">对比演示</el-radio-button>
            </el-radio-group>

            <div class="demo-tip">
                <i class="tip-icon">💡</i>
                <span class="tip-text">{{ getTipText() }}</span>
            </div>
        </div>

        <!-- 防抖示例 -->
        <div v-if="currentDemo === 'debounce'" class="demo-content" key="debounce">
            <div class="demo-grid">
                <div class="demo-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>简单用法</h4>
                        </div>
                        <span class="delay-badge">300ms</span>
                    </div>
                    <div class="box-body">
                        <el-button v-debounce="handleSimpleDebounce" type="primary" class="action-btn">
                            点击触发
                        </el-button>
                        <div class="count-wrapper">
                            <span class="count-label">触发次数</span>
                            <span class="count-value">{{ debounceCount1 }}</span>
                        </div>
                    </div>
                </div>

                <div class="demo-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>立即执行</h4>
                        </div>
                        <span class="delay-badge success">500ms</span>
                    </div>
                    <div class="box-body">
                        <el-button
                            v-debounce="{
                                handler: handleImmediateDebounce,
                                delay: 500,
                                immediate: true,
                            }"
                            type="success"
                            class="action-btn"
                        >
                            立即触发
                        </el-button>
                        <div class="count-wrapper">
                            <span class="count-label">触发次数</span>
                            <span class="count-value">{{ debounceCount2 }}</span>
                        </div>
                    </div>
                </div>

                <div class="demo-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>输入框防抖</h4>
                        </div>
                        <span class="delay-badge warning">500ms</span>
                    </div>
                    <div class="box-body">
                        <el-input
                            v-debounce="{
                                handler: handleInputDebounce,
                                delay: 500,
                                event: 'input',
                            }"
                            v-model="searchText"
                            placeholder="请输入"
                            clearable
                            class="search-input"
                        />
                        <div class="search-result">
                            <span class="result-label">搜索内容：</span>
                            <span class="result-value">{{ searchResult || '暂无' }}</span>
                        </div>
                        <div class="count-wrapper">
                            <span class="count-label">搜索次数</span>
                            <span class="count-value">{{ debounceCount3 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 节流示例 -->
        <div v-if="currentDemo === 'throttle'" class="demo-content" key="throttle">
            <div class="demo-grid">
                <div class="demo-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>简单用法</h4>
                        </div>
                        <span class="delay-badge">1000ms</span>
                    </div>
                    <div class="box-body">
                        <el-button v-throttle="handleSimpleThrottle" type="primary" class="action-btn">
                            连续点击
                        </el-button>
                        <div class="count-wrapper">
                            <span class="count-label">触发次数</span>
                            <span class="count-value">{{ throttleCount1 }}</span>
                        </div>
                    </div>
                </div>

                <div class="demo-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>禁用首次执行</h4>
                        </div>
                        <span class="delay-badge warning">1000ms</span>
                    </div>
                    <div class="box-body">
                        <el-button
                            v-throttle="{
                                handler: handleNoLeadingThrottle,
                                delay: 1000,
                                leading: false,
                            }"
                            type="warning"
                            class="action-btn"
                        >
                            连续点击
                        </el-button>
                        <div class="count-wrapper">
                            <span class="count-label">触发次数</span>
                            <span class="count-value">{{ throttleCount2 }}</span>
                        </div>
                    </div>
                </div>

                <div class="demo-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>禁用尾调用</h4>
                        </div>
                        <span class="delay-badge danger">1000ms</span>
                    </div>
                    <div class="box-body">
                        <el-button
                            v-throttle="{
                                handler: handleNoTrailingThrottle,
                                delay: 1000,
                                trailing: false,
                            }"
                            type="danger"
                            class="action-btn"
                        >
                            连续点击
                        </el-button>
                        <div class="count-wrapper">
                            <span class="count-label">触发次数</span>
                            <span class="count-value">{{ throttleCount3 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 滚动节流示例 -->
        <div v-if="currentDemo === 'scroll'" class="demo-content" key="scroll">
            <div class="demo-box full-width scroll-demo">
                <div class="box-header">
                    <div class="header-left">
                        <h4>滚动事件节流</h4>
                    </div>
                    <span class="delay-badge">500ms</span>
                </div>
                <div class="box-body">
                    <div
                        v-throttle="{
                            handler: handleScroll,
                            delay: 500,
                            event: 'scroll',
                        }"
                        class="scroll-container"
                    >
                        <div class="scroll-content">
                            <div v-for="i in 50" :key="i" class="scroll-item">
                                <span class="item-index">#{{ i }}</span>
                                <span class="item-text">滚动内容项 {{ i }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="scroll-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📍</span>
                            <div class="stat-info">
                                <span class="stat-label">滚动位置</span>
                                <span class="stat-value">{{ scrollTop }}px</span>
                            </div>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-icon">🔢</span>
                            <div class="stat-info">
                                <span class="stat-label">触发次数</span>
                                <span class="stat-value">{{ scrollCount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 对比演示 -->
        <div v-if="currentDemo === 'compare'" class="demo-content" key="compare">
            <div class="demo-grid">
                <div class="demo-box compare-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>普通点击</h4>
                        </div>
                        <span class="mode-badge normal">0ms</span>
                    </div>
                    <div class="box-body">
                        <el-button @click="handleNormal" type="info" class="action-btn"> 疯狂点击 </el-button>
                        <div class="count-wrapper large">
                            <span class="count-value pulse">{{ normalCount }}</span>
                        </div>
                    </div>
                </div>

                <div class="demo-box compare-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>防抖模式</h4>
                        </div>
                        <span class="mode-badge debounce">300ms</span>
                    </div>
                    <div class="box-body">
                        <el-button v-debounce="handleDebounceCompare" type="primary" class="action-btn">
                            疯狂点击
                        </el-button>
                        <div class="count-wrapper large">
                            <span class="count-value">{{ debounceCompareCount }}</span>
                        </div>
                    </div>
                </div>

                <div class="demo-box compare-box">
                    <div class="box-header">
                        <div class="header-left">
                            <h4>节流模式</h4>
                        </div>
                        <span class="mode-badge throttle">300ms</span>
                    </div>
                    <div class="box-body">
                        <el-button
                            v-throttle="{ handler: handleThrottleCompare, delay: 300 }"
                            type="success"
                            class="action-btn"
                        >
                            疯狂点击
                        </el-button>
                        <div class="count-wrapper large">
                            <span class="count-value">{{ throttleCompareCount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tip-card">
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                    <p class="tip-title">使用建议</p>
                    <p class="tip-text">连续快速点击上方按钮，观察三种模式下触发次数的差异</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const currentDemo = ref('debounce');

    // 防抖计数
    const debounceCount1 = ref(0);
    const debounceCount2 = ref(0);
    const debounceCount3 = ref(0);
    const searchText = ref('');
    const searchResult = ref('');

    // 节流计数
    const throttleCount1 = ref(0);
    const throttleCount2 = ref(0);
    const throttleCount3 = ref(0);

    // 滚动相关
    const scrollTop = ref(0);
    const scrollCount = ref(0);

    // 对比计数
    const normalCount = ref(0);
    const debounceCompareCount = ref(0);
    const throttleCompareCount = ref(0);

    // 防抖处理函数
    const handleSimpleDebounce = () => {
        debounceCount1.value++;
    };

    const handleImmediateDebounce = () => {
        debounceCount2.value++;
    };

    const handleInputDebounce = (e: Event) => {
        debounceCount3.value++;
        searchResult.value = (e.target as HTMLInputElement).value;
    };

    // 节流处理函数
    const handleSimpleThrottle = () => {
        throttleCount1.value++;
    };

    const handleNoLeadingThrottle = () => {
        throttleCount2.value++;
    };

    const handleNoTrailingThrottle = () => {
        throttleCount3.value++;
    };

    // 滚动处理
    const handleScroll = (e: Event) => {
        scrollCount.value++;
        scrollTop.value = Math.round((e.target as HTMLElement).scrollTop);
    };

    // 对比函数
    const handleNormal = () => {
        normalCount.value++;
    };

    const handleDebounceCompare = () => {
        debounceCompareCount.value++;
    };

    const handleThrottleCompare = () => {
        throttleCompareCount.value++;
    };

    // 获取提示文本
    const getTipText = () => {
        const tips = {
            debounce: '连续触发事件时，只在最后一次触发后执行',
            throttle: '连续触发事件时，按固定时间间隔执行',
            scroll: '优化高频触发的滚动事件性能',
            compare: '直观感受防抖、节流与普通点击的差异',
        };
        return tips[currentDemo.value as keyof typeof tips];
    };
</script>

<style scoped lang="scss">
    .demo-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        min-height: 100%;
    }

    // 顶部操作栏
    .demo-actions {
        flex-shrink: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

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

    .demo-tip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: default;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(102, 126, 234, 0.3);

            .tip-icon {
                transform: scale(1.1) rotate(10deg);
            }

            .tip-text {
                color: rgba(255, 255, 255, 0.95);
            }
        }

        .tip-icon {
            font-style: normal;
            font-size: 16px;
            transition: transform 0.3s ease;
            flex-shrink: 0;
        }

        .tip-text {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            white-space: nowrap;
            transition: color 0.3s ease;
            user-select: none;
        }
    }

    // 内容区域
    .demo-content {
        flex: 1;
        min-height: 0;
    }

    // 网格布局
    .demo-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    // 卡片样式
    .demo-box {
        background: rgba(255, 255, 255, 0.02);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.full-width {
            grid-column: 1 / -1;
        }

        &.scroll-demo {
            .box-body {
                padding: 20px;
            }
        }
    }

    // 卡片头部
    .box-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;

            .icon {
                font-style: normal;
                font-size: 18px;
            }

            h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.95);
            }
        }
    }

    // 卡片内容
    .box-body {
        padding: 24px;
    }

    // 延迟标签
    .delay-badge,
    .mode-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(64, 158, 255, 0.15);
        color: var(--el-color-primary);
        border: 1px solid rgba(64, 158, 255, 0.3);

        &.success {
            background: rgba(103, 194, 58, 0.15);
            color: #67c23a;
            border-color: rgba(103, 194, 58, 0.3);
        }

        &.warning {
            background: rgba(230, 162, 60, 0.15);
            color: #e6a23c;
            border-color: rgba(230, 162, 60, 0.3);
        }

        &.danger {
            background: rgba(245, 108, 108, 0.15);
            color: #f56c6c;
            border-color: rgba(245, 108, 108, 0.3);
        }

        &.normal {
            background: rgba(144, 147, 153, 0.15);
            color: #909399;
            border-color: rgba(144, 147, 153, 0.3);
        }

        &.debounce {
            background: rgba(64, 158, 255, 0.15);
            color: #409eff;
            border-color: rgba(64, 158, 255, 0.3);
        }

        &.throttle {
            background: rgba(103, 194, 58, 0.15);
            color: #67c23a;
            border-color: rgba(103, 194, 58, 0.3);
        }
    }

    // 按钮样式
    .action-btn {
        width: 100%;
        height: 42px;
        font-size: 15px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.3s;

        &:active {
            transform: scale(0.98);
        }
    }

    // 计数器样式
    .count-wrapper {
        margin-top: 16px;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &.large {
            padding: 24px;
            justify-content: center;

            .count-value {
                font-size: 48px;
            }
        }

        .count-label {
            color: #909399;
            font-size: 13px;
            font-weight: 500;
        }

        .count-value {
            color: var(--el-color-primary);
            font-size: 24px;
            font-weight: 700;
            font-family: 'SF Mono', Monaco, monospace;
            transition: all 0.3s;

            &.pulse {
                animation: pulse 0.3s ease;
            }
        }
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.15);
            color: #67c23a;
        }
    }

    // 搜索框样式
    .search-input {
        :deep(.el-input__wrapper) {
            background: rgba(0, 0, 0, 0.2);
            box-shadow: none;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s;

            &:hover {
                border-color: rgba(255, 255, 255, 0.2);
            }

            &.is-focus {
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
            }
        }
    }

    .search-result {
        margin-top: 12px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        display: flex;
        align-items: baseline;
        gap: 8px;

        .result-label {
            color: #909399;
            font-size: 13px;
            flex-shrink: 0;
        }

        .result-value {
            color: #e0e0e0;
            font-size: 13px;
            font-weight: 500;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    // 滚动容器
    .scroll-container {
        height: 400px;
        overflow-y: auto;
        border-radius: 10px;

        &::-webkit-scrollbar {
            width: 10px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 5px;
            margin: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(64, 158, 255, 0.4), rgba(64, 158, 255, 0.6));
            border-radius: 5px;
            border: 2px solid rgba(0, 0, 0, 0.3);

            &:hover {
                background: linear-gradient(180deg, rgba(64, 158, 255, 0.6), rgba(64, 158, 255, 0.8));
            }
        }
    }

    .scroll-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        margin: 6px 0;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s;

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }

        &:hover {
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
            border-color: rgba(255, 255, 255, 0.1);
        }

        .item-index {
            color: var(--el-color-primary);
            font-size: 13px;
            font-weight: 600;
            font-family: 'SF Mono', Monaco, monospace;
            min-width: 32px;
        }

        .item-text {
            color: #d0d0d0;
            font-size: 14px;
        }
    }

    // 滚动统计
    .scroll-stats {
        margin-top: 16px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;

        .stat-icon {
            font-size: 24px;
        }

        .stat-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .stat-label {
            color: #909399;
            font-size: 12px;
            font-weight: 500;
        }

        .stat-value {
            color: #f0f0f0;
            font-size: 20px;
            font-weight: 700;
            font-family: 'SF Mono', Monaco, monospace;
        }
    }

    .stat-divider {
        width: 1px;
        height: 40px;
        background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    }

    // 提示卡片
    .tip-card {
        margin-top: 20px;
        padding: 20px 24px;
        background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.05) 100%);
        border-left: 4px solid var(--el-color-primary);
        border-radius: 10px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);

        .tip-icon {
            font-size: 24px;
            flex-shrink: 0;
            filter: drop-shadow(0 2px 4px rgba(64, 158, 255, 0.3));
        }

        .tip-content {
            flex: 1;

            .tip-title {
                color: #f0f0f0;
                font-size: 15px;
                font-weight: 600;
                margin: 0 0 6px 0;
            }

            .tip-text {
                color: #b0b0b0;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    // 响应式
    @media (max-width: 1200px) {
        .demo-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .demo-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;

            :deep(.el-radio-group) {
                width: 100%;
                display: flex;

                .el-radio-button {
                    flex: 1;
                }
            }

            .demo-tip {
                justify-content: center;
            }
        }

        .demo-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
