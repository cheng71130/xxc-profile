<template>
    <div style="padding: 20px">
        <h3>测试4：失焦销毁版（完美方案）</h3>
        <el-button type="primary" @click="drawerVisible = true">打开抽屉</el-button>

        <el-drawer v-model="drawerVisible" title="配置薪酬项" size="70%" destroy-on-close>
            <div class="drawer-body">
                <el-button @click="loadData">加载30行数据</el-button>
                <el-table :data="tableData" border height="100%" v-loading="loading">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column label="薪酬种类" prop="configName" align="center" />
                    <el-table-column label="薪酬编码" prop="configCode" align="center">
                        <template #default="{ row }">
                            <el-tag type="primary">{{ row.configCode }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="特殊值" align="center">
                        <template #default="{ row }">
                            <template v-if="row.configProperties === 0">
                                <el-input-number
                                    v-model="row.configSpecial"
                                    :precision="2"
                                    :controls="false"
                                    placeholder="请输入"
                                    style="width: 100%"
                                    align="left"
                                />
                            </template>
                            <template v-else-if="row.configProperties === 1">
                                <el-select v-model="row.configSpecial" placeholder="请选择" style="width: 100%">
                                    <el-option label="选项1" value="1" />
                                    <el-option label="选项2" value="2" />
                                </el-select>
                            </template>
                            <template v-else>
                                <el-select
                                    v-model="row.configSpecial"
                                    placeholder="请选择"
                                    multiple
                                    style="width: 100%"
                                >
                                    <el-option label="选项A" value="A" />
                                    <el-option label="选项B" value="B" />
                                </el-select>
                            </template>
                        </template>
                    </el-table-column>

                    <!-- 生效开始时间 -->
                    <el-table-column label="生效开始时间" align="center">
                        <template #default="{ row }">
                            <el-date-picker
                                v-if="activeDatePickers[`${row.configRecordId}_start`]"
                                :ref="(el:any) => setPickerRef(el, row.configRecordId, 'start')"
                                v-model="row.effectiveStart"
                                type="date"
                                placeholder="请选择日期"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                style="width: 100%"
                                @blur="deactivatePicker(row.configRecordId, 'start')"
                                @visible-change="(visible:any) => handleVisibleChange(visible, row.configRecordId, 'start')"
                            />
                            <el-input
                                v-else
                                :model-value="row.effectiveStart"
                                placeholder="请选择日期"
                                readonly
                                style="width: 100%"
                                @mousedown.prevent="activatePicker(row.configRecordId, 'start')"
                            >
                                <template #prefix>
                                    <el-icon><Calendar /></el-icon>
                                </template>
                            </el-input>
                        </template>
                    </el-table-column>

                    <!-- 生效结束时间 -->
                    <el-table-column label="生效结束时间" align="center">
                        <template #default="{ row }">
                            <el-date-picker
                                v-if="activeDatePickers[`${row.configRecordId}_end`]"
                                :ref="(el:any) => setPickerRef(el, row.configRecordId, 'end')"
                                v-model="row.effectiveEnd"
                                type="date"
                                placeholder="请选择日期"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                style="width: 100%"
                                @blur="deactivatePicker(row.configRecordId, 'end')"
                                @visible-change="(visible:any) => handleVisibleChange(visible, row.configRecordId, 'end')"
                            />
                            <el-input
                                v-else
                                :model-value="row.effectiveEnd"
                                placeholder="请选择日期"
                                readonly
                                style="width: 100%"
                                @mousedown.prevent="activatePicker(row.configRecordId, 'end')"
                            >
                                <template #prefix>
                                    <el-icon><Calendar /></el-icon>
                                </template>
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <template #footer>
                <el-button>取消</el-button>
                <el-button type="primary">确定</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, nextTick } from 'vue';
    import { Calendar } from '@element-plus/icons-vue';

    interface SalaryConfigItem {
        configRecordId: number;
        configName: string;
        configCode: string;
        configProperties: number;
        configSpecial: string | number | string[] | null;
        effectiveStart: string | null;
        effectiveEnd: string | null;
    }

    const drawerVisible = ref(false);
    const loading = ref(false);
    const tableData = ref<SalaryConfigItem[]>([]);
    const activeDatePickers = reactive<Record<string, boolean>>({});
    const pickerRefs = reactive<Record<string, any>>({});
    const pickerPanelVisible = reactive<Record<string, boolean>>({});

    const setPickerRef = (el: any, id: number, type: 'start' | 'end') => {
        if (el) {
            pickerRefs[`${id}_${type}`] = el;
        }
    };

    // 激活方式
    const activatePicker = (id: number, type: 'start' | 'end') => {
        const key = `${id}_${type}`;
        activeDatePickers[key] = true;

        nextTick(() => {
            setTimeout(() => {
                const picker = pickerRefs[key];
                if (!picker) return;

                try {
                    let inputElement = null;

                    if (picker.$el) {
                        if (picker.$el instanceof HTMLElement) {
                            inputElement = picker.$el.querySelector('input');
                        } else if (picker.$el.tagName === 'INPUT') {
                            inputElement = picker.$el;
                        }
                    }

                    if (!inputElement && picker.$refs?.reference) {
                        const refEl = picker.$refs.reference;
                        if (refEl instanceof HTMLElement) {
                            inputElement = refEl.querySelector('input') || refEl;
                        } else if (refEl.$el instanceof HTMLElement) {
                            inputElement = refEl.$el.querySelector('input') || refEl.$el;
                        }
                    }

                    if (!inputElement && picker.$el instanceof HTMLElement) {
                        inputElement = picker.$el.querySelector('input');
                    }

                    if (inputElement && inputElement instanceof HTMLInputElement) {
                        inputElement.focus();
                        inputElement.click();
                    }

                    if (typeof picker.focus === 'function') {
                        picker.focus();
                    }
                    if (typeof picker.handleOpen === 'function') {
                        picker.handleOpen();
                    }
                    if (typeof picker.handleFocus === 'function') {
                        picker.handleFocus();
                    }
                } catch (error) {
                    console.warn('Failed to activate date picker:', error);
                }
            }, 0);
        });
    };

    // 失焦时销毁
    const deactivatePicker = (id: number, type: 'start' | 'end') => {
        const key = `${id}_${type}`;

        // 延迟检查，只有面板关闭时才销毁
        setTimeout(() => {
            if (!pickerPanelVisible[key]) {
                delete activeDatePickers[key];
                delete pickerRefs[key];
            }
        }, 200);
    };

    // 监听面板打开/关闭 - 只记录状态，不自动销毁
    const handleVisibleChange = (visible: boolean, id: number, type: 'start' | 'end') => {
        const key = `${id}_${type}`;

        if (visible) {
            // 面板打开
            pickerPanelVisible[key] = true;
        } else {
            // 面板关闭 - 只标记状态，不销毁
            pickerPanelVisible[key] = false;
            // 删除这里的自动销毁逻辑，等待 blur 事件触发
        }
    };

    const loadData = () => {
        loading.value = true;

        requestAnimationFrame(() => {
            tableData.value = Array.from({ length: 30 }, (_, i) => ({
                configRecordId: i + 1,
                configName: `薪酬项${i + 1}`,
                configCode: `CODE${String(i + 1).padStart(3, '0')}`,
                configProperties: i % 3,
                configSpecial: i % 3 === 0 ? null : i % 3 === 1 ? '' : [],
                effectiveStart: '',
                effectiveEnd: '',
            }));
            loading.value = false;
        });
    };
</script>

<style scoped lang="scss">
    .drawer-body {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>
