import type { WeightRecord } from './types';

interface PresetEntry {
    month: number;
    day: number;
    morning?: number;
    evening?: number;
    note?: string;
}

const PRESET_ENTRIES: PresetEntry[] = [
    { month: 4, day: 8, morning: 168.0, evening: 167.6, note: '🚀 起始' },
    { month: 4, day: 9, morning: 165.7, evening: 164.9, note: '📉 -2.3斤开门红' },
    { month: 4, day: 10, morning: 164.0, evening: 162.0 },
    { month: 4, day: 11, morning: 160.9, evening: 160.6, note: '破161' },
    { month: 4, day: 12, morning: 162.2, evening: 164.0, note: '反弹' },
    { month: 4, day: 13, morning: 163.0, evening: 164.7 },
    { month: 4, day: 14, morning: 164.0, evening: 163.1 },
    { month: 4, day: 15, morning: 162.7, evening: 162.4 },
    { month: 4, day: 16, morning: 161.9, evening: 162.5 },
    { month: 4, day: 17, morning: 161.5, evening: 162.1 },
    { month: 4, day: 18, morning: 159.7, evening: 161.0, note: '破160' },
    { month: 4, day: 19, morning: 160.3, evening: 160.0 },
    { month: 4, day: 20, morning: 160.8, evening: 159.6 },
    { month: 4, day: 21, morning: 159.0, evening: 161.2 },
    { month: 4, day: 22, morning: 160.3, evening: 160.6 },
    { month: 4, day: 23, morning: 159.5, evening: 157.1, note: '🏸 羽毛球5h' },
    { month: 4, day: 24, morning: 156.3, evening: 158.6, note: '破157 羽毛球后效' },
    { month: 4, day: 25, morning: 157.3, evening: 158.5 },
    { month: 4, day: 26, morning: 157.6, evening: 158.6 },
    { month: 4, day: 27, morning: 158.0, evening: 158.1 },
    { month: 4, day: 28, morning: 156.8, evening: 155.4, note: '破156' },
    { month: 4, day: 29, morning: 154.7, evening: 157.3, note: '🏸 羽毛球2h' },
    { month: 4, day: 30, morning: 156.0, note: '羽毛球后第2天' },
    { month: 5, day: 1, note: '🎉 五一 未称，大鱼大肉+篮球3天' },
    { month: 5, day: 2, note: '🎉 五一 未称，大鱼大肉+篮球3天' },
    { month: 5, day: 3, note: '🎉 五一 未称，大鱼大肉+篮球3天' },
    { month: 5, day: 4, note: '🎉 五一 未称，大鱼大肉+篮球3天' },
    { month: 5, day: 5, note: '🎉 五一 未称，大鱼大肉+篮球3天' },
    { month: 5, day: 6, morning: 154.3, evening: 156.5, note: '五一后恢复，破155' },
    { month: 5, day: 7, morning: 155.1, evening: 156.9 },
    { month: 5, day: 8, morning: 154.7, evening: 155.5 },
    { month: 5, day: 9, morning: 154.0, evening: 154.3 },
    { month: 5, day: 10, morning: 153.1, evening: 153.8, note: '破154' },
    { month: 5, day: 11, morning: 153.0, evening: 154.2 },
    { month: 5, day: 12, morning: 152.8, evening: 154.8 },
    { month: 5, day: 13, morning: 153.1, evening: 153.6 },
    { month: 5, day: 14, morning: 152.5, evening: 153.2, note: '破153' },
    { month: 5, day: 15, morning: 151.6, note: '当晚大放纵' },
    { month: 5, day: 16, note: '全天放纵' },
    { month: 5, day: 17, evening: 152.5, note: '恢复饮食' },
    { month: 5, day: 18, morning: 151.2, evening: 152.2, note: '破152' },
    { month: 5, day: 19, morning: 150.9, evening: 153.1 },
    { month: 5, day: 20, morning: 151.5, evening: 151.7 },
    { month: 5, day: 21, morning: 150.6, evening: 151.3 },
    { month: 5, day: 22, morning: 150.2, evening: 151.4, note: '破151' },
    { month: 5, day: 23, morning: 149.8, evening: 150.1, note: '🏀 篮球2h' },
    { month: 5, day: 24, morning: 149.0, evening: 149.2, note: '🔥 破150' },
    { month: 5, day: 25, morning: 148.1, evening: 150.1, note: '🔥 历史新低 晚放纵鸡排烤肠' },
    { month: 5, day: 26, morning: 150.8, evening: 152.5, note: '⚠️ 放纵峰值' },
    { month: 5, day: 27, morning: 151.0, evening: 151.2, note: '↩ 恢复中' },
    { month: 5, day: 28, morning: 150.0, evening: 151.4 },
    { month: 5, day: 29, morning: 149.9, evening: 150.9 },
    { month: 5, day: 30, morning: 149.8, evening: 151.5 },
    { month: 5, day: 31, morning: 150.4, evening: 150.9 },
    { month: 6, day: 1, morning: 149.6, evening: 150.7 },
    { month: 6, day: 2, morning: 149.6, evening: 150.9 },
    { month: 6, day: 3, morning: 149.3, evening: 150.7 },
    { month: 6, day: 4, morning: 149.7, evening: 150.2 },
    { month: 6, day: 5, morning: 149.1, evening: 150.4 },
    { month: 6, day: 6, morning: 149.0, evening: 147.0, note: '🏀 篮球2h' },
    { month: 6, day: 7, morning: 146.0, evening: 148.5, note: '🔥 历史新低！破147' },
    { month: 6, day: 8, morning: 147.5, evening: 148.8, note: '暴饮暴食' },
    { month: 6, day: 9, morning: 150.4, evening: 150.3, note: '暴饮暴食' },
    { month: 6, day: 10, morning: 149.3, evening: 152.3, note: '恢复中，晚吃多了' },
    { month: 6, day: 11, morning: 150.3, evening: 150.4, note: '恢复中' },
    { month: 6, day: 12, morning: 149.1, evening: 150.4 },
    { month: 6, day: 13, morning: 148.8, evening: 149.6, note: '烧烤+凉面' },
    { month: 6, day: 14, morning: 149.2, evening: 149.1, note: '烧烤后自愈' },
    { month: 6, day: 15, morning: 147.9, evening: 149.4, note: '🔥 近期新低' },
    { month: 6, day: 16, morning: 147.9, evening: 149.3 },
    { month: 6, day: 17, morning: 148.0, evening: 147.7 },
    { month: 6, day: 18, morning: 146.4, evening: 147.6, note: '🔥 近期新低 破147' },
    { month: 6, day: 19, morning: 147.2 },
    { month: 6, day: 20, note: '🎉 端午节 回家乱吃未称' },
    { month: 6, day: 21, note: '🎉 端午节 回家乱吃未称' },
    { month: 6, day: 22, morning: 148.2, evening: 149.2, note: '端午后恢复' },
    { month: 6, day: 23, morning: 148.3, evening: 148.3 },
    { month: 6, day: 24, morning: 147.1, evening: 149.8 },
    { month: 6, day: 25, morning: 148.2, evening: 149.2 },
    { month: 6, day: 26, morning: 147.9, evening: 148.6 },
    { month: 6, day: 27, morning: 146.9, evening: 149.2, note: '近期新低' },
    { month: 6, day: 28, morning: 147.6, evening: 149.2 },
    { month: 6, day: 29, morning: 148.2, evening: 148.6 },
    { month: 6, day: 30, morning: 147.7 },
    { month: 7, day: 1, note: '暴饮暴食 薯片零食 吃饱睡觉' },
    { month: 7, day: 2, morning: 149.2, evening: 148.3, note: '暴食后恢复' },
    { month: 7, day: 3, morning: 147.1 },
];

export function createPresetRecords(): WeightRecord[] {
    const year = new Date().getFullYear();
    return PRESET_ENTRIES.map((entry) => {
        const mm = String(entry.month).padStart(2, '0');
        const dd = String(entry.day).padStart(2, '0');
        const record: WeightRecord = {
            id: `preset-${year}-${mm}-${dd}`,
            date: `${year}-${mm}-${dd}`,
        };
        if (entry.morning !== undefined) record.morning = entry.morning;
        if (entry.evening !== undefined) record.evening = entry.evening;
        if (entry.note) record.note = entry.note;
        return record;
    });
}
