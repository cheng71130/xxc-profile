<template>
    <div class="form-card panel-card" :class="{ 'form-card--editing': editingId }">
        <div class="wd-card-head">
            <div>
                <h3 class="wd-card-title">{{ editingId ? '编辑记录' : '记录今日体重' }}</h3>
                <p class="wd-card-desc">输入早晚体重与备注，帮助你回顾每一次波动的原因。</p>
            </div>
            <span v-if="editingId" class="edit-badge">编辑模式</span>
        </div>

        <el-form @submit.prevent="handleSubmit">
            <div class="form-row">
                <div class="form-field wd-input-shell">
                    <div class="wd-field-head">
                        <label class="wd-field-label">日期</label>
                    </div>
                    <el-date-picker
                        v-model="formDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        :clearable="false"
                        class="wd-date-picker"
                        placeholder="选择日期"
                    />
                </div>
                <div class="form-field wd-input-shell">
                    <div class="wd-field-head">
                        <label class="wd-field-label">早称（斤）</label>
                        <span class="wd-field-hint">晨起空腹</span>
                    </div>
                    <el-input
                        v-model="morningStr"
                        type="number"
                        step="0.1"
                        placeholder="如 148.6"
                    />
                </div>
                <div class="form-field wd-input-shell">
                    <div class="wd-field-head">
                        <label class="wd-field-label">晚称（斤）</label>
                        <span class="wd-field-hint">睡前或晚饭后</span>
                    </div>
                    <el-input
                        v-model="eveningStr"
                        type="number"
                        step="0.1"
                        placeholder="可留空"
                    />
                </div>
            </div>

            <div class="form-field form-field--full wd-input-shell">
                <div class="wd-field-head">
                    <label class="wd-field-label">事件备注（选填）</label>
                    <span class="wd-field-hint">如「打篮球」「聚餐」「暴食」</span>
                </div>
                <el-input
                    v-model="noteStr"
                    type="textarea"
                    :rows="4"
                    placeholder="记录今天影响体重的关键事件，方便后续回顾。"
                />
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">
                    {{ editingId ? '保存修改' : '保存记录' }}
                </button>
                <button v-if="editingId" type="button" class="btn-secondary" @click="handleCancel">
                    取消编辑
                </button>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { WeightRecord } from '../types';
import { todayISO } from '../utils';

const props = defineProps<{
    editingRecord: WeightRecord | null;
}>();

const emit = defineEmits<{
    save: [data: { id?: string; date: string; morning?: number; evening?: number; note?: string }];
    cancel: [];
}>();

const editingId = ref<string | undefined>();
const formDate = ref(todayISO());
const morningStr = ref('');
const eveningStr = ref('');
const noteStr = ref('');

function parseNum(val: string): number | undefined {
    if (val === '' || val === undefined) return undefined;
    const n = parseFloat(val);
    return Number.isNaN(n) ? undefined : n;
}

function resetForm() {
    editingId.value = undefined;
    formDate.value = todayISO();
    morningStr.value = '';
    eveningStr.value = '';
    noteStr.value = '';
}

function handleSubmit() {
    emit('save', {
        id: editingId.value,
        date: formDate.value,
        morning: parseNum(morningStr.value),
        evening: parseNum(eveningStr.value),
        note: noteStr.value,
    });
    resetForm();
}

function handleCancel() {
    resetForm();
    emit('cancel');
}

watch(
    () => props.editingRecord,
    (record) => {
        if (!record) {
            if (!editingId.value) return;
            resetForm();
            return;
        }
        editingId.value = record.id;
        formDate.value = record.date;
        morningStr.value = record.morning !== undefined ? String(record.morning) : '';
        eveningStr.value = record.evening !== undefined ? String(record.evening) : '';
        noteStr.value = record.note ?? '';
    },
    { immediate: true },
);

defineExpose({ resetForm });
</script>

<style scoped lang="scss">
@use '../styles/shared.scss';

.form-card {
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        background: linear-gradient(90deg, var(--wd-teal), var(--wd-sky));
    }

    &--editing {
        border-color: rgba(245, 158, 11, 0.45) !important;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1), var(--wd-shadow) !important;
    }
}

.edit-badge {
    font-size: 12px;
    padding: 5px 11px;
    border-radius: var(--wd-radius-sm);
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #fde68a;
    font-weight: 600;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 25px;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
}

.form-field {
    min-width: 0;
    max-width: 100%;

    :deep(.el-date-editor.wd-date-picker) {
        width: 100% !important;
        max-width: 100%;
        --el-date-editor-width: 100%;
    }

    &--full {
        margin-bottom: 16px;
    }
}

.form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.btn-primary,
.btn-secondary {
    height: var(--wd-field-h);
    padding: 0 22px;
    border-radius: var(--wd-radius-md);
    font-size: 14px;
    font-weight: 700;
    font-family: var(--wd-font);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
}

.btn-primary {
    border: none;
    background: linear-gradient(135deg, #0f766e, #0284c7);
    color: #fff;
    box-shadow: 0 10px 22px rgba(14, 116, 144, 0.22);

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 26px rgba(14, 116, 144, 0.28);
    }
}

.btn-secondary {
    border: 1px solid var(--wd-line-strong);
    background: #fff;
    color: var(--wd-ink-soft);

    &:hover {
        background: var(--wd-surface-muted);
        border-color: #cbd5e1;
    }
}
</style>
