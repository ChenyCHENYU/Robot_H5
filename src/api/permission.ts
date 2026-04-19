import { pcGet } from '@/utils/http/pcHttp';

/**
 * 获取当前用户在指定应用下的菜单树
 * PC 端系统中创建应用 → 绑定菜单和权限 → 此接口返回移动端可用菜单
 */
export const getAppMenus = (appId: string) =>
    pcGet('/system/menu/getRouters', { appId });

/**
 * 获取当前用户的按钮级权限码列表
 * 返回如 ['customer:add', 'customer:edit', 'order:delete'] 的字符串数组
 */
export const getUserPermissions = (appId: string) =>
    pcGet('/system/menu/getPermissions', { appId });
