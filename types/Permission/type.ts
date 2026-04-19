/**
 * 权限体系类型定义
 *
 * 菜单/权限数据来自 PC 端网关，移动端根据返回数据过滤本地路由。
 * 移动端不依赖模块联邦，所有页面组件本地打包，权限仅控制可见性。
 */

/** 后端菜单树节点（PC 端网关返回） */
export interface ApiMenuItem {
    /** 菜单 ID */
    menuId: number;
    /** 父级 ID（0 = 顶级） */
    parentId: number;
    /** 菜单名称 */
    menuName: string;
    /** 菜单类型：D=目录 M=菜单 B=按钮 */
    menuType: 'D' | 'M' | 'B';
    /** 路由路径（对应本地 router 的 path） */
    path: string;
    /** 图标（Iconify 类名，如 ph:house-bold） */
    icon?: string;
    /** 排序号 */
    orderNum: number;
    /** 是否可见（控制菜单/TabBar 是否显示） */
    visible: boolean;
    /** 是否缓存（KeepAlive） */
    keepAlive?: boolean;
    /** 权限标识（按钮级权限码，如 customer:add） */
    permission?: string;
    /** 子菜单 */
    children?: ApiMenuItem[];
}

/** 扁平化后的菜单权限信息 */
export interface PermissionInfo {
    /** 当前用户可访问的路由路径集合 */
    allowedPaths: string[];
    /** 当前用户的按钮权限码集合 */
    buttonPermissions: string[];
    /** TabBar 可见菜单（经过权限过滤） */
    tabBarMenus: ApiMenuItem[];
}
