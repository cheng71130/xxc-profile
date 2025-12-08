<template>
    <div class="demo-container animate__animated animate__fadeIn">
        <div class="style-selector-section">
            <div class="section-header">
                <div class="header-icon">🎨</div>
                <div class="header-content">
                    <h3>选择 Loading 样式</h3>
                    <p class="header-desc">六种精美动画效果，满足不同场景需求</p>
                </div>
            </div>
            <div class="controls">
                <div class="style-radio-group">
                    <div
                        v-for="style in styles"
                        :key="style.value"
                        class="style-radio"
                        :class="{ active: currentStyle === style.value }"
                        @click="currentStyle = style.value"
                    >
                        <span class="radio-icon">{{ style.icon }}</span>
                        <span class="radio-text">{{ style.label }}</span>
                    </div>
                </div>
                <el-button type="primary" size="large" @click="toggleLoading" class="toggle-btn">
                    {{ loading1 ? '停止' : '开始' }} loading
                </el-button>
            </div>
        </div>

        <div class="section-header">
            <div class="header-icon">📋</div>
            <h3>基础用法</h3>
            <p class="header-desc">数据列表加载场景演示</p>
        </div>
        <div class="demo-row two-cols">
            <div class="demo-box">
                <div class="box-header">
                    <h4>简单用法</h4>
                    <span class="usage-badge">布尔值</span>
                </div>
                <div v-elegant-loading="loading1" class="data-list">
                    <div v-for="item in tableData" :key="item.id" class="data-item">
                        <div class="item-name">{{ item.name }}</div>
                        <div class="item-info">{{ item.address }}</div>
                    </div>
                </div>
                <div class="code-preview">
                    <code>v-elegant-loading="loading"</code>
                </div>
            </div>

            <div class="demo-box">
                <div class="box-header">
                    <h4>自定义配置</h4>
                    <span class="usage-badge primary">对象配置</span>
                </div>
                <div
                    v-elegant-loading="{
                        show: loading2,
                        type: currentStyle,
                        text: '加载中...',
                        color: 'var(--el-color-primary)',
                    }"
                    class="data-list"
                >
                    <div v-for="item in tableData" :key="item.id" class="data-item">
                        <div class="item-name">{{ item.name }}</div>
                        <div class="item-info">{{ item.address }}</div>
                    </div>
                </div>
                <div class="code-preview">
                    <code>v-elegant-loading="{ show, type, text }"</code>
                </div>
            </div>
        </div>

        <div class="section-header">
            <div class="header-icon">🎯</div>
            <h3>场景应用</h3>
            <p class="header-desc">不同UI场景下的灵活应用</p>
        </div>
        <div class="demo-row equal-height">
            <div class="demo-box">
                <div class="box-header">
                    <h4>深色背景卡片</h4>
                    <span class="usage-badge success">背景适配</span>
                </div>
                <div
                    v-elegant-loading="{
                        show: loading3,
                        type: currentStyle,
                        color: 'var(--el-color-primary)',
                        background: 'rgba(0, 0, 0, 0.8)',
                    }"
                    class="dark-card"
                    @click="handleDarkCardClick"
                >
                    <div class="card-icon">🌙</div>
                    <p class="card-title">深色主题卡片</p>
                    <p class="card-desc">点击体验 Loading 效果</p>
                </div>
            </div>

            <div class="demo-box">
                <div class="box-header">
                    <h4>多彩 Loading</h4>
                    <span class="usage-badge warning">颜色自定义</span>
                </div>
                <div class="color-grid">
                    <div
                        v-elegant-loading="{
                            show: loadingColors.red,
                            type: currentStyle,
                            color: '#f56c6c',
                        }"
                        class="color-card red"
                        @click="toggleColorLoading('red')"
                    >
                        <div class="card-content">
                            <span class="color-icon">🔴</span>
                            <p class="color-name">红色</p>
                        </div>
                    </div>
                    <div
                        v-elegant-loading="{
                            show: loadingColors.green,
                            type: currentStyle,
                            color: '#67c23a',
                        }"
                        class="color-card green"
                        @click="toggleColorLoading('green')"
                    >
                        <div class="card-content">
                            <span class="color-icon">🟢</span>
                            <p class="color-name">绿色</p>
                        </div>
                    </div>
                    <div
                        v-elegant-loading="{
                            show: loadingColors.orange,
                            type: currentStyle,
                            color: '#e6a23c',
                        }"
                        class="color-card orange"
                        @click="toggleColorLoading('orange')"
                    >
                        <div class="card-content">
                            <span class="color-icon">🟠</span>
                            <p class="color-name">橙色</p>
                        </div>
                    </div>
                    <div
                        v-elegant-loading="{
                            show: loadingColors.purple,
                            type: currentStyle,
                            color: '#9b59b6',
                        }"
                        class="color-card purple"
                        @click="toggleColorLoading('purple')"
                    >
                        <div class="card-content">
                            <span class="color-icon">🟣</span>
                            <p class="color-name">紫色</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tip-card">
            <div class="tip-icon">💡</div>
            <div class="tip-content">
                <p class="tip-title">使用提示</p>
                <ul class="tip-list">
                    <li>点击顶部样式选择不同的 Loading 动画效果</li>
                    <li>点击彩色卡片体验不同颜色的 Loading</li>
                    <li>所有动画均使用 CSS 实现，不会被 JS 阻塞</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const styles = [
        { value: 'spinner', label: '旋转圆环', icon: '⭕' },
        { value: 'dots', label: '三点跳动', icon: '⚫' },
        { value: 'bars', label: '竖条波浪', icon: '📊' },
        { value: 'ring', label: '双环旋转', icon: '💍' },
        { value: 'pulse', label: '脉冲圆', icon: '💓' },
        { value: 'gradient', label: '渐变圆环', icon: '🌈' },
    ];

    const tableData = [
        { id: 1, name: '张三', address: '北京市朝阳区' },
        { id: 2, name: '李四', address: '上海市浦东新区' },
        { id: 3, name: '王五', address: '广州市天河区' },
        { id: 4, name: '赵六', address: '深圳市南山区' },
    ];

    const loading1 = ref(false);
    const loading2 = ref(false);
    const loading3 = ref(false);
    const currentStyle = ref('spinner');

    const loadingColors = ref({
        red: false,
        green: false,
        orange: false,
        purple: false,
    });

    const toggleLoading = () => {
        loading1.value = !loading1.value;
        loading2.value = !loading2.value;
    };

    const handleDarkCardClick = () => {
        loading3.value = true;
        setTimeout(() => {
            loading3.value = false;
        }, 2000);
    };

    const toggleColorLoading = (color: 'red' | 'green' | 'orange' | 'purple') => {
        loadingColors.value[color] = !loadingColors.value[color];
        if (loadingColors.value[color]) {
            setTimeout(() => {
                loadingColors.value[color] = false;
            }, 2000);
        }
    };
