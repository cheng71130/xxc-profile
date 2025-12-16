<template>
    <div class="resizable-demo">
        <div class="demo-actions">
            <el-radio-group v-model="currentDemo" size="large">
                <el-radio-button label="horizontal">水平分割</el-radio-button>
                <el-radio-button label="vertical">垂直分割</el-radio-button>
                <el-radio-button label="nested">嵌套布局</el-radio-button>
            </el-radio-group>

            <!-- 新增提示文字 -->
            <div class="demo-tip">
                <i class="tip-icon">💡</i>
                <span class="tip-text">拖拽中间分隔线可调整面板大小</span>
            </div>
        </div>

        <div v-if="currentDemo === 'horizontal'" class="demo-container" key="horizontal">
            <ResizableLayout
                direction="horizontal"
                :default-size="300"
                :min-first-size="250"
                :min-second-size="350"
                :gap="12"
            >
                <template #first>
                    <div class="panel-content left-panel">
                        <div class="panel-header">
                            <div class="header-left">
                                <i class="icon">📁</i>
                                <h3>文件浏览器</h3>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="file-tree">
                                <div class="tree-item" v-for="item in fileList" :key="item.id">
                                    <div class="tree-node" :style="{ paddingLeft: `${item.level * 20}px` }">
                                        <i class="node-icon">{{ item.icon }}</i>
                                        <span class="node-label">{{ item.name }}</span>
                                        <span v-if="item.count" class="node-count">{{ item.count }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #second>
                    <div class="panel-content right-panel">
                        <div class="panel-header">
                            <div class="header-left">
                                <i class="icon">📄</i>
                                <h3>代码预览</h3>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="code-preview">
                                <div class="code-line" v-for="(line, i) in codeLines" :key="i">
                                    <span class="line-number">{{ i + 1 }}</span>
                                    <span class="line-content" v-html="line"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </ResizableLayout>
        </div>

        <div v-if="currentDemo === 'vertical'" class="demo-container" key="vertical">
            <ResizableLayout
                direction="vertical"
                :default-size="220"
                :min-first-size="220"
                :min-second-size="200"
                :gap="12"
            >
                <template #first>
                    <div class="panel-content top-panel">
                        <div class="panel-header">
                            <div class="header-left">
                                <i class="icon">📊</i>
                                <h3>数据概览</h3>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="metrics-grid">
                                <div class="metric-card" v-for="metric in metrics" :key="metric.label">
                                    <div class="metric-header">
                                        <span class="metric-label">{{ metric.label }}</span>
                                        <span :class="['metric-change', metric.trend]">
                                            {{ metric.change }}
                                        </span>
                                    </div>
                                    <div class="metric-value">{{ metric.value }}</div>
                                    <div class="metric-bar">
                                        <div
                                            class="metric-bar-fill"
                                            :style="{
                                                width: metric.progress + '%',
                                                background: metric.color,
                                            }"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #second>
                    <div class="panel-content bottom-panel">
                        <div class="panel-header">
                            <div class="header-left">
                                <i class="icon">📝</i>
                                <h3>最近活动</h3>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="timeline">
                                <div class="timeline-item" v-for="item in timeline" :key="item.id">
                                    <div class="timeline-dot" :style="{ background: item.color }"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-title">{{ item.title }}</div>
                                        <div class="timeline-desc">{{ item.desc }}</div>
                                        <div class="timeline-time">{{ item.time }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </ResizableLayout>
        </div>

        <div v-if="currentDemo === 'nested'" class="demo-container" key="nested">
            <ResizableLayout
                direction="horizontal"
                :default-size="280"
                :min-first-size="220"
                :min-second-size="400"
                :gap="12"
            >
                <template #first>
                    <div class="panel-content nested-left">
                        <div class="panel-header">
                            <div class="header-left">
                                <i class="icon">🗂️</i>
                                <h3>导航</h3>
                            </div>
                        </div>
                        <div class="panel-body">
                            <div class="nav-list">
                                <div
                                    class="nav-item"
                                    :class="{ active: nav.active }"
                                    v-for="nav in navList"
                                    :key="nav.id"
                                >
                                    <i class="nav-icon">{{ nav.icon }}</i>
                                    <span class="nav-label">{{ nav.label }}</span>
                                    <span v-if="nav.badge" class="nav-badge">{{ nav.badge }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #second>
                    <ResizableLayout direction="vertical" :default-size="430" :min-first-size="280" :gap="12">
                        <template #first>
                            <div class="panel-content nested-editor">
                                <div class="panel-header">
                                    <div class="header-left">
                                        <i class="icon">✏️</i>
                                        <h3>编辑器</h3>
                                    </div>
                                </div>
                                <div class="panel-body">
                                    <div class="editor-area">
                                        <div class="editor-line" v-for="(line, i) in editorContent" :key="i">
                                            <span class="line-num">{{ i + 1 }}</span>
                                            <span class="line-text">{{ line }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #second>
                            <div class="panel-content nested-console">
                                <div class="panel-header">
                                    <div class="header-left">
                                        <i class="icon">⚡</i>
                                        <h3>控制台</h3>
                                    </div>
                                </div>
                                <div class="panel-body">
                                    <div class="console-area">
                                        <div class="console-line" v-for="log in consoleLogs" :key="log.id">
                                            <span class="log-time">{{ log.time }}</span>
                                            <span :class="['log-badge', log.type]">{{ log.type }}</span>
                                            <span class="log-text">{{ log.message }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </ResizableLayout>
                </template>
            </ResizableLayout>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ResizableLayout from '@/components/ResizableLayout/index.vue';

    const currentDemo = ref('horizontal');

    // 文件列表
    const fileList = [
        { id: 1, name: 'src', icon: '📁', level: 0, count: 8 },
        { id: 2, name: 'components', icon: '📁', level: 1, count: 12 },
        { id: 3, name: 'Button.vue', icon: '📄', level: 2 },
        { id: 4, name: 'Input.vue', icon: '📄', level: 2 },
        { id: 5, name: 'Modal.vue', icon: '📄', level: 2 },
        { id: 6, name: 'views', icon: '📁', level: 1, count: 5 },
        { id: 7, name: 'Home.vue', icon: '📄', level: 2 },
        { id: 8, name: 'About.vue', icon: '📄', level: 2 },
        { id: 9, name: 'utils', icon: '📁', level: 1, count: 3 },
        { id: 10, name: 'helpers.ts', icon: '📄', level: 2 },
    ];

    // 代码行
    const codeLines = [
        '<span style="color: #c678dd">import</span> <span style="color: #e5c07b">{ ref }</span> <span style="color: #c678dd">from</span> <span style="color: #98c379">\'vue\'</span>',
        '',
        '<span style="color: #c678dd">const</span> <span style="color: #e06c75">count</span> = <span style="color: #61afef">ref</span>(<span style="color: #d19a66">0</span>)',
        '',
        '<span style="color: #c678dd">function</span> <span style="color: #61afef">increment</span>() {',
        '  count.value<span style="color: #56b6c2">++</span>',
        '}',
        '',
        '<span style="color: #c678dd">export</span> { increment }',
    ];

    // 指标数据
    const metrics = [
        {
            label: '总访问量',
            value: '45,821',
            change: '+ 12.5%',
            trend: 'up',
            progress: 75,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            label: '活跃用户',
            value: '8,234',
            change: '+ 8.2%',
            trend: 'up',
            progress: 62,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            label: '新增订单',
            value: '1,429',
            change: '- 3.1%',
            trend: 'down',
            progress: 45,
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            label: '收入统计',
            value: '¥38,920',
            change: '+ 15.7%',
            trend: 'up',
            progress: 88,
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
    ];

    // 时间线数据
    const timeline = [
        {
            id: 1,
            title: '创建新项目',
            desc: '张三创建了"后台管理系统"项目',
            time: '2分钟前',
            color: '#667eea',
        },
        {
            id: 2,
            title: '更新文档',
            desc: '李四更新了API接口文档',
            time: '15分钟前',
            color: '#f093fb',
        },
        {
            id: 3,
            title: '代码审查',
            desc: '王五完成了代码审查并合并了PR #123',
            time: '1小时前',
            color: '#4facfe',
        },
    ];

    // 导航列表
    const navList = [
        { id: 1, icon: '🏠', label: '首页', active: true },
        { id: 2, icon: '📁', label: '项目', badge: '5' },
        { id: 3, icon: '📊', label: '数据分析' },
        { id: 4, icon: '⚙️', label: '设置' },
        { id: 5, icon: '👤', label: '个人中心', badge: 'New' },
    ];

    // 编辑器内容
    const editorContent = [
        'function calculateSum(a, b) {',
        '  return a + b',
        '}',
        '',
        'const result = calculateSum(10, 20)',
        'console.log(result) // 30',
    ];

    // 控制台日志
    const consoleLogs = [
        { id: 1, time: '10:23:45', type: 'info', message: '应用启动成功' },
        { id: 2, time: '10:23:46', type: 'log', message: 'Result: 30' },
        { id: 3, time: '10:23:47', type: 'success', message: '代码执行完成' },
    ];
</script>

<style scoped lang="scss">
    .resizable-demo {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        min-height: 100%;
        overflow: hidden;
    }

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

    .demo-container {
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    .panel-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 10px;
        overflow: hidden;
        backdrop-filter: blur(10px);
    }

    .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: rgba(255, 255, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        flex-shrink: 0;

        .header-left {
            display: flex;
            align-items: baseline;
            gap: 8px;

            .icon {
                font-style: normal;
                font-size: 18px;
            }

            h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.95);
            }
        }

        .header-right {
            display: flex;
            gap: 8px;
        }
    }

    .panel-body {
        flex: 1;
        padding: 20px;
        overflow: auto;
        min-height: 0;

        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;

            &:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        }
    }

    // 文件树
    .file-tree {
        display: flex;
        flex-direction: column;
    }

    .tree-item {
        margin-bottom: 0;
    }

    .tree-node {
        display: flex;
        align-items: baseline;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .node-icon {
            font-style: normal;
            font-size: 15px;
            flex-shrink: 0;
        }

        .node-label {
            flex: 1;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.85);
        }

        .node-count {
            padding: 3px 8px 2px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
        }
    }

    // 代码预览
    .code-preview {
        background: #1e1e1e;
        border-radius: 8px;
        padding: 16px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.8;
    }

    .code-line {
        display: flex;
        gap: 16px;

        .line-number {
            color: rgba(255, 255, 255, 0.3);
            text-align: right;
            min-width: 30px;
            user-select: none;
        }

        .line-content {
            color: #d4d4d4;
            flex: 1;
        }
    }

    // 指标网格
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
    }

    .metric-card {
        padding: 20px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        transition: all 0.3s;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .metric-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;

            .metric-label {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.6);
                font-weight: 500;
            }

            .metric-change {
                font-size: 12px;
                font-weight: 600;
                padding: 3px 8px;
                border-radius: 6px;

                &.up {
                    background: rgba(67, 233, 123, 0.15);
                    color: #43e97b;
                }

                &.down {
                    background: rgba(245, 85, 108, 0.15);
                    color: #f5556c;
                }
            }
        }

        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 12px;
            line-height: 1;
        }

        .metric-bar {
            height: 4px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 2px;
            overflow: hidden;

            .metric-bar-fill {
                height: 100%;
                border-radius: 2px;
                transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
    }

    // 时间线
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .timeline-item {
        display: flex;
        gap: 16px;
        padding: 16px 0;
        position: relative;

        &:not(:last-child)::after {
            content: '';
            position: absolute;
            left: 7px;
            top: 40px;
            bottom: -16px;
            width: 2px;
            background: rgba(255, 255, 255, 0.06);
        }

        .timeline-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 4px;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 1;
        }

        .timeline-content {
            flex: 1;
            padding-bottom: 8px;

            .timeline-title {
                font-size: 15px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.95);
                margin-bottom: 6px;
            }

            .timeline-desc {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                margin-bottom: 6px;
            }

            .timeline-time {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
            }
        }
    }

    // 导航列表
    .nav-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .nav-item {
        display: flex;
        align-items: baseline;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        &.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
            border-left: 3px solid #667eea;
            padding-left: 13px;
        }

        .nav-icon {
            font-style: normal;
            font-size: 16px;
            flex-shrink: 0;
        }

        .nav-label {
            flex: 1;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.85);
        }

        .nav-badge {
            padding: 2px 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            font-size: 11px;
            color: #fff;
            font-weight: 600;
        }
    }

    // 编辑器区域
    .editor-area {
        background: #1e1e1e;
        border-radius: 8px;
        padding: 16px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        height: 100%;
    }

    .editor-line {
        display: flex;
        gap: 16px;
        line-height: 1.8;

        .line-num {
            color: rgba(255, 255, 255, 0.3);
            text-align: right;
            min-width: 24px;
            user-select: none;
        }

        .line-text {
            color: #d4d4d4;
            flex: 1;
        }
    }

    // 控制台区域
    .console-area {
        background: #1a1a1a;
        border-radius: 8px;
        padding: 12px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        height: 100%;
    }

    .console-line {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 8px;
        border-radius: 4px;
        margin-bottom: 4px;
        transition: background 0.2s;

        &:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        .log-time {
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            min-width: 70px;
        }

        .log-badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            min-width: 60px;
            text-align: center;

            &.info {
                background: rgba(64, 158, 255, 0.2);
                color: #79bbff;
            }

            &.log {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.8);
            }

            &.success {
                background: rgba(103, 194, 58, 0.2);
                color: #95d475;
            }

            &.warning {
                background: rgba(250, 173, 20, 0.2);
                color: #ffc53d;
            }
        }

        .log-text {
            flex: 1;
            color: rgba(255, 255, 255, 0.85);
        }
    }

    // 响应式
    @media (max-width: 1200px) {
        .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

        .metrics-grid {
            grid-template-columns: 1fr;
        }
    }

    // 滚动条美化
    * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    }

    *::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    *::-webkit-scrollbar-track {
        background: transparent;
    }

    *::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;

        &:hover {
            background: rgba(255, 255, 255, 0.15);
        }
    }
</style>
