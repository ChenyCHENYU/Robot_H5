export interface SettingCell {
    title: string;
    icon: string;
    color: string;
    to?: string;
    value?: string;
    danger?: boolean;
    action?: 'logout';
}

export const settingsGroups: SettingCell[][] = [
    [
        { title: '账号与安全', icon: 'ph:shield-check-bold', color: 'var(--ds-violet)', to: '/accountSetting' },
        { title: '主题与外观', icon: 'ph:palette-bold', color: 'var(--ds-success)', to: '/themeSetting' },
    ],
    [
        { title: '关于', icon: 'ph:info-bold', color: 'var(--ds-text-secondary)', to: '/about' },
    ],
    [
        { title: '退出登录', icon: 'ph:sign-out-bold', color: 'var(--ds-danger)', danger: true, action: 'logout' },
    ],
];
