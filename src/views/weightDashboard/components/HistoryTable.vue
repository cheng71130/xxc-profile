<template>
    <div class="history-card panel-card">
        <div class="wd-card-head">
            <div>
                <h3 class="wd-card-title">历史记录</h3>
                <p class="wd-card-desc">点击任意行可编辑，右侧按钮可删除该条记录。</p>
            </div>
            <span class="record-count">共 <strong class="wd-font-num">{{ records.length }}</strong> 条</span>
        </div>

        <div class="table-scroll wd-scroll">
            <table class="history-table">
                <colgroup>
                    <col class="col-date" />
                    <col class="col-weight" />
                    <col class="col-weight" />
                    <col class="col-diff" />
                    <col class="col-note" />
                    <col class="col-action" />
                </colgroup>
                <thead>
                    <tr>
                        <th class="text-left col-date">日期</th>
                        <th class="text-center col-morning">早称</th>
                        <th class="text-center col-evening">晚称</th>
                        <th class="text-center">差值</th>
                        <th class="text-left col-note">事件备注</th>
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
                        <td class="text-left wd-font-num date-cell">{{ record.date }}</td>
                        <td class="text-center wd-font-num col-morning">
                            {{ formatWeight(record.morning) }}
                        </td>
                        <td class="text-center wd-font-num col-evening">
                            {{ formatWeight(record.evening) }}
                        </td>
                        <td class="text-center wd-font-num diff-cell">
                            {{ formatDiff(record) }}
                        </td>
                        <td class="text-left note-cell">
                            <span v-if="record.note" class="note-pill">{{ record.note }}</span>
                            <span v-else class="dash">—</span>
                        </td>
                        <td class="text-center col-action">
                            <button
                                class="delete-btn"
                                title="删除"
                                @click.stop="handleDelete(record)"
                            >
                                <el-icon><Delete /></el-icon>
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
import { Delete } from '@element-plus/icons-vue';
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
@use '../styles/shared.scss';

.history-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
}

.record-count {
    flex-shrink: 0;
    padding: 5px 11px;
    border: 1px solid var(--wd-line-strong);
    border-radius: 999px;
    background: #fff;
    font-size: 12px;
    color: var(--wd-ink-soft);
    white-space: nowrap;

    strong {
        color: #0284c7;
    }
}

.table-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    border-radius: var(--wd-radius-md);
    border: 1px solid #e7eef5;
    background: #fff;
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    table-layout: fixed;

    .col-date { width: 112px; }
    .col-weight { width: 72px; }
    .col-diff { width: 64px; }
    .col-action { width: 56px; }

    thead {
        position: sticky;
        top: 0;
        z-index: 2;

        th {
            background: #f8fafc;
            padding: 11px 12px;
            text-align: center;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--wd-ink-muted);
            border-bottom: 1px solid #e2e8f0;
            white-space: nowrap;

            &.text-left,
            &.col-note,
            &.col-date {
                text-align: left;
            }
        }
    }

    tbody td {
        padding: 10px 12px;
        border-bottom: 1px solid #edf2f7;
        color: #344054;
        cursor: pointer;
        text-align: center;
        vertical-align: middle;

        &.date-cell,
        &.note-cell {
            text-align: left;
        }
    }

    tbody tr {
        background: #fff;
        transition: background 0.15s;

        &:hover {
            background: #f0f9ff;
        }

        &.row-even {
            background: #fbfdff;

            &:hover {
                background: #f0f9ff;
            }
        }

        &.row-note {
            background: #fffcf0;

            &:hover {
                background: #fff7d6;
            }
        }
    }
}

.text-center { text-align: center; }
.text-left { text-align: left; }

.note-cell {
    .note-pill,
    .dash {
        display: inline-block;
        text-align: left;
    }
}

.col-morning { color: #0284c7 !important; }
.col-evening { color: #db2777 !important; }

.date-cell {
    white-space: nowrap;
    font-size: 12px;
}

.diff-cell {
    font-weight: 700;
}

.note-pill {
    display: inline-block;
    max-width: 100%;
    padding: 3px 9px;
    border-radius: 999px;
    background: #fff7d6;
    color: #92400e;
    border: 1px solid #fde68a;
    font-size: 12px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}

.dash {
    color: #cbd5e1;
}

.empty-row {
    text-align: center !important;
    color: #98a2b3 !important;
    padding: 36px !important;
    cursor: default !important;
}

.delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    border-radius: var(--wd-radius-sm);
    background: transparent;
    color: #98a2b3;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;

    &:hover {
        background: #fef3f2;
        border-color: #fecdca;
        color: #d92d20;
    }
}
</style>
