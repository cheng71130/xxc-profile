<template>
    <div class="demo-container">
        <h2>多样式 Loading 插件</h2>
        <div class="demo-row">
            <div class="controls">
                <el-radio-group v-model="currentStyle">
                    <el-radio label="spinner">旋转圆环</el-radio>
                    <el-radio label="dots">三点跳动</el-radio>
                    <el-radio label="bars">竖条波浪</el-radio>
                    <el-radio label="ring">双环旋转</el-radio>
                    <el-radio label="pulse">脉冲圆</el-radio>
                    <el-radio label="gradient">渐变圆环</el-radio>
                </el-radio-group>
                <el-button type="primary" @click="toggleLoading">切换 Loading</el-button>
            </div>
        </div>
        <div class="demo-row">
            <!-- 示例 1: 简单用法（布尔值） -->
            <div class="demo-box">
                <h3>简单用法（默认样式）</h3>
                <el-table v-configurable-loading="loading1" :data="tableData" style="width: 100%">
                    <el-table-column prop="name" label="姓名" />
                    <el-table-column prop="age" label="年龄" />
                    <el-table-column prop="address" label="地址" />
                </el-table>
            </div>

            <!-- 示例 2: 对象配置（带文字） -->
            <div class="demo-box">
                <h3>自定义样式 + 文字</h3>
                <el-table
                    v-configurable-loading="{
                        show: loading2,
                        type: currentStyle,
                        text: '加载中...',
                        color: 'var(--el-color-primary)',
                    }"
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column prop="name" label="姓名" />
                    <el-table-column prop="age" label="年龄" />
                    <el-table-column prop="address" label="地址" />
                </el-table>
            </div>
        </div>
        <div class="demo-row">
            <!-- 示例 3: 深色背景 -->
            <div class="demo-box">
                <h3>深色背景适配</h3>
                <div
                    v-configurable-loading="{
                        show: loading3,
                        type: currentStyle,
                        color: 'var(--el-color-primary)',
                        background: 'rgba(0, 0, 0, 0.8)',
                    }"
                    class="dark-card"
                >
                    <p>这是深色背景的卡片内容</p>
                    <el-button @click="handleDarkCardClick">加载卡片内容</el-button>
                </div>
            </div>

            <!-- 示例 4: 不同颜色 -->
            <div class="demo-box">
                <h3>颜色设置</h3>
                <div class="color-grid">
                    <div
                        v-configurable-loading="{
                            show: loadingColors.red,
                            type: currentStyle,
                            color: '#f56c6c',
                        }"
                        class="color-card red"
                        @click="loadingColors.red = !loadingColors.red"
                    >
                        <p>红色 Loading</p>
                    </div>
                    <div
                        v-configurable-loading="{
                            show: loadingColors.green,
                            type: currentStyle,
                            color: '#67c23a',
                        }"
                        class="color-card green"
                        @click="loadingColors.green = !loadingColors.green"
                    >
                        <p>绿色 Loading</p>
                    </div>
                    <div
                        v-configurable-loading="{
                            show: loadingColors.orange,
                            type: currentStyle,
                            color: '#e6a23c',
                        }"
                        class="color-card orange"
                        @click="loadingColors.orange = !loadingColors.orange"
                    >
                        <p>橙色 Loading</p>
                    </div>
                    <div
                        v-configurable-loading="{
                            show: loadingColors.purple,
                            type: currentStyle,
                            color: '#9b59b6',
                        }"
                        class="color-card purple"
                        @click="loadingColors.purple = !loadingColors.purple"
                    >
                        <p>紫色 Loading</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const tableData = [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 28, address: '上海市浦东新区' },
        { name: '王五', age: 30, address: '广州市天河区' },
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
</script>

