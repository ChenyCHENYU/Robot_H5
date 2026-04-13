export interface RenderMode {
    key: 'normal' | 'optimized';
    icon: string;
    label: string;
}

export const renderModes: RenderMode[] = [
    { key: 'normal', icon: 'i-ph:warning-circle-bold', label: '正常渲染' },
    { key: 'optimized', icon: 'i-ph:rocket-launch-bold', label: '优化渲染' },
];
