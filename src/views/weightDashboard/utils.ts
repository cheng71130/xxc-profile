import type { UserSettings, WeightRecord, WeightStats } from './types';

export const DEFAULT_SETTINGS: UserSettings = {
    heightCm: 171,
    startWeight: 168,
    targetWeight: 130,
};

export const STORAGE_KEYS = {
    records: 'weight-dashboard-records',
    settings: 'weight-dashboard-settings',
} as const;

export function generateId(): string {
    return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function formatShortDate(dateStr: string): string {
    const [, month, day] = dateStr.split('-');
    return `${Number(month)}.${Number(day)}`;
}

export function formatWeight(value: number | null | undefined, digits = 1): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return value.toFixed(digits);
}

export function calcDiff(morning?: number, evening?: number): number | null {
    if (morning === undefined || evening === undefined) return null;
    return Number((evening - morning).toFixed(1));
}

export function computeStats(records: WeightRecord[], settings: UserSettings): WeightStats {
    const withMorning = records
        .filter((r) => r.morning !== undefined)
        .sort((a, b) => b.date.localeCompare(a.date));

    const current = withMorning[0] ?? null;
    const currentWeight = current?.morning ?? null;
    const currentDate = current?.date ?? null;

    let lowestWeight: number | null = null;
    let lowestDate: string | null = null;
    for (const r of records) {
        if (r.morning === undefined) continue;
        if (lowestWeight === null || r.morning < lowestWeight) {
            lowestWeight = r.morning;
            lowestDate = r.date;
        }
    }

    let totalLost: number | null = null;
    if (currentWeight !== null && settings.startWeight) {
        totalLost = Number((currentWeight - settings.startWeight).toFixed(1));
    }

    let toGoal: number | null = null;
    if (currentWeight !== null && settings.targetWeight) {
        toGoal = currentWeight <= settings.targetWeight
            ? 0
            : Number((currentWeight - settings.targetWeight).toFixed(1));
    }

    let bmi: number | null = null;
    if (currentWeight !== null && settings.heightCm > 0) {
        const weightKg = currentWeight * 0.5;
        const heightM = settings.heightCm / 100;
        const raw = weightKg / (heightM * heightM);
        if (!Number.isNaN(raw) && Number.isFinite(raw)) {
            bmi = Number(raw.toFixed(1));
        }
    }

    let progressPct = 0;
    const range = settings.startWeight - settings.targetWeight;
    if (range > 0 && currentWeight !== null) {
        const lost = settings.startWeight - currentWeight;
        progressPct = Math.min(100, Math.max(0, (lost / range) * 100));
    }

    return {
        currentWeight,
        currentDate,
        lowestWeight,
        lowestDate,
        totalLost,
        toGoal,
        bmi,
        progressPct,
    };
}

export function sortRecordsAsc(records: WeightRecord[]): WeightRecord[] {
    return [...records].sort((a, b) => a.date.localeCompare(b.date));
}

export function sortRecordsDesc(records: WeightRecord[]): WeightRecord[] {
    return [...records].sort((a, b) => b.date.localeCompare(a.date));
}

export function todayISO(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function getChartYMax(records: WeightRecord[], settings: UserSettings): number {
    let max = settings.startWeight;
    for (const r of records) {
        if (r.morning !== undefined) max = Math.max(max, r.morning);
        if (r.evening !== undefined) max = Math.max(max, r.evening);
    }
    return Math.ceil(max + 5);
}
