<template>
    <div class="chart-card panel-card">
        <div class="chart-card__header">
            <div>
                <h3 class="card-title">体重走势</h3>
                <p class="card-desc">早称为蓝线，晚称为红线；带标记的点为有备注的日期。</p>
            </div>
            <div class="legend">
                <span class="legend-item">
                    <i class="legend-line legend-line--morning"></i>早称
                </span>
                <span class="legend-item">
                    <i class="legend-line legend-line--evening"></i>晚称
                </span>
                <span class="legend-item">
                    <i class="legend-line legend-line--target"></i>目标体重
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
import { formatShortDate, getChartYMax } from '../utils';

const props = defineProps<{
    records: WeightRecord[];
    settings: UserSettings;
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function buildOption() {
    const dates = props.records.map((r) => r.date);
    const shortLabels = dates.map(formatShortDate);
    const morningData = props.records.map((r) => r.morning ?? null);
    const eveningData = props.records.map((r) => r.evening ?? null);
    const noteIndices = props.records
        .map((r, i) => (r.note ? i : -1))
        .filter((i) => i >= 0);

    const yMax = getChartYMax(props.records, props.settings);

    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderColor: '#e2e8f0',
            textStyle: { color: '#334155', fontSize: 13 },
            formatter(params: any[]) {
                const idx = params[0]?.dataIndex ?? 0;
                const record = props.records[idx];
                if (!record) return '';
                const m = record.morning !== undefined ? record.morning.toFixed(1) : '—';
                const e = record.evening !== undefined ? record.evening.toFixed(1) : '—';
                let html = `<div style="font-weight:600;margin-bottom:4px">${formatShortDate(record.date)} · ${record.date}</div>`;
                html += `<div>早称：<span style="color:#0ea5e9;font-family:monospace">${m}</span> 斤</div>`;
                html += `<div>晚称：<span style="color:#f472b6;font-family:monospace">${e}</span> 斤</div>`;
                if (record.note) {
                    html += `<div style="margin-top:6px;padding:4px 8px;background:#fef9c3;border-radius:6px;font-size:12px">事件：${record.note}</div>`;
                }
                return html;
            },
        },
        grid: { top: 24, left: 48, right: 24, bottom: 36 },
        xAxis: {
            type: 'category',
            data: shortLabels,
            boundaryGap: false,
            axisLine: { lineStyle: { color: '#cbd5e1' } },
            axisLabel: { color: '#64748b', fontSize: 11, interval: 'auto' },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            min: 120,
            max: yMax,
            splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
        },
        series: [
            {
                name: '早称',
                type: 'line',
                smooth: true,
                connectNulls: false,
                data: morningData,
                symbol: 'circle',
                symbolSize: (_val: number | null, params: { dataIndex: number }) => {
                    const r = props.records[params.dataIndex];
                    return r?.note ? 10 : 6;
                },
                lineStyle: { color: '#0ea5e9', width: 2.5 },
                itemStyle: {
                    color: '#0ea5e9',
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 16,
                    itemStyle: {
                        color: 'transparent',
                        borderColor: 'rgba(250, 204, 21, 0.6)',
                        borderWidth: 3,
                    },
                    data: noteIndices.map((i) => {
                        const yVal = morningData[i] ?? eveningData[i];
                        return yVal !== null ? { coord: [shortLabels[i], yVal] } : null;
                    }).filter(Boolean),
                    silent: true,
                },
            },
            {
                name: '晚称',
                type: 'line',
                smooth: true,
                connectNulls: false,
                data: eveningData,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { color: '#f472b6', width: 2.5 },
                itemStyle: { color: '#f472b6', borderColor: '#fff', borderWidth: 2 },
            },
            {
                name: '目标体重',
                type: 'line',
                data: dates.map(() => props.settings.targetWeight),
                symbol: 'none',
                lineStyle: { color: '#22c55e', type: 'dashed', width: 1.5 },
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
    chartInstance.setOption(buildOption(), true);
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
    padding: 22px 24px;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 12px;
        flex-wrap: wrap;
    }
}

.card-title {
    font-size: 17px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.card-desc {
    font-size: 12px;
    color: #94a3b8;
    margin: 4px 0 0;
}

.legend {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #64748b;
}

.legend-line {
    display: inline-block;
    width: 20px;
    height: 3px;
    border-radius: 2px;

    &--morning { background: #0ea5e9; }
    &--evening { background: #f472b6; }
    &--target {
        background: repeating-linear-gradient(90deg, #22c55e 0, #22c55e 4px, transparent 4px, transparent 8px);
        height: 2px;
    }
}

.chart-area {
    width: 100%;
    height: 320px;
}
</style>
