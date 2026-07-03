<template>
    <div class="settings-card panel-card">
        <div class="settings-card__header">
            <div>
                <h3 class="card-title">个人设置</h3>
                <p class="card-desc">用于计算 BMI 与减重进度，仅保存在本地浏览器。</p>
            </div>
            <span class="pill-tag">本地存储</span>
        </div>

        <div class="settings-grid">
            <div class="setting-field">
                <div class="setting-label-row">
                    <label>身高</label>
                    <span class="unit">cm</span>
                </div>
                <el-input
                    :model-value="String(settings.heightCm)"
                    type="number"
                    @update:model-value="onHeightChange"
                />
            </div>
            <div class="setting-field">
                <div class="setting-label-row">
                    <label>起始体重</label>
                    <span class="unit">斤</span>
                </div>
                <el-input
                    :model-value="String(settings.startWeight)"
                    type="number"
                    step="0.1"
                    @update:model-value="onStartChange"
                />
            </div>
            <div class="setting-field">
                <div class="setting-label-row">
                    <label>目标体重</label>
                    <span class="unit">斤</span>
                </div>
                <el-input
                    :model-value="String(settings.targetWeight)"
                    type="number"
                    step="0.1"
                    @update:model-value="onTargetChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UserSettings } from '../types';

defineProps<{ settings: UserSettings }>();
const emit = defineEmits<{ update: [partial: Partial<UserSettings>] }>();

function parseVal(val: string): number | undefined {
    const n = parseFloat(val);
    return Number.isNaN(n) ? undefined : n;
}

function onHeightChange(val: string) {
    const n = parseVal(val);
    if (n !== undefined) emit('update', { heightCm: n });
}

function onStartChange(val: string) {
    const n = parseVal(val);
    if (n !== undefined) emit('update', { startWeight: n });
}

function onTargetChange(val: string) {
    const n = parseVal(val);
    if (n !== undefined) emit('update', { targetWeight: n });
}
</script>

<style scoped lang="scss">
.settings-card {
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

.pill-tag {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(34, 197, 94, 0.12);
    color: #16a34a;
    border: 1px solid rgba(34, 197, 94, 0.25);
    flex-shrink: 0;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
}

.setting-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.setting-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
        font-size: 13px;
        font-weight: 500;
        color: #475569;
    }

    .unit {
        font-size: 11px;
        color: #94a3b8;
    }
}

:deep(.el-input__wrapper) {
    border-radius: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
</style>
