import { type ActionSheetAction, showToast } from 'vant';
import { useUserStore } from '@/store/modules/user';

/** 默认头像 — 渐变背景 + 人物轮廓 SVG */
export const DEFAULT_AVATAR =
    'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 120 120\'%3E%3Cdefs%3E%3ClinearGradient id=\'g\' x1=\'0\' y1=\'0\' x2=\'1\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23007aff\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%235856d6\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'120\' height=\'120\' rx=\'60\' fill=\'url(%23g)\'/%3E%3Ccircle cx=\'60\' cy=\'46\' r=\'18\' fill=\'rgba(255,255,255,.85)\'/%3E%3Cellipse cx=\'60\' cy=\'95\' rx=\'30\' ry=\'22\' fill=\'rgba(255,255,255,.85)\'/%3E%3C/svg%3E';

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
