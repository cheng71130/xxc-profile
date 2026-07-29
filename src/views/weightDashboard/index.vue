<template>
    <div class="weight-dashboard">
        <div class="dashboard-container">
            <header class="page-hero reveal-card">
                <div class="page-hero__copy">
                    <span class="page-eyebrow">Weight Control OS</span>
                    <h1 class="page-title">体重管理</h1>
                    <p class="page-subtitle">
                        用更轻松的方式记录早晚体重、观察趋势变化，并把目标进度变成清晰可感知的日常反馈。
                    </p>
                    <div class="feature-tags">
                        <span v-for="tag in featureTags" :key="tag" class="feature-tag">{{ tag }}</span>
                    </div>
                </div>

                <aside class="hero-panel" aria-label="今日体重摘要">
                    <div class="hero-panel__label">当前体重</div>
                    <div class="hero-panel__value">
                        <strong class="wd-font-num">{{ formatWeight(stats.currentWeight) }}</strong>
                        <em>斤</em>
                    </div>
                    <div class="hero-progress">
                        <span class="hero-progress__bar">
                            <i :style="{ width: stats.progressPct + '%' }"></i>
                        </span>
                        <span class="wd-font-num">{{ stats.progressPct.toFixed(1) }}%</span>
                    </div>
                    <div class="hero-panel__meta">
                        <span>{{ stats.currentDate ? formatShortDate(stats.currentDate) + ' 更新' : '暂无记录' }}</span>
                        <span>目标 {{ formatWeight(settings.targetWeight) }} 斤</span>
                    </div>
                </aside>
            </header>

            <section class="stats-section reveal-card reveal-card--delay-1">
                <StatsCards :stats="stats" :settings="settings" />
            </section>

            <section class="chart-section reveal-card reveal-card--delay-2">
                <WeightChart :records="sortedAsc" :settings="settings" />
            </section>

            <section class="workspace-grid reveal-card reveal-card--delay-3">
                <div ref="workspaceMainRef" class="workspace-main">
                    <RecordForm
                        :editing-record="editingRecord"
                        @save="handleSave"
                        @cancel="editingRecord = null"
                    />
                    <SettingsCard :settings="settings" @update="updateSettings" />
                    <BackupCard :on-export="exportBackup" :on-import="handleImport" />
                </div>
                <div
                    class="workspace-side"
                    :style="workspaceSideHeight ? { height: `${workspaceSideHeight}px` } : undefined"
                >
                    <HistoryTable
                        :records="sortedDesc"
                        @edit="handleEdit"
                        @delete="handleDelete"
                    />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import StatsCards from './components/StatsCards.vue';
import WeightChart from './components/WeightChart.vue';
import RecordForm from './components/RecordForm.vue';
import SettingsCard from './components/SettingsCard.vue';
import BackupCard from './components/BackupCard.vue';
import HistoryTable from './components/HistoryTable.vue';
import { useWeightStore } from './composables/useWeightStore';
import type { WeightRecord } from './types';
import { formatShortDate, formatWeight } from './utils';

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
const workspaceMainRef = ref<HTMLElement | null>(null);
const workspaceSideHeight = ref<number>();

const featureTags = ['趋势洞察', '目标进度', '事件复盘'];

let resizeObserver: ResizeObserver | null = null;

function syncWorkspaceHeight() {
    workspaceSideHeight.value = workspaceMainRef.value?.offsetHeight;
}

onMounted(() => {
    syncWorkspaceHeight();
    if (workspaceMainRef.value) {
        resizeObserver = new ResizeObserver(syncWorkspaceHeight);
        resizeObserver.observe(workspaceMainRef.value);
    }
    window.addEventListener('resize', syncWorkspaceHeight);
});

onUnmounted(() => {
    resizeObserver?.disconnect();
    window.removeEventListener('resize', syncWorkspaceHeight);
});

function handleSave(data: {
    id?: string;
    date: string;
    morning?: number;
    evening?: number;
    note?: string;
}) {
    upsertRecord(data);
    editingRecord.value = null;
    nextTick(syncWorkspaceHeight);
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
    nextTick(syncWorkspaceHeight);
}

function handleImport(json: string): boolean {
    const ok = importBackup(json);
    if (ok) nextTick(syncWorkspaceHeight);
    return ok;
}
</script>

<style scoped lang="scss">
@use './styles/tokens.scss';

.weight-dashboard {
    position: relative;
    min-height: 100vh;
    color: var(--wd-ink);
    font-family: var(--wd-font);
    -webkit-font-smoothing: antialiased;
    background:
        radial-gradient(circle at 14% 8%, rgba(45, 212, 191, 0.18), transparent 28%),
        radial-gradient(circle at 82% 2%, rgba(56, 189, 248, 0.16), transparent 30%),
        radial-gradient(circle at 72% 78%, rgba(244, 114, 182, 0.13), transparent 30%),
        linear-gradient(180deg, #f7fbff 0%, #eef7f6 46%, #f8fafc 100%);
    overflow-x: hidden;

    &::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image:
            linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: linear-gradient(to bottom, black, transparent 76%);
        z-index: 0;
    }
}