<style scoped lang="scss">
    .demo-container {
        width: 100%;
        height: 100%;

        h2 {
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 24px;
            font-weight: 600;
        }

        h3 {
            color: #f0f0f0;
            margin-bottom: 16px;
            font-weight: 500;
        }

        .demo-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-bottom: 30px;

            &:first-of-type {
                grid-template-columns: 1fr 1fr;

                .controls {
                    grid-column: 1 / 2;
                }
            }
        }

        .controls {
            display: flex;
            gap: 20px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.1);

            :deep(.el-radio-group) {
                flex: 1;
            }

            :deep(.el-radio) {
                margin-right: 20px;
                color: #e0e0e0;

                &.is-checked {
                    .el-radio__label {
                        color: var(--el-color-primary);
                    }
                }

                .el-radio__label {
                    color: #b0b0b0;
                }
            }
        }

        .demo-box {
            display: flex;
            flex-direction: column;

            h3 {
                flex-shrink: 0;
            }

            :deep(.el-table) {
                --el-table-bg-color: rgba(255, 255, 255, 0.02);
                --el-table-tr-bg-color: rgba(255, 255, 255, 0.02);
                --el-table-header-bg-color: rgba(255, 255, 255, 0.05);
                --el-table-border-color: rgba(255, 255, 255, 0.1);
                --el-table-text-color: #e0e0e0;
                --el-table-header-text-color: #f0f0f0;

                &::before {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                th.el-table__cell {
                    background-color: rgba(255, 255, 255, 0.05);
                    color: #f0f0f0;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                td.el-table__cell {
                    background-color: rgba(255, 255, 255, 0.02);
                    color: #e0e0e0;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                tr:hover > td {
                    background-color: rgba(255, 255, 255, 0.06) !important;
                }
            }

            :deep(.el-table__inner-wrapper::before) {
                height: 0;
            }
        }

        .dark-card {
            padding: 60px 40px;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            transition: all 0.3s ease;

            &:hover {
                border-color: rgba(255, 255, 255, 0.15);
                background: rgba(255, 255, 255, 0.06);
            }

            p {
                color: #f0f0f0;
                font-size: 16px;
                margin: 0;
            }
        }

        .color-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            flex: 1;
        }

        .color-card {
            padding: 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            &:hover {
                transform: translateY(-4px);

                &::before {
                    opacity: 1;
                }
            }

            &:active {
                transform: translateY(-2px);
            }

            p {
                font-size: 14px;
                font-weight: 500;
                margin: 0;
                position: relative;
                z-index: 1;
            }

            &.red {
                background: linear-gradient(135deg, rgba(245, 108, 108, 0.15) 0%, rgba(245, 108, 108, 0.05) 100%);
                border: 1px solid rgba(245, 108, 108, 0.4);
                color: #ff7979;

                &:hover {
                    border-color: rgba(245, 108, 108, 0.6);
                    box-shadow: 0 8px 20px rgba(245, 108, 108, 0.2);
                }
            }

            &.green {
                background: linear-gradient(135deg, rgba(103, 194, 58, 0.15) 0%, rgba(103, 194, 58, 0.05) 100%);
                border: 1px solid rgba(103, 194, 58, 0.4);
                color: #7ed956;

                &:hover {
                    border-color: rgba(103, 194, 58, 0.6);
                    box-shadow: 0 8px 20px rgba(103, 194, 58, 0.2);
                }
            }

            &.orange {
                background: linear-gradient(135deg, rgba(230, 162, 60, 0.15) 0%, rgba(230, 162, 60, 0.05) 100%);
                border: 1px solid rgba(230, 162, 60, 0.4);
                color: #f0b860;

                &:hover {
                    border-color: rgba(230, 162, 60, 0.6);
                    box-shadow: 0 8px 20px rgba(230, 162, 60, 0.2);
                }
            }

            &.purple {
                background: linear-gradient(135deg, rgba(155, 89, 182, 0.15) 0%, rgba(155, 89, 182, 0.05) 100%);
                border: 1px solid rgba(155, 89, 182, 0.4);
                color: #b77fd4;

                &:hover {
                    border-color: rgba(155, 89, 182, 0.6);
                    box-shadow: 0 8px 20px rgba(155, 89, 182, 0.2);
                }
            }
        }
    }
</style>
