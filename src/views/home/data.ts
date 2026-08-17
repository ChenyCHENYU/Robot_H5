import menu1 from '@/assets/menu/menu_1.svg';

/** 首页宫格菜单项 */
export interface HomeMenu {
    title: string;
    path: string;
    icon: string;
    /** 角标内容（老系统 van-badge 契约，未设置则不显示） */
    content?: string | number;
    auth?: boolean;
}

/** 首页宫格菜单分组 */
export interface HomeMenuGroup {
    text: string;
    children: HomeMenu[];
}

/** 首页业务菜单宫格（3 组，图标/跳转路径与老计量系统一致，图标沿用老 menu_1） */
export const menuGroups: HomeMenuGroup[] = [
    {
        text: '厂内调拨过磅委托管理',
        children: [
            { title: '过磅委托', path: '/transferWeighing/entrustList', icon: menu1, auth: true },
            { title: '磅单列表', path: '/transferWeighing/ticketList', icon: menu1, auth: true },
        ],
    },
    {
        text: '磅秤巡检管理',
        children: [{ title: '巡检任务', path: '/scaleInspection/taskList', icon: menu1, auth: true }],
    },
    {
        text: '校秤任务管理',
        children: [{ title: '校秤任务', path: '/weightVerify/taskList', icon: menu1, auth: true }],
    },
];