</script>

<style scoped lang="scss">
    .demo-container {
        width: 100%;
    }

    .style-selector-section {
        margin-bottom: 40px;
        padding: 24px;
        background: linear-gradient(135deg, rgba(64, 158, 255, 0.08) 0%, rgba(64, 158, 255, 0.02) 100%);
        border-radius: 16px;
        border: 1px solid rgba(64, 158, 255, 0.2);
        box-shadow: 0 8px 32px rgba(64, 158, 255, 0.1);
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.08);
        position: relative;

        &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -2px;
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, var(--el-color-primary), transparent);
        }

        .header-icon {
            font-size: 28px;
            filter: drop-shadow(0 2px 8px rgba(64, 158, 255, 0.3));
        }

        .header-content {
            flex: 1;

            h3 {
                color: #f0f0f0;
                font-size: 22px;
                font-weight: 600;
                margin: 0 0 4px 0;
                letter-spacing: 0.5px;
            }

            .header-desc {
                color: #909399;
                font-size: 14px;
                margin: 0;
            }
        }

        h3 {
            color: #f0f0f0;
            font-size: 22px;
            font-weight: 600;
            margin: 0;
            letter-spacing: 0.5px;
        }

        .header-desc {
            color: #909399;
            font-size: 14px;
            margin: 0 0 0 auto;
        }
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 100px;

        .style-radio-group {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 12px;
        }

        .style-radio {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            transition: all 0.3s;
            cursor: pointer;
            justify-content: center;
            user-select: none;
            height: 46px;

            &:hover {
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }

            &:active {
                transform: translateY(0);
            }

            .radio-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            .radio-text {
                color: #b0b0b0;
                font-size: 15px;
                font-weight: 500;
                white-space: nowrap;
            }

            &.active {
                background: rgba(64, 158, 255, 0.15);
                border-color: var(--el-color-primary);
                box-shadow: 0 0 16px rgba(64, 158, 255, 0.25);

                .radio-text {
                    color: var(--el-color-primary);
                }
            }
        }

        .toggle-btn {
            padding: 14px 36px;
            height: auto;
            font-size: 16px;
            font-weight: 600;
            border-radius: 10px;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
            transition: all 0.3s;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    .demo-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 40px;

        &.equal-height {
            grid-auto-rows: 1fr;
        }
    }

    .demo-box {
        padding: 24px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
    }

    .box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h4 {
            color: #e0e0e0;
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }
    }

    .usage-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(144, 147, 153, 0.15);
        color: #909399;
        border: 1px solid rgba(144, 147, 153, 0.3);

        &.primary {
            background: rgba(64, 158, 255, 0.15);
            color: var(--el-color-primary);
            border-color: rgba(64, 158, 255, 0.3);
        }

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
    }

    .data-list {
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 16px;
        min-height: 260px;
    }

    .data-item {
        padding: 14px 16px;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition: all 0.3s;

        &:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.12);
        }

        .item-name {
            color: #f0f0f0;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .item-info {
            color: #909399;
            font-size: 13px;
        }
    }

    .code-preview {
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        border-left: 3px solid var(--el-color-primary);

        code {
            color: #67c23a;
            font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            font-size: 13px;
        }
    }

    .dark-card {
        padding: 40px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;

        &:hover {
            border-color: rgba(64, 158, 255, 0.5);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
            box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
        }

        .card-icon {
            font-size: 48px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .card-title {
            color: #f0f0f0;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }

        .card-desc {
            color: #909399;
            font-size: 14px;
            margin: 0;
        }
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        flex: 1;
    }

    .color-card {
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
            transform: translateY(-4px) scale(1.05);
        }

        &:active {
            transform: translateY(-2px) scale(1);
        }

        .card-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .color-icon {
                font-size: 28px;
            }

            .color-name {
                font-size: 13px;
                font-weight: 600;
                margin: 0;
            }
        }

        &.red {
            background: linear-gradient(135deg, rgba(245, 108, 108, 0.2), rgba(245, 108, 108, 0.1));
            border: 2px solid rgba(245, 108, 108, 0.4);
            color: #ff7979;

            &:hover {
                box-shadow: 0 8px 20px rgba(245, 108, 108, 0.3);
            }
        }

        &.green {
            background: linear-gradient(135deg, rgba(103, 194, 58, 0.2), rgba(103, 194, 58, 0.1));
            border: 2px solid rgba(103, 194, 58, 0.4);
            color: #7ed956;

            &:hover {
                box-shadow: 0 8px 20px rgba(103, 194, 58, 0.3);
            }
        }

        &.orange {
            background: linear-gradient(135deg, rgba(230, 162, 60, 0.2), rgba(230, 162, 60, 0.1));
            border: 2px solid rgba(230, 162, 60, 0.4);
            color: #f0b860;

            &:hover {
                box-shadow: 0 8px 20px rgba(230, 162, 60, 0.3);
            }
        }

        &.purple {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(155, 89, 182, 0.1));
            border: 2px solid rgba(155, 89, 182, 0.4);
            color: #b77fd4;

            &:hover {
                box-shadow: 0 8px 20px rgba(155, 89, 182, 0.3);
            }
        }
    }

    .tip-card {
        margin-top: 24px;
        padding: 20px 24px;
        background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.05));
        border-left: 4px solid var(--el-color-primary);
        border-radius: 10px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);

        .tip-icon {
            font-size: 24px;
            flex-shrink: 0;
        }

        .tip-content {
            flex: 1;

            .tip-title {
                color: #f0f0f0;
                font-size: 15px;
                font-weight: 600;
                margin: 0 0 12px 0;
            }

            .tip-list {
                margin: 0;
                padding-left: 20px;
                color: #b0b0b0;
                font-size: 14px;
                line-height: 1.8;

                li {
                    margin-bottom: 6px;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>
