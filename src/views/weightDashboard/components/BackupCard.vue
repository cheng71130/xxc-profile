<template>
    <div class="backup-card panel-card">
        <div class="backup-card__header">
            <div>
                <h3 class="card-title">数据备份</h3>
                <p class="card-desc">导出 / 导入 JSON，方便在不同设备间迁移记录。</p>
            </div>
            <span class="pill-tag">建议定期备份</span>
        </div>

        <div class="backup-grid">
            <div class="backup-col">
                <div class="col-header">
                    <span class="col-title">导出 JSON</span>
                    <button class="btn-sm" @click="handleExport">生成备份</button>
                </div>
                <el-input
                    v-model="exportText"
                    type="textarea"
                    :rows="6"
                    readonly
                    placeholder="点击「生成备份」导出当前数据"
                    class="backup-textarea"
                />
            </div>
            <div class="backup-col">
                <div class="col-header">
                    <span class="col-title">导入 JSON</span>
                    <span class="col-hint">粘贴备份后点击导入</span>
                </div>
                <el-input
                    v-model="importText"
                    type="textarea"
                    :rows="6"
                    placeholder="粘贴之前导出的 JSON 数据"
                    class="backup-textarea"
                />
                <button class="btn-import" @click="handleImport">导入数据</button>
            </div>
        </div>

        <p v-if="statusMsg" class="status-msg" :class="{ 'status-msg--error': isError }">
            {{ statusMsg }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    onExport: () => string;
    onImport: (json: string) => boolean;
}>();

const exportText = ref('');
const importText = ref('');
const statusMsg = ref('');
const isError = ref(false);

function handleExport() {
    exportText.value = props.onExport();
    statusMsg.value = '已生成当前数据的 JSON 备份，可复制保存。';
    isError.value = false;
}

function handleImport() {
    if (!importText.value.trim()) {
        statusMsg.value = '导入失败：JSON 格式或字段不正确。';
        isError.value = true;
        return;
    }
    const ok = props.onImport(importText.value);
    if (ok) {
        statusMsg.value = '导入成功，数据已恢复。';
        isError.value = false;
        importText.value = '';
    } else {
        statusMsg.value = '导入失败：JSON 格式或字段不正确。';
        isError.value = true;
    }
}
</script>

<style scoped lang="scss">
.backup-card {
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
    background: rgba(250, 204, 21, 0.15);
    color: #a16207;
    border: 1px solid rgba(250, 204, 21, 0.3);
    flex-shrink: 0;
}

.backup-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
}

.backup-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.col-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
}

.col-title {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.col-hint {
    font-size: 11px;
    color: #94a3b8;
}

.backup-textarea {
    :deep(.el-textarea__inner) {
        height: 140px !important;
        min-height: 140px !important;
        max-height: 140px;
        border-radius: 10px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        resize: none;
    }
}

.btn-sm {
    padding: 5px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    font-size: 12px;
    color: #475569;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;

    &:hover {
        background: #f0f9ff;
        border-color: #7dd3fc;
        color: #0284c7;
    }
}

.btn-import {
    align-self: flex-start;
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #06b6d4, #22c55e);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(6, 182, 212, 0.3);
    transition: filter 0.2s;

    &:hover {
        filter: brightness(1.06);
    }
}

.status-msg {
    margin-top: 12px;
    font-size: 12px;
    color: #16a34a;

    &--error {
        color: #dc2626;
    }
}
</style>
