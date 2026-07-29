<template>
    <div class="chart-card panel-card">
        <div class="chart-card__header">
            <div>
                <span class="section-kicker">Trend</span>
                <h3 class="card-title">体重走势</h3>
                <p class="card-desc">早称、晚称和目标线分层展示，事件备注以精准节点浮标呈现。</p>
            </div>
            <div class="legend">
                <span class="legend-item">
                    <i class="legend-line legend-line--morning"></i>早称
                </span>
                <span class="legend-item">
                    <i class="legend-line legend-line--evening"></i>晚称
                </span>
                <span class="legend-item">
                    <i class="legend-line legend-line--target"></i>目标
                </span>
            </div>
        </div>
        <div ref="chartRef" class="chart-area"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import type { UserSettings, WeightRecord } from '../types';
import { formatShortDate } from '../utils';

const props = defineProps<{
    records: WeightRecord[];
    settings: UserSettings;
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function buildOption() {
    const dates = props.records.map((record) => record.date);
    const shortLabels = dates.map(formatShortDate);
    const morningData = props.records.map((record) => record.morning ?? null);
    const eveningData = props.records.map((record) => record.evening ?? null);
    const values = [...morningData, ...eveningData, props.settings.targetWeight]
        .filter((value): value is number => value !== null && value !== undefined && Number.isFinite(value));
    const yMin = values.length ? Math.max(0, Math.floor(Math.min(...values) - 4)) : 120;
    const yMax = values.length ? Math.ceil(Math.max(...values) + 4) : 180;
    const noteData = props.records
        .map((record, index) => {
            if (!record.note) return null;
            const value = record.morning ?? record.evening;
            if (value === undefined) return null;
            return {
                value: [shortLabels[index], value],
                note: record.note,
                date: record.date,
            };
        })
        .filter(Boolean);

    return {
        backgroundColor: 'transparent',
        animationDuration: 1200,
        animationEasing: 'cubicOut',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            padding: [12, 14],
            extraCssText: 'box-shadow:0 18px 44px rgba(15,23,42,.24);border-radius:18px;',
            textStyle: { color: '#e5edf7', fontSize: 13, fontFamily: 'Noto Sans SC, sans-serif' },
            axisPointer: {
                type: 'line',
                lineStyle: { color: 'rgba(14, 165, 233, 0.34)', width: 1 },
            },
            formatter(params: any[]) {
                const idx = params[0]?.dataIndex ?? 0;
                const record = props.records[idx];
                if (!record) return '';
                const morning = record.morning !== undefined ? record.morning.toFixed(1) : '—';
                const evening = record.evening !== undefined ? record.evening.toFixed(1) : '—';
                let html = `<div style="font-weight:800;margin-bottom:8px;color:#fff">${formatShortDate(record.date)} · ${record.date}</div>`;
                html += `<div style="margin:3px 0">早称：<span style="color:#5eead4;font-family:monospace;font-weight:800">${morning}</span> 斤</div>`;
                html += `<div style="margin:3px 0">晚称：<span style="color:#f9a8d4;font-family:monospace;font-weight:800">${evening}</span> 斤</div>`;
                if (record.note) {
                    html += `<div style="margin-top:10px;padding:8px 10px;background:rgba(250,204,21,.14);border:1px solid rgba(250,204,21,.24);border-radius:12px;color:#fde68a;font-size:12px">事件：${record.note}</div>`;
                }
                return html;
            },
        },
        grid: { top: 28, left: 54, right: 30, bottom: 42 },
        xAxis: {
            type: 'category',
            data: shortLabels,
            boundaryGap: false,
            axisLine: { lineStyle: { color: '#d8e4ee' } },
            axisLabel: { color: '#667085', fontSize: 12, interval: 'auto', margin: 14 },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            min: yMin,
            max: yMax,
            splitNumber: 5,
            splitLine: { lineStyle: { color: '#e6eef6', type: 'dashed' } },
            axisLabel: { color: '#8492a6', fontSize: 12, margin: 12 },
        },
        series: [
            {
                name: '早称',
                type: 'line',
                smooth: 0.42,
                showSymbol: false,
                connectNulls: false,
                data: morningData,
                lineStyle: {
                    color: '#14b8a6',
                    width: 4,
                    cap: 'round',
                    join: 'round',
                    shadowBlur: 12,
                    shadowColor: 'rgba(20,184,166,.24)',
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(20, 184, 166, 0.2)' },
                        { offset: 1, color: 'rgba(20, 184, 166, 0.015)' },
                    ]),
                },
                emphasis: { focus: 'series' },
            },
            {
                name: '晚称',
                type: 'line',
                smooth: 0.42,
                showSymbol: false,
                connectNulls: false,
                data: eveningData,
                lineStyle: {
                    color: '#f472b6',
                    width: 3,
                    cap: 'round',
                    join: 'round',
                    shadowBlur: 10,
                    shadowColor: 'rgba(244,114,182,.22)',
                },
                emphasis: { focus: 'series' },
            },
            {
                name: '目标',
                type: 'line',
                data: dates.map(() => props.settings.targetWeight),
                symbol: 'none',
                lineStyle: { color: '#22c55e', type: 'dashed', width: 2.2, opacity: 0.78 },
                tooltip: { show: false },
            },
            {
                name: '事件',
                type: 'scatter',
                data: noteData,
                symbol: 'pin',
                symbolSize: 32,
                z: 8,
                itemStyle: {
                    color: '#f59e0b',
                    borderColor: '#fff7ed',
                    borderWidth: 2,
                    shadowBlur: 14,
                    shadowColor: 'rgba(245, 158, 11, 0.34)',
                },
                tooltip: { show: false },
            },
        ],
    };
}

function renderChart() {
    if (!chartRef.value) return;
    if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value);
    }
    chartInstance.setOption(buildOption() as echarts.EChartsOption, true);
}

function handleResize() {
    chartInstance?.resize();
}

onMounted(async () => {
    await nextTick();
    renderChart();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    chartInstance?.dispose();
    chartInstance = null;
});

watch(() => [props.records, props.settings], renderChart, { deep: true });
</script>

<style scoped lang="scss">
.chart-card {
    padding: 22px;
    min-height: 460px;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        margin-bottom: 18px;
        flex-wrap: wrap;
    }
}

.section-kicker {
    display: inline-flex;
    margin-bottom: 8px;
    font-size: 12px;
    color: #0f766e;
    font-weight: 900;
}

.card-title {
    font-size: 24px;
    font-weight: 900;
    color: #0f172a;
    margin: 0;
}

.card-desc {
    font-size: 13px;
    color: #8492a6;
    margin: 8px 0 0;
}

.legend {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid rgba(203, 213, 225, 0.66);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    font-size: 12px;
    color: #526071;
    font-weight: 800;
}

.legend-line {
    display: inline-block;
    width: 24px;
    height: 4px;
    border-radius: 999px;

    &--morning { background: #14b8a6; }
    &--evening { background: #f472b6; }
    &--target {
        background: repeating-linear-gradient(90deg, #22c55e 0, #22c55e 5px, transparent 5px, transparent 10px);
        height: 3px;
    }
}

.chart-area {
    width: 100%;
    height: 380px;
}
</style>
