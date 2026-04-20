export interface Quote {
    text: string;
    author: string;
}

export interface QuickAction {
    icon: string;
    label: string;
    desc: string;
    route: string;
    color: string;
}

export interface Feature {
    icon: string;
    title: string;
    desc: string;
    color: string;
}

export const quotes: Quote[] = [
    { text: '构建有温度的产品，让每一行代码都有意义。', author: '金恒' },
    { text: 'Stay curious. Stay humble. Keep shipping.', author: 'AGILE TEAM' },
    { text: '好的设计是看不见的，好的代码也是。', author: '金恒' },
    { text: '把复杂的事做简单，把简单的事做极致。', author: 'AGILE TEAM' },
    { text: '每一个像素，都应该值得被认真对待。', author: '金恒' },
];

export const quickActions: QuickAction[] = [
    { icon: 'ph:wrench-bold', label: '工单表单', desc: '多步骤 · 动态验证', route: '/formDemo', color: '#FF9500' },
    { icon: 'ph:address-book-bold', label: '客户档案', desc: '完整 CRUD 业务模板', route: '/customerArchive', color: '#5856D6' },
    { icon: 'ph:chart-bar-bold', label: '数据图表', desc: 'ECharts 可视化', route: '/chart', color: '#0071E3' },
    { icon: 'ph:pen-nib-bold', label: '手写签名', desc: 'Canvas 笔迹识别', route: '/hooks/signature', color: '#FF2D55' },
];

export interface StatItem {
    label: string;
    value: string;
    up?: boolean;
}

export const statsItems: StatItem[] = [
    { label: '组件', value: '16' },
    { label: '能力', value: '15' },
    { label: 'TypeScript', value: '100%', up: true },
];

export const heroOrbCount = 4;

export const features: Feature[] = [
    { icon: 'ph:lightning-bold', title: 'Vite 7', desc: '极速构建与热更新', color: '#FF9500' },
    { icon: 'ph:paint-brush-bold', title: 'UnoCSS', desc: '原子化 CSS 引擎', color: '#FF2D55' },
    { icon: 'ph:shield-check-bold', title: 'TypeScript', desc: '全量类型安全', color: '#5856D6' },
    { icon: 'ph:database-bold', title: 'Pinia', desc: '响应式状态管理', color: '#34C759' },
    { icon: 'ph:chart-bar-bold', title: 'ECharts', desc: '可视化图表引擎', color: '#0071E3' },
    { icon: 'ph:atom-bold', title: 'Core Hooks', desc: '15 个设备能力 Hook', color: '#7551CD' },
];