.dashboard-container {
    position: relative;
    z-index: 1;
    width: min(1560px, calc(100% - 24px));
    margin: 0 auto;
    padding: 46px 0 76px;
    display: flex;
    flex-direction: column;
    gap: var(--wd-gap);

    @media (max-width: 720px) {
        width: calc(100% - 16px);
        padding: 24px 0 48px;
        gap: 14px;
    }
}

.page-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 430px);
    align-items: stretch;
    gap: 28px;
    min-height: 260px;
    padding: 34px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: var(--wd-radius-xl);
    background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72)),
        linear-gradient(110deg, rgba(20, 184, 166, 0.14), rgba(14, 165, 233, 0.12), rgba(244, 114, 182, 0.1));
    box-shadow: var(--wd-shadow);
    backdrop-filter: blur(22px);

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
        padding: 24px;
    }
}

.page-hero__copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
}

.page-eyebrow {
    width: fit-content;
    margin-bottom: 14px;
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(20, 184, 166, 0.1);
    border: 1px solid rgba(20, 184, 166, 0.18);
    font-size: 12px;
    font-weight: 800;
    color: #0f766e;
}

.page-title {
    font-size: clamp(40px, 5vw, 68px);
    font-weight: 900;
    color: #0f172a;
    margin: 0;
    line-height: 1.02;
}

.page-subtitle {
    font-size: 17px;
    color: #536273;
    margin: 18px 0 0;
    max-width: 680px;
    line-height: 1.85;
}

.feature-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 28px;
}

.feature-tag {
    font-size: 13px;
    padding: 9px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(203, 213, 225, 0.72);
    color: #355064;
    font-weight: 800;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.hero-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 26px;
    border-radius: 26px;
    background:
        linear-gradient(155deg, rgba(15, 23, 42, 0.98), rgba(12, 74, 110, 0.92)),
        linear-gradient(90deg, rgba(45, 212, 191, 0.22), rgba(244, 114, 182, 0.18));
    color: #fff;
    overflow: hidden;
    box-shadow: 0 28px 60px rgba(15, 23, 42, 0.22);

    &::after {
        content: '';
        position: absolute;
        right: -80px;
        top: -90px;
        width: 220px;
        height: 220px;
        border-radius: 999px;
        background: rgba(45, 212, 191, 0.18);
    }
}

.hero-panel__label {
    position: relative;
    z-index: 1;
    font-size: 14px;
    color: #b9c7d8;
    font-weight: 800;
}

.hero-panel__value {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 22px 0 28px;

    strong {
        font-size: clamp(56px, 7vw, 82px);
        line-height: 0.92;
        color: #f8fafc;
    }

    em {
        font-style: normal;
        font-size: 18px;
        color: #b9c7d8;
        font-weight: 800;
    }
}

.hero-progress {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 14px;
    font-size: 14px;
    color: #e5edf7;
    font-weight: 800;
}

.hero-progress__bar {
    height: 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    overflow: hidden;

    i {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #34d399, #38bdf8, #f9a8d4);
        transition: width 0.55s cubic-bezier(.2, .8, .2, 1);
    }
}

.hero-panel__meta {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 14px;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    font-size: 13px;
    color: #b9c7d8;
}

.workspace-grid {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: var(--wd-gap);
    align-items: start;

    @media (max-width: 1080px) {
        grid-template-columns: 1fr;
    }
}

.workspace-main {
    display: flex;
    flex-direction: column;
    gap: var(--wd-gap);
    min-width: 0;
}

.workspace-side {
    display: flex;
    min-height: 0;
    min-width: 0;

    @media (max-width: 1080px) {
        height: auto !important;
        min-height: 420px;
    }

    > * {
        flex: 1;
        width: 100%;
        min-height: 0;
    }
}

.reveal-card {
    animation: revealUp 0.72s cubic-bezier(.2, .8, .2, 1) both;
}

.reveal-card--delay-1 { animation-delay: 0.08s; }
.reveal-card--delay-2 { animation-delay: 0.16s; }
.reveal-card--delay-3 { animation-delay: 0.24s; }

:deep(.panel-card) {
    padding: 24px;
    border-radius: var(--wd-radius-lg);
    background: var(--wd-surface);
    border: 1px solid rgba(255, 255, 255, 0.74);
    box-shadow: var(--wd-shadow);
    backdrop-filter: blur(18px);
}

@keyframes revealUp {
    from {
        opacity: 0;
        transform: translateY(18px) scale(0.985);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
