export type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'default';

export interface TableTagMap {
    [value: string]: { text?: string; type: TagType };
}

export interface TableOperation<Row = Record<string, unknown>> {
    /** 按钮标签 */
    label: string;
    /** 按钮类型 */
    type?: TagType;
    /** 左侧图标（UnoCSS 类名） */
    icon?: string;
    /** 条件显示（默认 true） */
    show?: (row: Row) => boolean;
    /** 条件禁用 */
    disabled?: (row: Row) => boolean;
    /** 点击回调 */
    onClick: (row: Row) => void;
}

export interface TableColumn<Row = Record<string, unknown>> {
    /** 字段名（对应数据 key） */
    key: string;
    /** 列标题 */
    label: string;
    /** 是否固定显示为主标题（第一行大字）*/
    primary?: boolean;
    /** 是否作为副标题（第二行） */
    secondary?: boolean;
    /** Tag 颜色映射（有此项时自动渲染彩色 Tag） */
    tagMap?: TableTagMap;
    /** 自定义渲染插槽名（slot name = `cell-${key}`） */
    slot?: boolean;
    /** 右侧对齐（用于数字/状态类列） */
    alignRight?: boolean;
    /** 自定义格式化（优先于 tagMap） */
    format?: (val: unknown, row: Row) => string;
    /** 是否在卡片底部 meta 行显示（label: value 形式） */
    meta?: boolean;
    /** 是否隐藏 */
    hidden?: boolean;
}

export interface CTableInstance {
    refresh: () => void;
}
