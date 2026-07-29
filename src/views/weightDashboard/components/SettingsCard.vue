<template>
    <div class="settings-card panel-card">
        <div class="wd-card-head">
            <div>
                <h3 class="wd-card-title">个人设置</h3>
                <p class="wd-card-desc">用于计算 BMI 与减重进度，仅保存在本地浏览器。</p>
            </div>
            <span class="pill-tag">本地存储</span>
        </div>

        <div class="settings-grid">
            <div class="setting-field wd-input-shell">
                <div class="wd-field-head">
                    <label class="wd-field-label">身高</label>
                    <span class="wd-field-hint">cm</span>
                </div>
                <el-input
                    :model-value="String(settings.heightCm)"
                    type="number"
                    @update:model-value="onHeightChange"
                />
            </div>
            <div class="setting-field wd-input-shell">
                <div class="wd-field-head">
                    <label class="wd-field-label">起始体重</label>
                    <span class="wd-field-hint">斤</span>
                </div>
                <el-input
                    :model-value="String(settings.startWeight)"
                    type="number"
                    step="0.1"
                    @update:model-value="onStartChange"
                />
            </div>
            <div class="setting-field wd-input-shell">
                <div class="wd-field-head">
                    <label class="wd-field-label">目标体重</label>
                    <span class="wd-field-hint">斤</span>
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
@use '../styles/shared.scss';

.pill-tag {
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #ecfdf3;
    color: #067647;
    border: 1px solid #abefc6;
    font-weight: 600;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
}

.setting-field {
    min-width: 0;
    padding: 14px;
    border: 1px solid #edf2f7;
    border-radius: var(--wd-radius-md);
    background: var(--wd-surface-muted);
}
</style>
