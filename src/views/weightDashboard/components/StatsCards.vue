<template>
    <div class="stats-grid">
        <div class="stat-card stat-card--primary">
            <div class="stat-card__header">
                <span class="stat-label">当前体重</span>
                <span class="pill-tag pill-tag--blue">起始 {{ formatWeight(settings.startWeight) }} 斤</span>
            </div>
            <div class="stat-value-row">
                <span class="stat-value wd-font-num">{{ formatWeight(stats.currentWeight) }}</span>
                <span class="stat-unit">斤</span>
            </div>
            <p class="stat-sub">
                {{ stats.currentDate ? formatShortDate(stats.currentDate) : '—' }} 更新
            </p>
        </div>

        <div class="stat-card stat-card--split">
            <div class="split-half">
                <span class="stat-label">历史最低</span>
                <div class="stat-value-row stat-value-row--sm">
                    <span class="stat-value wd-font-num">{{ formatWeight(stats.lowestWeight) }}</span>
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
                    <span class="stat-value wd-font-num">{{ formatWeight(stats.bmi) }}</span>
                </div>
                <p class="stat-sub">身高 {{ settings.heightCm }}cm · 早称估算</p>
            </div>
        </div>

        <div class="stat-card stat-card--progress">
            <span class="stat-label">减重进度</span>
            <div class="progress-meta">
                <span>
                    <em>累计变化</em>
                    <strong class="wd-font-num">
                        {{ stats.totalLost !== null ? (stats.totalLost > 0 ? '+' : '') + formatWeight(stats.totalLost) + ' 斤' : '—' }}
                    </strong>
                </span>
                <span>
                    <em>距目标</em>
                    <strong class="wd-font-num">
                        {{ stats.toGoal !== null && stats.toGoal <= 0 ? '已达成' : stats.toGoal !== null ? formatWeight(stats.toGoal) + ' 斤' : '—' }}
                    </strong>
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar__fill" :style="{ width: stats.progressPct + '%' }"></div>
            </div>
            <div class="progress-footer">
                <span>目标 {{ formatWeight(settings.targetWeight) }} 斤</span>
                <span class="wd-font-num">{{ stats.progressPct.toFixed(1) }}%</span>
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
@use '../styles/shared.scss';

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--wd-gap);

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    position: relative;
    min-height: 152px;
    padding: 20px 22px;
    border-radius: var(--wd-radius-lg);
    border: 1px solid var(--wd-line);
    background: rgba(255, 255, 255, 0.94);
    box-shadow: var(--wd-shadow);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        background: linear-gradient(90deg, var(--wd-teal), var(--wd-sky), var(--wd-pink));
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    &--primary {
        background: linear-gradient(145deg, #ffffff 0%, #f0fbff 100%);
    }

    &--split {
        display: flex;
        align-items: stretch;
    }
}

.stat-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--wd-ink-muted);
}

.pill-tag {
    flex-shrink: 0;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 600;

    &--blue {
        background: #e0f2fe;
        color: #0369a1;
        border: 1px solid #bae6fd;
    }
}

.stat-value-row {
    display: flex;
    align-items: baseline;
    gap: 5px;

    &--sm .stat-value {
        font-size: 1.85rem;
    }
}

.stat-value {
    font-size: 2.35rem;
    font-weight: 800;
    color: var(--wd-ink);
    line-height: 1.1;
}

.stat-unit {
    font-size: 0.95rem;
    color: var(--wd-ink-muted);
    font-weight: 600;
}

.stat-sub {
    margin: 8px 0 0;
    font-size: 13px;
    color: #8492a6;
}

.split-half {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    min-width: 0;
}

.split-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, #dbe4ee, transparent);
    margin: 6px 16px;
}

.progress-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 14px 0 12px;

    span {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    em {
        font-style: normal;
        font-size: 12px;
        color: var(--wd-ink-muted);
    }

    strong {
        color: var(--wd-ink);
        font-size: 15px;
        font-weight: 800;
    }
}

.progress-bar {
    height: 10px;
    border-radius: 999px;
    background: #e8eef5;
    overflow: hidden;

    &__fill {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--wd-green), var(--wd-sky), var(--wd-pink));
        transition: width 0.4s ease;
    }
}

.progress-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 12px;
    color: var(--wd-ink-muted);
}
</style>
