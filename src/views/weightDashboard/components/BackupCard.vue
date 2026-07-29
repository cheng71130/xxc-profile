<template>
    <div class="backup-card panel-card">
        <div class="wd-card-head">
            <div>
                <h3 class="wd-card-title">数据备份</h3>
                <p class="wd-card-desc">导出 / 导入 JSON，方便在不同设备间迁移记录。</p>
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
                    class="backup-textarea wd-input-shell"
                />
            </div>
            <div class="backup-col">
                <div class="col-header">
                    <span class="col-title">导入 JSON</span>
                    <button class="btn-import btn-import--header" @click="handleImport">导入数据</button>
                </div>
                <el-input
                    v-model="importText"
                    type="textarea"
                    :rows="6"
                    placeholder="粘贴之前导出的 JSON 数据"
                    class="backup-textarea wd-input-shell"
                />
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
@use '../styles/shared.scss';

.pill-tag {
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #fde68a;
    font-weight: 600;
}

.backup-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: start;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
}

.backup-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}

.col-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    min-height: 30px;
}

.col-title {
    font-size: 13px;
    font-weight: 700;
    color: #344054;
}

.backup-textarea {
    :deep(.el-textarea__inner) {
        height: 136px !important;
        min-height: 136px !important;
        max-height: 136px;
        padding: 12px;
        font-family: var(--wd-font-num);
        font-size: 12px;
        line-height: 1.55;
        resize: none;
    }
}

.btn-sm,
.btn-import {
    border-radius: var(--wd-radius-sm);
    font-weight: 700;
    font-family: var(--wd-font);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
}

.btn-sm {
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--wd-line-strong);
    background: #fff;
    font-size: 12px;
    color: #344054;

    &:hover {
        background: #f0f9ff;
        border-color: #7dd3fc;
        color: #0369a1;
    }
}

.btn-import {
    border: none;
    background: linear-gradient(135deg, #0f766e, #0284c7);
    color: #fff;
    font-size: 12px;
    box-shadow: 0 10px 22px rgba(14, 116, 144, 0.2);

    &--header {
        height: 32px;
        padding: 0 12px;
    }

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 26px rgba(14, 116, 144, 0.26);
    }
}

.status-msg {
    margin: 12px 0 0;
    padding: 10px 12px;
    border-radius: var(--wd-radius-sm);
    background: #ecfdf3;
    color: #067647;
    font-size: 12px;
    font-weight: 600;

    &--error {
        background: #fef3f2;
        color: #b42318;
    }
}
</style>
