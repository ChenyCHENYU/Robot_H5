import { get } from '@/utils/http';
import { withMbaseCompanyContext } from '@/platform/mbase/company-context';

/** 获取当前用户在指定应用下的菜单树 */
export const getAppMenus = (appId: string) =>
    get('/system/menu/getRouters', withMbaseCompanyContext({ appId }));

/** 获取当前用户的按钮级权限码列表 */
export const getUserPermissions = (appId: string) =>
    get('/system/menu/getPermissions', withMbaseCompanyContext({ appId }));
