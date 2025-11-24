<template>
    <div class="demo-container animate__animated animate__fadeIn">
        <h3>🎯 防抖 (Debounce)</h3>
        <div class="demo-row">
            <div class="demo-box">
                <h4>简单用法 (300ms)</h4>
                <el-button v-debounce="handleSimpleDebounce" type="primary"> 点击触发 (防抖) </el-button>
                <p class="count">触发次数: {{ debounceCount1 }}</p>
            </div>

            <div class="demo-box">
                <h4>立即执行 (500ms)</h4>
                <el-button
                    v-debounce="{
                        handler: handleImmediateDebounce,
                        delay: 500,
                        immediate: true,
                    }"
                    type="success"
                >
                    点击触发 (立即执行)
                </el-button>
                <p class="count">触发次数: {{ debounceCount2 }}</p>
            </div>

            <div class="demo-box">
                <h4>输入框防抖</h4>
                <el-input
                    v-debounce="{
                        handler: handleInputDebounce,
                        delay: 800,
                        event: 'input',
                    }"
                    v-model="searchText"
                    placeholder="输入搜索..."
                    clearable
                />
                <p class="search-info">搜索: {{ searchResult }}</p>
                <p class="count">搜索次数: {{ debounceCount3 }}</p>
            </div>
        </div>

        <h3>⚡ 节流 (Throttle)</h3>
        <div class="demo-row">
            <div class="demo-box">
                <h4>简单用法 (1000ms)</h4>
                <el-button v-throttle="handleSimpleThrottle" type="primary"> 连续点击 (节流) </el-button>
                <p class="count">触发次数: {{ throttleCount1 }}</p>
            </div>

            <div class="demo-box">
                <h4>禁用首次 (leading: false)</h4>
                <el-button
                    v-throttle="{
                        handler: handleNoLeadingThrottle,
                        delay: 1000,
                        leading: false,
                    }"
                    type="warning"
                >
                    连续点击 (禁用首次)
                </el-button>
                <p class="count">触发次数: {{ throttleCount2 }}</p>
            </div>

            <div class="demo-box">
                <h4>禁用尾调用 (trailing: false)</h4>
                <el-button
                    v-throttle="{
                        handler: handleNoTrailingThrottle,
                        delay: 1000,
                        trailing: false,
                    }"
                    type="danger"
                >
                    连续点击 (禁用尾调用)
                </el-button>
                <p class="count">触发次数: {{ throttleCount3 }}</p>
            </div>
        </div>

        <h3>📜 滚动事件节流</h3>
        <div class="demo-row">
            <div class="demo-box full-width">
                <div
                    v-throttle="{
                        handler: handleScroll,
                        delay: 200,
                        event: 'scroll',
                    }"
                    class="scroll-container"
                >
                    <div class="scroll-content">
                        <p v-for="i in 50" :key="i">滚动内容 {{ i }}</p>
                    </div>
                </div>
                <div class="scroll-info">
                    <p>滚动位置: {{ scrollTop }}px</p>
                    <p>触发次数: {{ scrollCount }}</p>
                </div>
            </div>
        </div>

        <h3>🔄 对比演示</h3>
        <div class="demo-row">
            <div class="comparison-grid">
                <div class="demo-box">
                    <h4>普通点击 (无限制)</h4>
                    <el-button @click="handleNormal" type="info"> 疯狂点击 </el-button>
                    <p class="count">{{ normalCount }}</p>
                </div>

                <div class="demo-box">
                    <h4>防抖 (300ms)</h4>
                    <el-button v-debounce="handleDebounceCompare" type="primary"> 疯狂点击 </el-button>
                    <p class="count">{{ debounceCompareCount }}</p>
                </div>

                <div class="demo-box">
                    <h4>节流 (300ms)</h4>
                    <el-button v-throttle="{ handler: handleThrottleCompare, delay: 300 }" type="success">
                        疯狂点击
                    </el-button>
                    <p class="count">{{ throttleCompareCount }}</p>
                </div>
            </div>
        </div>
        <p class="tip">💡 试试连续快速点击,观察三者的区别</p>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

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
        console.log('防抖触发', debounceCount1.value);
    };

    const handleImmediateDebounce = () => {
        debounceCount2.value++;
        console.log('立即执行防抖触发', debounceCount2.value);
    };

    const handleInputDebounce = (e: Event) => {
        debounceCount3.value++;
        searchResult.value = (e.target as HTMLInputElement).value;
        console.log('搜索:', searchResult.value);
    };

    // 节流处理函数
    const handleSimpleThrottle = () => {
        throttleCount1.value++;
        console.log('节流触发', throttleCount1.value);
    };

    const handleNoLeadingThrottle = () => {
        throttleCount2.value++;
        console.log('禁用首次节流触发', throttleCount2.value);
    };

    const handleNoTrailingThrottle = () => {
        throttleCount3.value++;
        console.log('禁用尾调用节流触发', throttleCount3.value);
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
</script>

<style scoped lang="scss">
    .demo-container {
        width: 100%;

        h3 {
            color: #f0f0f0;
            margin: 30px 0 20px;
            font-size: 20px;
        }

        h3:first-child {
            margin-top: 0;
        }

        h4 {
            color: #d0d0d0;
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 500;
        }
    }

    .demo-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 20px;
    }

    .demo-box {
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);

        &.full-width {
            grid-column: 1 / -1;
        }

        .count {
            margin-top: 12px;
            color: var(--el-color-primary);
            font-size: 18px;
            font-weight: 600;
        }

        .search-info {
            margin-top: 12px;
            color: #b0b0b0;
            font-size: 14px;
        }
    }

    .scroll-container {
        height: 300px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 16px;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }

        .scroll-content p {
            color: #d0d0d0;
            padding: 8px;
            margin: 4px 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
        }
    }

    .scroll-info {
        margin-top: 16px;
        display: flex;
        gap: 24px;

        p {
            color: #b0b0b0;
            font-size: 14px;
        }
    }

    .comparison-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        grid-column: 1 / -1;
    }

    .tip {
        margin-top: 20px;
        padding: 12px 16px;
        background: rgba(64, 158, 255, 0.1);
        border-left: 3px solid var(--el-color-primary);
        border-radius: 4px;
        color: #b0b0b0;
        font-size: 14px;
    }
</style>
