<template>
    <div class="history-card panel-card">
        <div class="history-card__header">
            <div>
                <h3 class="card-title">历史记录</h3>
                <p class="card-desc">点击任意行可进行编辑，右侧垃圾桶按钮可删除该条记录。</p>
            </div>
            <span class="record-count">共 <strong class="font-mono">{{ records.length }}</strong> 条</span>
        </div>

        <div class="table-scroll">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>日期</th>
                        <th class="text-right col-morning">早称</th>
                        <th class="text-right col-evening">晚称</th>
                        <th class="text-right">差值</th>
                        <th>事件备注</th>
                        <th class="text-center col-action">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="records.length === 0">
                        <td colspan="6" class="empty-row">还没有任何记录，先在上方添加一条吧。</td>
                    </tr>
                    <tr
                        v-for="(record, idx) in records"
                        :key="record.id"
                        :class="{
                            'row-even': idx % 2 === 1,
                            'row-note': !!record.note,
                        }"
                        @click="emit('edit', record)"
                    >
                        <td class="font-mono date-cell">{{ record.date }}</td>
                        <td class="text-right font-mono col-morning">
                            {{ formatWeight(record.morning) }}
                        </td>
                        <td class="text-right font-mono col-evening">
                            {{ formatWeight(record.evening) }}
                        </td>
                        <td class="text-right font-mono">
                            {{ formatDiff(record) }}
                        </td>
                        <td>
                            <span v-if="record.note" class="note-pill">{{ record.note }}</span>
                            <span v-else class="dash">—</span>
                        </td>
                        <td class="text-center col-action">
                            <button
                                class="delete-btn"
                                title="删除"
                                @click.stop="handleDelete(record)"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import type { WeightRecord } from '../types';
import { calcDiff, formatWeight } from '../utils';

defineProps<{ records: WeightRecord[] }>();

const emit = defineEmits<{
    edit: [record: WeightRecord];
    delete: [id: string];
}>();

function formatDiff(record: WeightRecord): string {
    const diff = calcDiff(record.morning, record.evening);
    if (diff === null) return '—';
    return (diff > 0 ? '+' : '') + diff.toFixed(1);
}

async function handleDelete(record: WeightRecord) {
    try {
        await ElMessageBox.confirm(
            '确定要删除这条记录吗？此操作不可撤销。',
            '删除确认',
            { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' },
        );
        emit('delete', record.id);
    } catch {
        /* cancelled */
    }
}
</script>

<style scoped lang="scss">
.history-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-shrink: 0;
        margin-bottom: 12px;
    }
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.card-desc {
    font-size: 12px;
    color: #94a3b8;
    margin: 4px 0 0;
}

.record-count {
    font-size: 12px;
    color: #64748b;
    white-space: nowrap;

    strong {
        color: #0ea5e9;
    }
}

.table-scroll {
    flex: 1;
    overflow: auto;
    min-height: 0;
    border-radius: 10px;
    border: 1px solid #f1f5f9;
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    thead {
        position: sticky;
        top: 0;
        z-index: 1;

        th {
            background: #f8fafc;
            padding: 10px 12px;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
            white-space: nowrap;
        }
    }

    tbody td {
        padding: 9px 12px;
        border-bottom: 1px solid #f1f5f9;
        color: #334155;
        cursor: pointer;
    }

    tbody tr {
        background: #fff;
        transition: background 0.15s;

        &:hover {
            background: #f0f9ff;
        }

        &.row-even {
            background: #fafbfc;

            &:hover {
                background: #f0f9ff;
            }
        }

        &.row-note {
            background: #fffbeb;

            &:hover {
                background: #fef3c7;
            }

            &.row-even {
                background: #fffbeb;
            }
        }
    }
}

.text-right { text-align: right; }
.text-center { text-align: center; }

.col-morning { color: #0ea5e9 !important; }
.col-evening { color: #f472b6 !important; }

.col-action {
    width: 56px;
}

.date-cell {
    white-space: nowrap;
}

.note-pill {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
    background: #fef9c3;
    color: #854d0e;
    font-size: 12px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dash {
    color: #cbd5e1;
}

.empty-row {
    text-align: center !important;
    color: #94a3b8 !important;
    padding: 32px !important;
    cursor: default !important;
}

.delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;

    &:hover {
        background: #fee2e2;
        color: #dc2626;
    }
}

.font-mono {
    font-family: 'Courier New', Courier, monospace;
}
</style>
