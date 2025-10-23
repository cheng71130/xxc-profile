<template>
    <div class="demo-container">
        <h2>多样式 Loading 示例</h2>

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

        <!-- 示例 1: 简单用法（布尔值） -->
        <div class="demo-box">
            <h3>简单用法（默认样式）</h3>
            <el-table v-configurable-loading="loading1" :data="tableData" border style="width: 100%">
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
                border
                style="width: 100%"
            >
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="age" label="年龄" />
                <el-table-column prop="address" label="地址" />
            </el-table>
        </div>

        <!-- 示例 3: 深色背景 -->
        <div class="demo-box">
            <h3>深色背景适配</h3>
            <div
                v-configurable-loading="{
                    show: loading3,
                    type: currentStyle,
                    text: '处理中...',
                    color: 'var(--el-color-primary)',
                    background: 'rgba(0, 0, 0, 0.7)',
                }"
                class="dark-card"
            >
                <p>这是深色背景的卡片内容</p>
                <el-button @click="handleDarkCardClick">加载卡片内容</el-button>
            </div>
        </div>

        <!-- 示例 4: 不同颜色 -->
        <div class="demo-row">
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

<style scoped>
    .demo-container {
        padding: 20px;
    }

    h2,
    h3 {
        color: #e0e0e0;
        margin-bottom: 16px;
    }

    .controls {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        align-items: center;
    }

    .demo-box {
        margin-bottom: 30px;
    }

    .dark-card {
        padding: 40px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .dark-card p {
        color: #e0e0e0;
        font-size: 16px;
    }

    .demo-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .color-card {
        padding: 40px;
        border-radius: 8px;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .color-card:hover {
        transform: translateY(-4px);
    }

    .color-card p {
        font-size: 14px;
        font-weight: 500;
    }

    .color-card.red {
        background: rgba(245, 108, 108, 0.1);
        border: 1px solid rgba(245, 108, 108, 0.3);
        color: #f56c6c;
    }

    .color-card.green {
        background: rgba(103, 194, 58, 0.1);
        border: 1px solid rgba(103, 194, 58, 0.3);
        color: #67c23a;
    }

    .color-card.orange {
        background: rgba(230, 162, 60, 0.1);
        border: 1px solid rgba(230, 162, 60, 0.3);
        color: #e6a23c;
    }

    .color-card.purple {
        background: rgba(155, 89, 182, 0.1);
        border: 1px solid rgba(155, 89, 182, 0.3);
        color: #9b59b6;
    }
</style>
