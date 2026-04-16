import type { PickerOption } from 'vant';

// ── 故障类型选项 ─────────────────────────────────────────────
export const FAULT_OPTIONS: PickerOption[] = [
    { text: '机械故障', value: 'mechanical' },
    { text: '电气故障', value: 'electrical' },
    { text: '液压故障', value: 'hydraulic' },
    { text: '仪表异常', value: 'instrument' },
    { text: '其他', value: 'other' },
];

/** value → label 映射，供回显用 */
export const FAULT_LABEL_MAP: Record<string, string> = Object.fromEntries(
    FAULT_OPTIONS.map((o) => [o.value as string, o.text as string]),
);

// ── 紧急程度选项 ─────────────────────────────────────────────
export interface UrgencyOption {
    value: string;
    label: string;
    color: string;
}

export const URGENCY_OPTIONS: UrgencyOption[] = [
    { value: 'normal', label: '一般', color: 'var(--ds-text-secondary)' },
    { value: 'urgent', label: '紧急', color: 'var(--ds-warning)' },
    { value: 'critical', label: '特急', color: 'var(--ds-danger)' },
];

// ── 故障部位选项 ─────────────────────────────────────────────
export interface PartOption {
    name: string;
    value: string;
}

export const PART_OPTIONS: PartOption[] = [
    { name: '主体', value: 'body' },
    { name: '传动系统', value: 'drive' },
    { name: '控制系统', value: 'control' },
    { name: '润滑系统', value: 'lube' },
];

