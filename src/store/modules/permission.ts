import { acceptHMRUpdate, defineStore } from 'pinia';
import { store } from '@/store';
import { getAppMenus, getUserPermissions } from '@/api/permission';
import { useEnv } from '@/hooks/useEnv';
import type { ApiMenuItem } from '#/Permission/type';

interface PermissionState {
    /** 后端返回的原始菜单树 */
    menuList: ApiMenuItem[];
    /** 按钮级权限码集合 */
    buttonPermissions: string[];
    /** 权限是否已加载 */
    isLoaded: boolean;
}

export const usePermissionStore = defineStore('app-permission-store', {
    state: (): PermissionState => ({
        menuList: [],
        buttonPermissions: [],
        isLoaded: false,
    }),
    getters: {
        /** 所有可访问的路由路径（扁平化） */
        getAllowedPaths(): string[] {
            return flattenMenuPaths(this.menuList);
        },
        /** TabBar 可见菜单（顶级目录下 menuType=M 且 visible=true） */
        getTabBarMenus(): ApiMenuItem[] {
            return extractTabBarMenus(this.menuList);
        },
        /** 检查是否有指定按钮权限 */
        hasPermission() {
            return (code: string) => this.buttonPermissions.includes(code);
        },
    },
    actions: {
        /**
         * 加载权限数据（登录后调用一次）
         */
        async loadPermissions() {
            const { getEnvConfig } = useEnv();
            const appId = getEnvConfig().appId || 'robot-h5';
            try {
                const [menuRes, permRes] = await Promise.all([
                    getAppMenus(appId),
                    getUserPermissions(appId),
                ]);
                this.menuList = (menuRes as any)?.data ?? menuRes ?? [];
                this.buttonPermissions = (permRes as any)?.data ?? permRes ?? [];
                this.isLoaded = true;
            } catch (error) {
                console.error('加载权限数据失败', error);
                // 权限加载失败时使用空数组，路由守卫会放行白名单页面
                this.menuList = [];
                this.buttonPermissions = [];
                this.isLoaded = true;
            }
        },

        /** 判断指定路由路径是否有权访问 */
        isRouteAllowed(path: string): boolean {
            // 权限未加载时放行（避免白屏）
            if (!this.isLoaded) return true;
            // 无菜单数据时放行（Mock 模式或权限接口未对接）
            if (this.menuList.length === 0) return true;
            return this.getAllowedPaths.includes(path);
        },

        /** 重置权限（登出时调用） */
        resetPermissions() {
            this.menuList = [];
            this.buttonPermissions = [];
            this.isLoaded = false;
        },
    },
});

/** 递归提取所有菜单路径 */
function flattenMenuPaths(menus: ApiMenuItem[]): string[] {
    const paths: string[] = [];
    for (const menu of menus) {
        if (menu.menuType !== 'B' && menu.path) {
            paths.push(menu.path);
        }
        if (menu.children?.length) {
            paths.push(...flattenMenuPaths(menu.children));
        }
    }
    return paths;
}

/** 提取 TabBar 级别菜单 */
function extractTabBarMenus(menus: ApiMenuItem[]): ApiMenuItem[] {
    // 查找顶级目录下的菜单项
    for (const item of menus) {
        if (item.menuType === 'D' && item.children?.length) {
            return item.children
                .filter(m => m.menuType === 'M' && m.visible)
                .sort((a, b) => a.orderNum - b.orderNum);
        }
    }
    // 如果没有目录层级，直接取顶级菜单
    return menus
        .filter(m => m.menuType === 'M' && m.visible)
        .sort((a, b) => a.orderNum - b.orderNum);
}

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot));
}

export function usePermissionStoreWidthOut() {
    return usePermissionStore(store);
}
