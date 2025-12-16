<template>
    <div class="demo-container">
        <!-- 顶部操作栏 -->
        <div class="demo-actions">
            <el-radio-group v-model="currentDemo" size="large">
                <el-radio-button label="basic">基础用法</el-radio-button>
                <el-radio-button label="styles">样式选择</el-radio-button>
                <el-radio-button label="dark">深色背景</el-radio-button>
                <el-radio-button label="optimize">性能优化</el-radio-button>
            </el-radio-group>

            <div class="demo-tip">
                <i class="tip-icon">💡</i>
                <span class="tip-text">{{ getTipText() }}</span>
            </div>
        </div>

        <!-- 基础用法 -->
        <div v-if="currentDemo === 'basic'" class="demo-content" key="basic">
            <div class="demo-grid">
                <div class="card-item">
                    <div class="card-header">
                        <h4>简单用法</h4>
                        <span class="badge">布尔值</span>
                    </div>
                    <div
                        v-elegant-loading="loading1"
                        class="card-showcase clickable"
                        @click="toggleLoading('loading1')"
                    >
                        <div class="showcase-icon">🎯</div>
                        <h3 class="showcase-title">极简配置</h3>
                        <p class="showcase-desc">只需传入布尔值即可使用默认 Loading 效果</p>
                        <div class="showcase-features">
                            <div class="feature-tag">开箱即用</div>
                            <div class="feature-tag">零配置</div>
                            <div class="feature-tag">响应式</div>
                        </div>
                    </div>
                </div>

                <div class="card-item">
                    <div class="card-header">
                        <h4>自定义文本</h4>
                        <span class="badge success">对象配置</span>
                    </div>
                    <div
                        v-elegant-loading="{
                            show: loading2,
                            text: '加载中...',
                            color: 'var(--el-color-primary)',
                        }"
                        class="card-showcase clickable"
                        @click="toggleLoading('loading2')"
                    >
                        <div class="showcase-icon">✨</div>
                        <h3 class="showcase-title">灵活配置</h3>
                        <p class="showcase-desc">通过对象配置自定义加载文本和颜色</p>
                        <div class="showcase-features">
                            <div class="feature-tag">自定义文本</div>
                            <div class="feature-tag">颜色可调</div>
                            <div class="feature-tag">易扩展</div>
                        </div>
                    </div>
                </div>

                <div class="card-item">
                    <div class="card-header">
                        <h4>自定义颜色</h4>
                        <span class="badge warning">颜色配置</span>
                    </div>
                    <div
                        v-elegant-loading="{
                            show: loading3,
                            color: '#67c23a',
                        }"
                        class="card-showcase clickable"
                        @click="toggleLoading('loading3')"
                    >
                        <div class="showcase-icon">🎨</div>
                        <h3 class="showcase-title">主题定制</h3>
                        <p class="showcase-desc">轻松调整颜色以匹配您的设计系统</p>
                        <div class="showcase-features">
                            <div class="feature-tag">品牌色</div>
                            <div class="feature-tag">多主题</div>
                            <div class="feature-tag">一致性</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 样式选择 -->
        <div v-if="currentDemo === 'styles'" class="demo-content" key="styles">
            <div class="style-selector">
                <div class="style-grid">
                    <div
                        v-for="style in styles"
                        :key="style.value"
                        class="style-item"
                        :class="{ active: currentStyle === style.value }"
                        @click="selectStyle(style.value)"
                    >
                        <div class="style-info">
                            <span class="style-label">{{ style.label }}</span>
                        </div>
                        <div class="style-check" v-if="currentStyle === style.value">✓</div>
                    </div>
                </div>
            </div>

            <div class="card-item full-width">
                <div
                    v-elegant-loading="{
                        show: styleLoading1,
                        type: currentStyle,
                        color: 'var(--el-color-primary)',
                    }"
                    class="style-preview clickable"
                    @click="toggleLoading('styleLoading1')"
                >
                    <div class="preview-content">
                        <div class="preview-header">
                            <div class="preview-avatar">{{ currentStyle.charAt(0).toUpperCase() }}</div>
                            <div class="preview-info">
                                <h3>{{ getCurrentStyleName() }}</h3>
                                <p>点击卡片预览 Loading 效果</p>
                            </div>
                        </div>
                        <div class="preview-stats">
                            <div class="stat-item">
                                <div class="stat-value">60fps</div>
                                <div class="stat-label">流畅动画</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">&lt;2KB</div>
                                <div class="stat-label">轻量体积</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">100%</div>
                                <div class="stat-label">兼容性</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 深色背景 -->
        <div v-if="currentDemo === 'dark'" class="demo-content" key="dark">
            <div class="card-item full-width">
                <div
                    v-elegant-loading="{
                        show: darkLoading1,
                        type: 'bars',
                        background: 'rgba(0, 0, 0, 0.90)',
                    }"
                    class="dark-showcase clickable"
                    @click="toggleLoading('darkLoading1')"
                >
                    <div class="dark-content">
                        <div class="dark-icon">🌙</div>
                        <h3>深色模式</h3>
                        <p>为暗色主题优化的 Loading 效果</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">💡</div>
                    <div class="tip-content">
                        <p class="tip-title">使用建议</p>
                        <p class="tip-text">
                            深色背景适合在暗色主题、夜间模式或需要强调内容的场景中使用，配合半透明背景可以保持上下文可见性
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 性能优化 -->
        <div v-if="currentDemo === 'optimize'" class="demo-content" key="optimize">
            <el-button color="#626aef" @click="openDrawer">打开抽屉</el-button>
            <el-drawer v-model="drawer" title="I am the title">
                <div
                    style="width: 100%; height: 100%"
                    class="optimize-showcase"
                    v-elegant-loading="{
                        show: optimizeLoading1,
                        type: 'ring',
                        backdropFilter: false,
                    }"
                >
                    <div class="optimize-content">
                        <div class="optimize-icon">🤖</div>
                        <h3>性能优先</h3>
                        <p>为动画流畅优化的 Loading 效果</p>
                    </div>
                </div>
            </el-drawer>
            <div class="tip-card">
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                    <p class="tip-title">使用建议</p>
                    <p class="tip-text">
                        性能优化即去除 backdropFilter，适合在抽屉等有初始动画组件中使用，保证该类组件的动画流畅不卡顿
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const currentDemo = ref('basic');

    const styles = [
        { value: 'spinner', label: '旋转圆环' },
        { value: 'dots', label: '三点跳动' },
        { value: 'bars', label: '竖条波浪' },
        { value: 'ring', label: '双环旋转' },
        { value: 'pulse', label: '脉冲圆' },
        { value: 'gradient', label: '渐变圆环' },
    ];

    const loading1 = ref(false);
    const loading2 = ref(false);
    const loading3 = ref(false);
    const currentStyle = ref('spinner');
    const styleLoading1 = ref(false);
    const darkLoading1 = ref(false);
    const optimizeLoading1 = ref(false);
    const drawer = ref(false);

    const toggleLoading = (key: string) => {
        switch (key) {
            case 'loading1':
                loading1.value = true;
                setTimeout(() => (loading1.value = false), 2000);
                break;
            case 'loading2':
                loading2.value = true;
                setTimeout(() => (loading2.value = false), 2000);
                break;
            case 'loading3':
                loading3.value = true;
                setTimeout(() => (loading3.value = false), 2000);
                break;
            case 'styleLoading1':
                styleLoading1.value = true;
                setTimeout(() => (styleLoading1.value = false), 2000);
                break;
            case 'darkLoading1':
                darkLoading1.value = true;
                setTimeout(() => (darkLoading1.value = false), 2500);
                break;
            case 'optimizeLoading1':
                optimizeLoading1.value = true;
                setTimeout(() => (optimizeLoading1.value = false), 2000);
                break;
        }
    };

    const selectStyle = (styleValue: string) => {
        currentStyle.value = styleValue;
    };

    const getCurrentStyleName = () => {
        return styles.find((s) => s.value === currentStyle.value)?.label || '旋转圆环';
    };

    const getTipText = () => {
        const tips = {
            basic: '点击卡片体验 Loading 效果',
            styles: '选择不同的动画样式并点击预览区查看效果',
            dark: '点击预览区体验深色主题下的 Loading 效果',
            optimize: '点击预览区体验性能区别',
        };
        return tips[currentDemo.value as keyof typeof tips];
    };

    const openDrawer = () => {
        drawer.value = true;
        toggleLoading('optimizeLoading1');
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
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

        :deep(.el-radio-button__inner) {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.08);
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

    // 样式选择器
    .style-selector {
        margin-bottom: 24px;

        .style-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 16px;
        }

        .style-item {
            padding: 18px 24px;
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid transparent;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                opacity: 0;
                transition: opacity 0.3s;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.06);
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

                &::before {
                    opacity: 1;
                }
            }

            &.active {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
                border-color: #667eea;
                box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);

                .style-label {
                    color: #667eea;
                }
            }

            .style-info {
                position: relative;
                z-index: 1;
            }

            .style-label {
                font-size: 16px;
                color: #f0f0f0;
                font-weight: 600;
                transition: color 0.3s;
            }

            .style-check {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                position: relative;
                z-index: 1;
                animation: checkBounce 0.5s ease;
            }
        }
    }

    @keyframes checkBounce {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }

    // 网格布局
    .demo-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    // 卡片项
    .card-item {
        display: flex;
        flex-direction: column;
        gap: 16px;

        &.full-width {
            grid-column: 1 / -1;
        }
    }

    // 卡片头部
    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;

        h4 {
            margin: 0;
            font-size: 17px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
        }
    }

    // 标签
    .badge {
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(64, 158, 255, 0.15);
        color: var(--el-color-primary);
        border: 1px solid rgba(64, 158, 255, 0.2);

        &.success {
            background: rgba(103, 194, 58, 0.15);
            color: #67c23a;
            border-color: rgba(103, 194, 58, 0.2);
        }

        &.warning {
            background: rgba(230, 162, 60, 0.15);
            color: #e6a23c;
            border-color: rgba(230, 162, 60, 0.2);
        }
    }

    // 可点击提示
    .clickable {
        cursor: pointer;
        transition: all 0.3s;
    }

    // 卡片展示
    .card-showcase {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
        border-radius: 12px;
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
        min-height: 280px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .showcase-icon {
            font-size: 56px;
            margin-bottom: 8px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .showcase-title {
            font-size: 20px;
            font-weight: 600;
            color: #f0f0f0;
            margin: 0;
        }

        .showcase-desc {
            font-size: 14px;
            color: #b0b0b0;
            line-height: 1.6;
            margin: 0;
            max-width: 280px;
        }

        .showcase-features {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 8px;
        }

        .feature-tag {
            padding: 6px 12px;
            background: rgba(102, 126, 234, 0.15);
            border: 1px solid rgba(102, 126, 234, 0.25);
            border-radius: 6px;
            font-size: 12px;
            color: #667eea;
            font-weight: 500;
        }
    }

    // 样式预览
    .style-preview {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 40px;
        min-height: 320px;
        transition: all 0.3s;

        &:hover {
            background: rgba(0, 0, 0, 0.25);
        }

        .preview-content {
            max-width: 800px;
            margin: 0 auto;
        }

        .preview-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 40px;
            padding-bottom: 32px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);

            .preview-avatar {
                width: 72px;
                height: 72px;
                border-radius: 16px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: 700;
                color: #667eea;
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }

            .preview-info {
                flex: 1;

                h3 {
                    font-size: 24px;
                    color: #f0f0f0;
                    margin: 0 0 8px 0;
                    font-weight: 600;
                }

                p {
                    font-size: 15px;
                    color: #909399;
                    margin: 0;
                }
            }
        }

        .preview-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;

            .stat-item {
                text-align: center;
                padding: 24px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                transition: all 0.3s;

                &:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(102, 126, 234, 0.3);
                    transform: translateY(-2px);
                }

                .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stat-label {
                    font-size: 14px;
                    color: #b0b0b0;
                }
            }
        }
    }

    // 深色展示
    .dark-showcase {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        padding: 80px 40px;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &:hover {
            background: rgba(0, 0, 0, 0.5);
        }

        .dark-content {
            text-align: center;
            max-width: 500px;

            .dark-icon {
                font-size: 80px;
                margin-bottom: 24px;
                filter: drop-shadow(0 8px 16px rgba(102, 126, 234, 0.4));
            }

            h3 {
                font-size: 28px;
                font-weight: 600;
                color: #a78bfa;
                margin: 0 0 16px 0;
            }

            p {
                font-size: 16px;
                color: #b0b0b0;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    // 性能优化
    .optimize-showcase {
        border-radius: 16px;
        padding: 80px 40px;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;

        .optimize-content {
            text-align: center;
            max-width: 500px;

            .optimize-icon {
                font-size: 80px;
                margin-bottom: 24px;
                filter: drop-shadow(0 8px 16px rgba(102, 126, 234, 1));
            }

            h3 {
                font-size: 28px;
                font-weight: 600;
                color: #673fe0;
                margin: 0 0 16px 0;
            }

            p {
                font-size: 16px;
                color: #5e5d5d;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    // 提示卡片
    .tip-card {
        margin-top: 15px;
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
        .style-selector .style-grid {
            grid-template-columns: repeat(3, 1fr);
        }

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

        .style-selector .style-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .demo-grid {
            grid-template-columns: 1fr;
        }

        .dark-showcase {
            padding: 60px 24px;
            min-height: 320px;
        }

        .preview-stats {
            grid-template-columns: 1fr !important;
        }
    }
</style>
