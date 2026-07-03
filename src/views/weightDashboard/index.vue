<template>
    <div class="weight-dashboard">
        <div class="bg-glow bg-glow--top"></div>
        <div class="bg-glow bg-glow--bottom"></div>

        <div class="dashboard-container">
            <!-- 顶部文案 -->
            <header class="page-header">
                <div class="page-header__text">
                    <h1 class="page-title">体重轨迹仪表盘</h1>
                    <p class="page-subtitle">
                        精细记录早晚体重变化，追踪每一次波动与事件，帮你稳步走向目标身材。
                    </p>
                </div>
                <div class="feature-tags">
                    <span v-for="tag in featureTags" :key="tag" class="feature-tag">{{ tag }}</span>
                </div>
            </header>

            <!-- 统计卡片 -->
            <StatsCards :stats="stats" :settings="settings" />

            <!-- 折线图 -->
            <WeightChart :records="sortedAsc" :settings="settings" />

            <!-- 底部双列 -->
            <div class="bottom-section">
                <div class="left-column">
                    <RecordForm
                        :editing-record="editingRecord"
                        @save="handleSave"
                        @cancel="editingRecord = null"
                    />
                    <SettingsCard :settings="settings" @update="updateSettings" />
                    <BackupCard :on-export="exportBackup" :on-import="handleImport" />
                </div>
                <div class="right-column">
                    <HistoryTable
                        :records="sortedDesc"
                        @edit="handleEdit"
                        @delete="handleDelete"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import StatsCards from './components/StatsCards.vue';
import WeightChart from './components/WeightChart.vue';
import RecordForm from './components/RecordForm.vue';
import SettingsCard from './components/SettingsCard.vue';
import BackupCard from './components/BackupCard.vue';
import HistoryTable from './components/HistoryTable.vue';
import { useWeightStore } from './composables/useWeightStore';
import type { WeightRecord } from './types';

const {
    settings,
    stats,
    sortedAsc,
    sortedDesc,
    upsertRecord,
    deleteRecord,
    updateSettings,
    exportBackup,
    importBackup,
} = useWeightStore();

const editingRecord = ref<WeightRecord | null>(null);

const featureTags = ['亮色主题', '实时统计', '本地持久化'];

function handleSave(data: {
    id?: string;
    date: string;
    morning?: number;
    evening?: number;
    note?: string;
}) {
    upsertRecord(data);
    editingRecord.value = null;
}

function handleEdit(record: WeightRecord) {
    editingRecord.value = { ...record };
    nextTick(() => {
        document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function handleDelete(id: string) {
    deleteRecord(id);
    if (editingRecord.value?.id === id) {
        editingRecord.value = null;
    }
}

function handleImport(json: string): boolean {
    return importBackup(json);
}
</script>

<style scoped lang="scss">
.weight-dashboard {
    position: relative;
    min-height: 100vh;
    background: #f4f7fb;
    overflow-x: hidden;
}

.bg-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;

    &--top {
        top: -120px;
        right: -80px;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%);
    }

    &--bottom {
        bottom: -100px;
        left: -60px;
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, rgba(167, 139, 250, 0.14) 0%, transparent 70%);
    }
}

.dashboard-container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px 48px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 4px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    letter-spacing: -0.02em;
}

.page-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 8px 0 0;
    max-width: 520px;
    line-height: 1.6;
}

.feature-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: flex-start;
}

.feature-tag {
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(56, 189, 248, 0.2);
    color: #0284c7;
    font-weight: 500;
    letter-spacing: 0.04em;
    backdrop-filter: blur(8px);
}

.bottom-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: stretch;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
    }
}

.left-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.right-column {
    display: flex;
    min-height: 0;

    > * {
        flex: 1;
        width: 100%;
    }
}

:deep(.panel-card) {
    padding: 20px 22px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 20px rgba(100, 160, 220, 0.08);
    backdrop-filter: blur(8px);
}
</style>
