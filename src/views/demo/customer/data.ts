import type { PickerOption } from 'vant';

// 客户档案 demo 共享数据与类型定义

/** 客户状态 */
export const STATUS_MAP = {
    converted: { text: '已转化', type: 'success' as const },
    unconverted: { text: '未转化', type: 'danger' as const },
};

/** 客户类型 */
export const CATEGORY_MAP: Record<string, { text: string; type: 'primary' | 'success' | 'warning' }> = {
    hotRolled: { text: '热轧', type: 'primary' },
    wireRod: { text: '盘元', type: 'warning' },
    coldRolled: { text: '冷轧', type: 'success' },
};

/** 客户分类标签 */
export const CUSTOMER_TYPE_MAP: Record<string, string> = {
    temp: '临时客户',
    formal: '正式客户',
    public: '公海客户',
};

/** 客户分类 picker 选项 */
export const CLASS_OPTIONS: PickerOption[] = [
    { text: '重要客户', value: '重要客户' },
    { text: '普通客户', value: '普通客户' },
    { text: '潜在客户', value: '潜在客户' },
];

/** 产品类别 picker 选项（由 CATEGORY_MAP 动态生成） */
export const CATEGORY_OPTIONS: PickerOption[] = Object.entries(CATEGORY_MAP).map(([k, v]) => ({
    text: v.text,
    value: k,
}));

export type { Customer } from '#/Customer/type';

/** Tab 配置 */
export const TAB_LIST = [
    { key: 'all', label: '全部客户' },
    { key: 'temp', label: '临时客户' },
    { key: 'formal', label: '正式客户' },
    { key: 'public', label: '公海客户' },
];
