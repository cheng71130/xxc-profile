<template>
    <div class="advanced-table-container">
        <!-- 工具栏 -->
        <div class="table-toolbar">
            <div class="toolbar-left">
                <el-input
                    v-model="searchTerm"
                    placeholder="全局搜索"
                    prefix-icon="Search"
                    clearable
                    style="width: 300px"
                />
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <div class="toolbar-right">
                <span class="stats-text">
                    共 {{ processedData.length }} 条记录
                    <span v-if="processedData.length !== totalDataCount" class="filtered-text">
                        （从 {{ totalDataCount }} 条中筛选）
                    </span>
                </span>
            </div>
        </div>

        <!-- 表格主体 -->
        <el-table-v2
            :columns="tableColumns"
            :data="processedData"
            :width="1300"
            :height="600"
            :header-height="50"
            :row-height="48"
            fixed
        />

        <!-- 新增/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
            <el-form :model="formData" label-width="50px" class="form-grid">
                <el-form-item v-for="column in columns" :key="column.key" :label="column.title" class="form-item">
                    <el-input v-model="formData[column.dataKey]" placeholder="请输入内容" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSave">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, h } from 'vue';
    import { ElMessage, ElMessageBox, ElButton } from 'element-plus';

    interface ColumnConfig {
        key: string;
        dataKey: string;
        title: string;
        width: number;
    }

    interface RowData {
        id: string;
        [key: string]: any;
    }

    // 生成列配置
    const generateColumns = (length = 10, prefix = 'column-'): ColumnConfig[] =>
        Array.from({ length }).map((_, columnIndex) => ({
            key: `${prefix}${columnIndex}`,
            dataKey: `${prefix}${columnIndex}`,
            title: `列 ${columnIndex + 1}`,
            width: 120,
        }));

    // 生成数据
    const generateData = (columns: ColumnConfig[], length = 1000, prefix = 'row-'): RowData[] =>
        Array.from({ length }).map((_, rowIndex) => {
            return columns.reduce(
                (rowData, column, columnIndex) => {
                    rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
                    return rowData;
                },
                {
                    id: `${prefix}${rowIndex}`,
                } as RowData
            );
        });

    // 基础数据
    const columns = ref<ColumnConfig[]>(generateColumns(10));
    const rawData = ref<RowData[]>(generateData(columns.value, 1000));
    const totalDataCount = computed(() => rawData.value.length);

    // 状态管理
    const searchTerm = ref('');
    const dialogVisible = ref(false);
    const dialogTitle = ref('新增记录');
    const formData = ref<Record<string, any>>({});
    const editingId = ref<string | null>(null);

    // 新增
    const handleAdd = () => {
        editingId.value = null;
        dialogTitle.value = '新增记录';
        formData.value = {};
        columns.value.forEach((col) => {
            formData.value[col.dataKey] = '';
        });
        dialogVisible.value = true;
    };

    // 编辑
    const handleEdit = (row: RowData) => {
        editingId.value = row.id;
        dialogTitle.value = '编辑记录';
        formData.value = { ...row };
        dialogVisible.value = true;
    };

    // 删除
    const handleDelete = (row: RowData) => {
        ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                const index = rawData.value.findIndex((item) => item.id === row.id);
                if (index > -1) {
                    rawData.value.splice(index, 1);
                    ElMessage.success('删除成功');
                }
            })
            .catch(() => {
                // 取消删除
            });
    };

    // 保存
    const handleSave = () => {
        if (editingId.value) {
            // 编辑
            const index = rawData.value.findIndex((item) => item.id === editingId.value);
            if (index > -1) {
                rawData.value[index] = {
                    ...formData.value,
                    id: editingId.value,
                };
                ElMessage.success('编辑成功');
            }
        } else {
            // 新增
            const newId = `row-${Date.now()}`;
            rawData.value.unshift({
                ...formData.value,
                id: newId,
            });
            ElMessage.success('新增成功');
        }
        dialogVisible.value = false;
    };

    // 数据处理：搜索
    const processedData = computed(() => {
        let filtered = [...rawData.value];

        // 全局搜索
        if (searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filtered = filtered.filter((row) =>
                Object.values(row).some((val) => String(val).toLowerCase().includes(term))
            );
        }

        return filtered;
    });

    // 表格列配置
    const tableColumns = computed(() => {
        const dataColumns = columns.value.map((column) => ({
            key: column.key,
            dataKey: column.dataKey,
            title: column.title,
            width: column.width,
            align: 'center' as const,
            headerAlign: 'center' as const,
            cellRenderer: ({ rowData }: { rowData: RowData }) => {
                return h('div', { class: 'custom-cell' }, rowData[column.dataKey]);
            },
        }));

        // 添加操作列 - 右侧固定
        const actionColumn = {
            key: 'actions',
            dataKey: 'actions',
            title: '操作',
            width: 150,
            align: 'center' as const,
            headerAlign: 'center' as const,
            fixed: 'right' as const,
            cellRenderer: ({ rowData }: { rowData: RowData }) => {
                return h('div', { class: 'action-buttons' }, [
                    h(
                        ElButton,
                        {
                            type: 'primary',
                            link: true,
                            onClick: () => handleEdit(rowData),
                        },
                        { default: () => '编辑' }
                    ),
                    h(
                        ElButton,
                        {
                            type: 'danger',
                            link: true,
                            onClick: () => handleDelete(rowData),
                        },
                        { default: () => '删除' }
                    ),
                ]);
            },
        };

        return [...dataColumns, actionColumn];
    });
</script>

<style scoped lang="scss">
    .advanced-table-container {
        // padding: 20px;
        // background: #f5f7fa;
        // border-radius: 8px;

        .table-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            // padding: 16px;
            // background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

            .toolbar-left {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .toolbar-right {
                display: flex;
                align-items: center;
                margin-right: 20px;

                .stats-text {
                    font-size: 14px;
                    color: #fff;
                    font-weight: 500;

                    .filtered-text {
                        color: #909399;
                        font-weight: normal;
                    }
                }
            }
        }

        .custom-cell {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            text-align: center;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        /* Dialog 表单网格布局 */
        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 20px;

            .form-item {
                margin-bottom: 0;
            }
        }

        /* 表格样式 */
        :deep(.el-table-v2) {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

            .el-table-v2__header-row {
                background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%) !important;
            }

            .el-table-v2__header-cell {
                background: transparent !important;
                color: white !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .el-table-v2__row {
                &:hover {
                    background: #f5f7fa !important;
                }

                &:nth-child(even) {
                    background: #fafafa;
                }
            }

            .el-table-v2__row-cell {
                border-bottom: 1px solid #ebeef5;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* 固定列阴影效果 */
            .el-table-v2__fixed-right {
                box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
