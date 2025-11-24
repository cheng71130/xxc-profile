<template>
    <div class="tabs-container">
        <div class="performance-info">
            <el-alert type="info" :closable="false">
                <template #title>
                    <div class="stats">
                        <span>当前激活: {{ activeTab }}</span>
                        <span>切换次数: {{ switchCount }}</span>
                        <span>平均切换耗时: {{ avgSwitchTime }}ms</span>
                        <span>渲染耗时: {{ renderTime }}ms</span>
                        <span>已渲染标签页: {{ renderedTabs.size }}/100</span>
                    </div>
                </template>
            </el-alert>
        </div>

        <el-tabs v-model="activeTab" type="border-card" @tab-change="handleTabChange">
            <el-tab-pane v-for="i in 100" :key="i" :label="`标签页 ${i}`" :name="`tab-${i}`">
                <!-- 使用 v-if 懒加载，只渲染访问过的标签页 -->
                <div v-if="renderedTabs.has(`tab-${i}`)" class="tab-content">
                    <el-card shadow="hover" class="content-card">
                        <template #header>
                            <div class="card-header">
                                <span>标签页 {{ i }} - 数据表格</span>
                                <el-tag>{{ getRandomType() }}</el-tag>
                            </div>
                        </template>

                        <el-table :data="generateTableData(i)" border stripe style="width: 100%">
                            <el-table-column prop="id" label="ID"/>
                            <el-table-column prop="name" label="姓名" />
                            <el-table-column prop="email" label="邮箱" />
                            <el-table-column prop="department" label="部门" />
                            <el-table-column prop="position" label="职位" />
                            <el-table-column prop="salary" label="薪资">
                                <template #default="{ row }">
                                    <el-tag type="success">¥{{ row.salary }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" label="状态">
                                <template #default="{ row }">
                                    <el-tag :type="row.status === '在职' ? 'success' : 'info'">
                                        {{ row.status }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right">
                                <template #default="{ row }">
                                    <el-button size="small" type="primary">编辑</el-button>
                                    <el-button size="small" type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="stats-cards">
                            <el-card v-for="j in 4" :key="j" class="stat-card">
                                <el-statistic :value="Math.floor(Math.random() * 10000)">
                                    <template #title>
                                        <div style="display: flex; align-items: center">统计项 {{ j }}</div>
                                    </template>
                                </el-statistic>
                            </el-card>
                        </div>

                        <el-form :model="getFormData(i)" label-width="100px" class="demo-form">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="输入框">
                                        <el-input v-model="getFormData(i).input" placeholder="请输入内容" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="选择器">
                                        <el-select v-model="getFormData(i).select" placeholder="请选择">
                                            <el-option label="选项1" value="1" />
                                            <el-option label="选项2" value="2" />
                                            <el-option label="选项3" value="3" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="日期选择">
                                        <el-date-picker
                                            v-model="getFormData(i).date"
                                            type="date"
                                            placeholder="选择日期"
                                            style="width: 100%"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="开关">
                                        <el-switch v-model="getFormData(i).switch" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                        <el-descriptions :column="3" border class="description-section">
                            <el-descriptions-item label="标签页编号">{{ i }}</el-descriptions-item>
                            <el-descriptions-item label="创建时间">{{
                                new Date().toLocaleString()
                            }}</el-descriptions-item>
                            <el-descriptions-item label="更新时间">{{
                                new Date().toLocaleString()
                            }}</el-descriptions-item>
                            <el-descriptions-item label="数据量"
                                >{{ generateTableData(i).length }} 条</el-descriptions-item
                            >
                            <el-descriptions-item label="状态">
                                <el-tag size="small">正常</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="备注">这是第 {{ i }} 个标签页的测试数据</el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                </div>
                <!-- 未渲染的显示占位 -->
                <div v-else class="tab-placeholder">
                    <el-empty description="切换到此标签页即可加载内容" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';

    const activeTab = ref('tab-1');
    const switchCount = ref(0);
    const renderTime = ref(0);
    const switchTimes = ref<number[]>([]);
    const avgSwitchTime = ref(0);

    // 记录已渲染的标签页
    const renderedTabs = ref<Set<string>>(new Set(['tab-1'])); // 默认渲染第一个

    // 每个标签页独立的表单数据
    const formDataMap = ref<Map<number, any>>(new Map());

    const getFormData = (tabIndex: number) => {
        if (!formDataMap.value.has(tabIndex)) {
            formDataMap.value.set(tabIndex, {
                input: '',
                select: '',
                date: '',
                switch: false,
            });
        }
        return formDataMap.value.get(tabIndex);
    };

    // 生成随机类型
    const getRandomType = () => {
        const types = ['success', 'info', 'warning', 'danger'];
        return types[Math.floor(Math.random() * types.length)];
    };

    // 生成表格数据（缓存）
    const tableDataCache = new Map<number, any[]>();
    const generateTableData = (tabIndex: number) => {
        if (tableDataCache.has(tabIndex)) {
            return tableDataCache.get(tabIndex)!;
        }

        const data = [];
        const count = 10;
        const departments = ['技术部', '产品部', '市场部', '人力资源部', '财务部'];
        const positions = ['工程师', '经理', '总监', '专员', '主管'];

        for (let i = 1; i <= count; i++) {
            data.push({
                id: `${tabIndex}-${i}`,
                name: `员工${tabIndex}-${i}`,
                email: `user${tabIndex}${i}@example.com`,
                department: departments[Math.floor(Math.random() * departments.length)],
                position: positions[Math.floor(Math.random() * positions.length)],
                salary: Math.floor(Math.random() * 20000) + 5000,
                status: Math.random() > 0.2 ? '在职' : '离职',
            });
        }

        tableDataCache.set(tabIndex, data);
        return data;
    };

    // 标签页切换处理
    const handleTabChange = (tabName: string | number) => {
        const startTime = performance.now();

        // 标记该标签页为已渲染
        renderedTabs.value.add(tabName as string);

        switchCount.value++;

        // 使用 nextTick 确保 DOM 更新完成
        requestAnimationFrame(() => {
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            switchTimes.value.push(duration);

            // 只保留最近20次的切换时间，避免数组过大
            if (switchTimes.value.length > 20) {
                switchTimes.value.shift();
            }

            const sum = switchTimes.value.reduce((a, b) => a + b, 0);
            avgSwitchTime.value = Math.round(sum / switchTimes.value.length);

            console.log(`切换到 ${tabName}, 耗时: ${duration}ms, 已渲染标签页: ${renderedTabs.value.size}/100`);
        });
    };

    // 记录初始渲染时间
    onMounted(() => {
        const startTime = performance.now();
        requestAnimationFrame(() => {
            renderTime.value = Math.round(performance.now() - startTime);
            console.log(`初始渲染耗时: ${renderTime.value}ms`);
        });
    });
</script>

<style scoped lang="scss">
    .tabs-container {
        padding: 20px;

        .performance-info {
            margin-bottom: 20px;

            .stats {
                display: flex;
                gap: 30px;
                font-size: 14px;

                span {
                    font-weight: 500;
                }
            }
        }

        .tab-content {
            padding: 20px;

            .content-card {
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .stats-cards {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin: 20px 0;

                    .stat-card {
                        text-align: center;
                    }
                }

                .demo-form {
                    margin: 20px 0;
                    padding: 20px;
                    background-color: #f5f7fa;
                    border-radius: 4px;
                }

                .description-section {
                    margin-top: 20px;
                }
            }
        }

        .tab-placeholder {
            padding: 100px 20px;
            text-align: center;
        }
    }

    :deep(.el-tabs__content) {
        overflow: visible;
    }
</style>
