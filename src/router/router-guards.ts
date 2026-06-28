import { type Router, isNavigationFailure } from 'vue-router';
import NProgress from 'nprogress';
import { useRouteStoreWidthOut } from '@/store/modules/route';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStoreWidthOut } from '@/store/modules/permission';
import { PageEnum } from '@/enums/pageEnum';
import { isIntegratedMode, getMbaseToken, getMbaseCompanyId, markPortalSource, cleanPortalParamsFromUrl } from '@/utils/auth';

NProgress.configure({ parent: '#app', showSpinner: false, minimum: 0.3, speed: 200 });

let npTimer: ReturnType<typeof setTimeout>;

// 路由白名单（无需登录即可访问）
const whitePathList = [PageEnum.BASE_LOGIN];

// 不再硬编码 systemPaths — 所有在 router 中注册的命名路由（modules.ts / menu.ts）
// 只要已登录即可访问，权限系统仅控制 TabBar 菜单可见性

/**
 * 集成模式下从 mbase 获取 token 与 companyId
 *
 * mbase 通过 URL query 透传 portal_token + companyId（buildAppUrl 生成），
 * 子应用同步读取并注入 userStore：token 用于请求头鉴权，
 * companyId 为后端权限校验必需（缺失会被拒为"用户不属于所选公司"）。
 * 同时持久化门户来源标记并清除地址栏 token，避免暴露。
 */
async function tryAcquireMbaseToken(userStore: ReturnType<typeof useUserStore>): Promise<boolean> {
    const token = getMbaseToken();
    if (!token) return false;
    userStore.setToken(token);
    // companyId 同步注入，供业务接口权限校验使用
    userStore.setCompanyId(getMbaseCompanyId());
    // 标记门户来源（清 URL 后仍可识别），并立即清除地址栏 token
    markPortalSource();
    cleanPortalParamsFromUrl();
    return true;
}

/**
 * 处理未认证状态
 * @returns true = token 已获取（集成模式成功），false = 需要跳转登录页
 */
async function handleUnauthenticated(userStore: ReturnType<typeof useUserStore>): Promise<boolean> {
    if (!isIntegratedMode()) return false;
    return tryAcquireMbaseToken(userStore);
}

/** 确保权限数据已加载（静默降级） */
async function ensurePermissionsLoaded(): Promise<void> {
    const permissionStore = usePermissionStoreWidthOut();
    if (!permissionStore.isLoaded) {
        try {
            await permissionStore.loadPermissions();
        } catch {
            // 权限加载失败，继续放行（降级为无权限控制）
        }
    }
}

export function createRouterGuards(router: Router) {
    router.beforeEach(async (to, _from, next) => {
        // 延迟显示 NProgress，快速导航（tab切换）不会出现进度条闪烁
        clearTimeout(npTimer);
        npTimer = setTimeout(() => NProgress.start(), 80);

        // 白名单页面直接放行
        if (whitePathList.includes(to.path as PageEnum)) {
            next();
            return;
        }

        const userStore = useUserStore();

        // 未登录时的处理逻辑
        if (!userStore.getToken) {
            const resolved = await handleUnauthenticated(userStore);
            if (!resolved) {
                next(PageEnum.BASE_LOGIN);
                return;
            }
        }

        // 已登录 → 确保权限已加载
        await ensurePermissionsLoaded();

        // 已注册的命名路由直接放行（modules.ts / menu.ts 中定义的页面）
        if (to.name && to.matched.length > 0) {
            next();
            return;
        }

        // 未注册路由 → 跳转首页
        next(PageEnum.BASE_HOME);
    });

    // 进入某个路由之后触发的钩子
    router.afterEach((to, _, failure) => {
        // 设置每个页面的 title
        document.title = (to?.meta?.title as string) || document.title;

        if (isNavigationFailure(failure)) {
            console.warn('failed navigation', failure);
        }

        const routeStore = useRouteStoreWidthOut();
        // 在这里设置需要缓存的组件名称
        const {keepAliveComponents} = routeStore;

        // 获取当前组件名
        const currentComName: any = to.matched.find(item => item.name === to.name)?.name;

        // 如果 currentComName 且 keepAliveComponents 不包含 currentComName 且 即将要进入的路由 meta 属性里 keepAlive 为 true，则缓存该组件
        if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
            // 需要缓存的组件
            keepAliveComponents.push(currentComName);
            // keepAlive 为 false 则不缓存
        } else if (!to.meta?.keepAlive) {
            // 不需要缓存的组件

            // 这里的作用一开始组件设置为缓存，之后又设置不缓存但是它还是存在 keepAliveComponents 数组中
            // keepAliveComponents 使用 findIndex 与 当前路由对比，如果存在则返回具体下标位置，不存在返回 -1
            const index = routeStore.keepAliveComponents.findIndex(name => name === currentComName);
            if (index !== -1) {
                // 通过返回具体下标位置删除 keepAliveComponents 数组中缓存的 元素
                keepAliveComponents.splice(index, 1);
            }
        }
        routeStore.setKeepAliveComponents(keepAliveComponents);
        clearTimeout(npTimer);
        NProgress.done();
    });

    router.onError(error => {
        console.error(error, '路由错误');
    });
}
