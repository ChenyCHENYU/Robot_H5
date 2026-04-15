import { type ActionSheetAction, showToast } from 'vant';
import { useUserStore } from '@/store/modules/user';

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
        { title: '账号与安全', icon: 'ph:shield-check-bold', color: '#5856d6', to: '/accountSetting' },
        { title: '主题与外观', icon: 'ph:palette-bold', color: '#34c759', to: '/themeSetting' },
    ],
    [
        { title: '关于', icon: 'ph:info-bold', color: '#8e8e93', to: '/about' },
    ],
    [
        { title: '退出登录', icon: 'ph:sign-out-bold', color: '#ff3b30', danger: true, action: 'logout' },
    ],
];

export function createLogoutActions(): ActionSheetAction[] {
    const userStore = useUserStore();
    return [
        {
            name: '退出登录',
            color: '#FF3B30',
            callback: () => {
                userStore.Logout();
                showToast('已退出登录');
            },
        },
    ];
}
