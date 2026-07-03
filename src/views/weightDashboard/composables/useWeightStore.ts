import { ref, computed, watch } from 'vue';
import type { BackupData, UserSettings, WeightRecord } from '../types';
import { createPresetRecords } from '../presetData';
import {
    DEFAULT_SETTINGS,
    STORAGE_KEYS,
    computeStats,
    generateId,
    sortRecordsAsc,
    sortRecordsDesc,
} from '../utils';

const records = ref<WeightRecord[]>([]);
const settings = ref<UserSettings>({ ...DEFAULT_SETTINGS });
let loaded = false;

function loadFromStorage() {
    const rawRecords = localStorage.getItem(STORAGE_KEYS.records);
    const rawSettings = localStorage.getItem(STORAGE_KEYS.settings);

    if (!rawRecords && !rawSettings) {
        records.value = createPresetRecords();
        settings.value = { ...DEFAULT_SETTINGS };
        loaded = true;
        persist();
        return;
    }

    try {
        if (rawRecords) records.value = JSON.parse(rawRecords);
        if (rawSettings) settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) };
    } catch {
        records.value = createPresetRecords();
        settings.value = { ...DEFAULT_SETTINGS };
    }
    loaded = true;
}

function persist() {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records.value));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings.value));
}

watch(records, persist, { deep: true });
watch(settings, persist, { deep: true });

export function useWeightStore() {
    if (!loaded) loadFromStorage();

    const stats = computed(() => computeStats(records.value, settings.value));
    const sortedAsc = computed(() => sortRecordsAsc(records.value));
    const sortedDesc = computed(() => sortRecordsDesc(records.value));

    function upsertRecord(data: Omit<WeightRecord, 'id'> & { id?: string }) {
        const record: WeightRecord = {
            id: data.id ?? generateId(),
            date: data.date,
        };
        if (data.morning !== undefined && data.morning !== null && !Number.isNaN(data.morning)) {
            record.morning = Number(data.morning);
        }
        if (data.evening !== undefined && data.evening !== null && !Number.isNaN(data.evening)) {
            record.evening = Number(data.evening);
        }
        if (data.note?.trim()) record.note = data.note.trim();

        const idx = records.value.findIndex((r) => r.id === record.id);
        if (idx >= 0) {
            records.value[idx] = record;
        } else {
            const dateIdx = records.value.findIndex((r) => r.date === record.date);
            if (dateIdx >= 0) {
                records.value[dateIdx] = { ...record, id: records.value[dateIdx].id };
            } else {
                records.value.push(record);
            }
        }
    }

    function deleteRecord(id: string) {
        records.value = records.value.filter((r) => r.id !== id);
    }

    function updateSettings(partial: Partial<UserSettings>) {
        settings.value = { ...settings.value, ...partial };
    }

    function exportBackup(): string {
        const data: BackupData = {
            records: records.value,
            settings: settings.value,
        };
        return JSON.stringify(data, null, 2);
    }

    function importBackup(json: string): boolean {
        try {
            const data = JSON.parse(json) as BackupData;
            if (!Array.isArray(data.records) || typeof data.settings !== 'object') {
                return false;
            }
            records.value = data.records;
            settings.value = { ...DEFAULT_SETTINGS, ...data.settings };
            return true;
        } catch {
            return false;
        }
    }

    return {
        records,
        settings,
        stats,
        sortedAsc,
        sortedDesc,
        upsertRecord,
        deleteRecord,
        updateSettings,
        exportBackup,
        importBackup,
    };
}
