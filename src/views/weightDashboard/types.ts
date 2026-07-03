export interface WeightRecord {
    id: string;
    date: string;
    morning?: number;
    evening?: number;
    note?: string;
}

export interface UserSettings {
    heightCm: number;
    startWeight: number;
    targetWeight: number;
}

export interface WeightStats {
    currentWeight: number | null;
    currentDate: string | null;
    lowestWeight: number | null;
    lowestDate: string | null;
    totalLost: number | null;
    toGoal: number | null;
    bmi: number | null;
    progressPct: number;
}

export interface BackupData {
    records: WeightRecord[];
    settings: UserSettings;
}
