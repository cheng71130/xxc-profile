<template>
    <div class="demo-container">
        <el-button type="primary" @click="openDrawer"> 打开抽屉 </el-button>

        <el-drawer v-model="visible" title="员工信息" size="60%" destroy-on-close @opened="handleOpened">
            <!-- 静态占位 -->
            <div v-if="loading" class="placeholder">⏳ 数据加载中...</div>

            <!-- 真实内容 -->
            <template v-else>
                <el-table :data="tableData" border>
                    <el-table-column prop="id" label="ID" width="80" />
                    <el-table-column prop="name" label="姓名" />

                    <el-table-column label="入职日期">
                        <template #default="{ row }">
                            <el-date-picker v-model="row.date1" type="date" placeholder="选择日期" />
                        </template>
                    </el-table-column>

                    <el-table-column label="转正日期">
                        <template #default="{ row }">
                            <el-date-picker v-model="row.date2" type="date" placeholder="选择日期" />
                        </template>
                    </el-table-column>

                    <el-table-column label="合同到期">
                        <template #default="{ row }">
                            <el-date-picker v-model="row.date3" type="date" placeholder="选择日期" />
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
    import { ref, shallowRef } from 'vue';

    // 类型定义
    interface EmployeeData {
        id: number;
        name: string;
        date1: Date | null;
        date2: Date | null;
        date3: Date | null;
    }

    // 响应式数据
    const visible = ref(false);
    const loading = ref(false);
    const tableData = shallowRef<EmployeeData[]>([]);

    // 缓存接口请求的 Promise
    let dataPromise: Promise<EmployeeData[]> | null = null;

    /**
     * 模拟接口请求
     * 实际项目中替换为真实的 API 调用
     */
    function fetchData(): Promise<EmployeeData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData: EmployeeData[] = Array.from({ length: 15 }, (_, i) => ({
                    id: i + 1,
                    name: `员工${i + 1}`,
                    date1: new Date(),
                    date2: new Date(),
                    date3: new Date(),
                }));
                resolve(mockData);
            }, 500); // 模拟接口耗时 500ms
        });
    }

    /**
     * 打开抽屉
     * 核心：不等待接口返回，让动画和请求并行执行
     */
    function openDrawer(): void {
        // 1. 打开抽屉，触发动画
        visible.value = true;

        // 2. 显示静态占位
        loading.value = true;

        // 3. 发起接口请求（关键：不使用 await，让它在后台执行）
        dataPromise = fetchData();

        console.log('✅ 抽屉已打开，动画执行中，接口请求已发起');
    }

    /**
     * 动画结束回调
     * 核心：等待接口完成后再渲染重型 DOM
     */
    async function handleOpened(): Promise<void> {
        console.log('✅ 动画结束，开始等待接口返回');

        if (dataPromise) {
            try {
                // 等待接口完成（可能已完成，也可能还在请求中）
                const data = await dataPromise;

                console.log('✅ 接口返回，开始渲染数据');

                // 赋值数据，触发重型 DOM 渲染
                tableData.value = data;

                // 隐藏占位
                loading.value = false;

                console.log('🎉 渲染完成');
            } catch (error) {
                console.error('❌ 接口请求失败', error);
                loading.value = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .demo-container {
        padding: 40px;
    }

    .placeholder {
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #999;
        background: #f9f9f9;
        border: 2px dashed #ddd;
        border-radius: 8px;
    }
</style>
