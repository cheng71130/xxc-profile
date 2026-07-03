<template>
    <div class="form-card panel-card" :class="{ 'form-card--editing': editingId }">
        <div class="form-card__header">
            <div>
                <h3 class="card-title">{{ editingId ? '编辑记录' : '记录今日体重' }}</h3>
                <p class="card-desc">输入早晚体重与备注，帮助你回顾每一次波动的原因。</p>
            </div>
            <span v-if="editingId" class="edit-badge">编辑模式</span>
        </div>

        <el-form @submit.prevent="handleSubmit">
            <div class="form-row">
                <div class="form-field">
                    <label class="field-label">日期</label>
                    <el-date-picker
                        v-model="formDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        :clearable="false"
                        class="uniform-input"
                        placeholder="选择日期"
                    />
                </div>
                <div class="form-field">
                    <label class="field-label">早称（斤）</label>
                    <span class="field-hint">晨起空腹</span>
                    <el-input
                        v-model="morningStr"
                        type="number"
                        step="0.1"
                        placeholder="如 148.6"
                        class="uniform-input"
                    />
                </div>
                <div class="form-field">
                    <label class="field-label">晚称（斤）</label>
                    <span class="field-hint">睡前或晚餐后</span>
                    <el-input
                        v-model="eveningStr"
                        type="number"
                        step="0.1"
                        placeholder="可留空"
                        class="uniform-input"
                    />
                </div>
            </div>

            <div class="form-field form-field--full">
                <div class="field-label-row">
                    <label class="field-label">事件备注（选填）</label>
                    <span class="field-hint">如「打篮球」「暴饮暴食」「聚餐」</span>
                </div>
                <el-input
                    v-model="noteStr"
                    type="textarea"
                    :rows="2"
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
.form-card {
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -40px;
        right: -40px;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.15), transparent 70%);
        pointer-events: none;
    }

    &--editing {
        border-color: rgba(250, 204, 21, 0.5) !important;
        box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.15), 0 4px 20px rgba(100, 160, 220, 0.1) !important;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
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

.edit-badge {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 8px;
    background: #fef9c3;
    color: #a16207;
    font-weight: 500;
    flex-shrink: 0;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 14px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &--full {
        margin-bottom: 16px;
    }
}

.field-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.field-label {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
}

.field-hint {
    font-size: 11px;
    color: #94a3b8;
}

.uniform-input {
    width: 100%;

    :deep(.el-input__wrapper),
    :deep(.el-input__inner) {
        height: 40px;
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }
}

:deep(.el-date-editor.el-input) {
    width: 100%;
    height: 40px;

    .el-input__wrapper {
        height: 40px;
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }
}

.form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.btn-primary {
    padding: 10px 28px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #06b6d4, #22c55e);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
    transition: filter 0.2s, box-shadow 0.2s, transform 0.15s;

    &:hover {
        filter: brightness(1.06);
        box-shadow: 0 6px 18px rgba(6, 182, 212, 0.45);
        transform: translateY(-1px);
    }
}

.btn-secondary {
    padding: 10px 20px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #fff;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;

    &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
    }
}
</style>
