<template>
    <div class="stats-grid">
        <!-- 当前体重 -->
        <div class="stat-card glass-card">
            <div class="stat-card__header">
                <span class="stat-label">当前体重</span>
                <span class="pill-tag pill-tag--blue">起始 {{ formatWeight(settings.startWeight) }} 斤</span>
            </div>
            <div class="stat-value-row">
                <span class="stat-value font-mono">{{ formatWeight(stats.currentWeight) }}</span>
                <span class="stat-unit">斤</span>
            </div>
            <p class="stat-sub">
                {{ stats.currentDate ? formatShortDate(stats.currentDate) : '—' }}
            </p>
        </div>

        <!-- 历史最低 + BMI -->
        <div class="stat-card glass-card stat-card--split">
            <div class="split-half">
                <span class="stat-label">历史最低</span>
                <div class="stat-value-row stat-value-row--sm">
                    <span class="stat-value font-mono">{{ formatWeight(stats.lowestWeight) }}</span>
                    <span class="stat-unit">斤</span>
                </div>
                <p class="stat-sub">
                    {{ stats.lowestDate ? formatShortDate(stats.lowestDate) : '—' }}
                </p>
            </div>
            <div class="split-divider"></div>
            <div class="split-half">
                <span class="stat-label">BMI</span>
                <div class="stat-value-row stat-value-row--sm">
                    <span class="stat-value font-mono">{{ formatWeight(stats.bmi) }}</span>
                </div>
                <p class="stat-sub">身高 {{ settings.heightCm }}cm · 以早称体重估算</p>
            </div>
        </div>

        <!-- 减重进度 -->
        <div class="stat-card glass-card">
            <span class="stat-label">减重进度</span>
            <div class="progress-meta">
                <span>
                    累计变化：
                    <strong class="font-mono">
                        {{ stats.totalLost !== null ? (stats.totalLost > 0 ? '+' : '') + formatWeight(stats.totalLost) + ' 斤' : '—' }}
                    </strong>
                </span>
                <span>
                    距目标：
                    <strong class="font-mono">
                        {{ stats.toGoal !== null && stats.toGoal <= 0 ? '已达成' : stats.toGoal !== null ? formatWeight(stats.toGoal) + ' 斤' : '—' }}
                    </strong>
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar__fill" :style="{ width: stats.progressPct + '%' }"></div>
            </div>
            <div class="progress-footer">
                <span>目标：{{ formatWeight(settings.targetWeight) }} 斤</span>
                <span class="font-mono">{{ stats.progressPct.toFixed(1) }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UserSettings, WeightStats } from '../types';
import { formatShortDate, formatWeight } from '../utils';

defineProps<{
    stats: WeightStats;
    settings: UserSettings;
}>();
</script>

<style scoped lang="scss">
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    padding: 20px 22px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 248, 255, 0.75) 100%);
    box-shadow: 0 4px 20px rgba(100, 160, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    &--split {
        display: flex;
        align-items: stretch;
        gap: 0;
    }
}

.stat-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
}

.pill-tag {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 999px;
    font-weight: 500;

    &--blue {
        background: rgba(56, 189, 248, 0.15);
        color: #0284c7;
        border: 1px solid rgba(56, 189, 248, 0.25);
    }
}

.stat-value-row {
    display: flex;
    align-items: baseline;
    gap: 4px;

    &--sm .stat-value {
        font-size: 1.75rem;
    }
}

.stat-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: #0ea5e9;
    line-height: 1.2;
}

.stat-unit {
    font-size: 1rem;
    color: #64748b;
    font-weight: 500;
}

.stat-sub {
    margin-top: 6px;
    font-size: 13px;
    color: #94a3b8;
}

.split-half {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.split-divider {
    width: 1px;
    background: rgba(148, 163, 184, 0.3);
    margin: 0 16px;
}

.progress-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 10px 0 12px;
    font-size: 13px;
    color: #475569;

    strong {
        color: #1e293b;
    }
}

.progress-bar {
    height: 10px;
    border-radius: 999px;
    background: #f1f5f9;
    overflow: hidden;

    &__fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #22c55e, #0ea5e9);
        transition: width 0.4s ease;
    }
}

.progress-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    color: #64748b;
}

.font-mono {
    font-family: 'Courier New', Courier, monospace;
}
</style>
