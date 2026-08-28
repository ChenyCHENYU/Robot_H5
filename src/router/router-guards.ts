import { type Router, isNavigationFailure } from 'vue-router';
import NProgress from 'nprogress';
import { useRouteStoreWidthOut } from '@/store/modules/route';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStoreWidthOut } from '@/store/modules/permission';
import { PageEnum } from '@/enums/pageEnum';
import {
    cleanPortalParamsFromUrl,
    getMbaseCompanyId,
    getMbaseCompanyName,
    getMbaseToken,
    isIntegratedMode,
    markPortalSource,
} from '@/utils/auth';
import { initializeMbaseCompanyContext } from '@/platform/mbase/company-context';

NProgress.configure({ parent: '#app', showSpinner: false, minimum: 0.3, speed: 200 });

let npTimer: ReturnType<typeof setTimeout>;

// 路由白名单（无需登录即可访问）
const whitePathList = [PageEnum.BASE_LOGIN, PageEnum.PORTAL_CONTEXT_ERROR];

type PortalAcquireResult = 'acquired' | 'unavailable' | 'company-error';

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
async function tryAcquireMbaseToken(
    userStore: ReturnType<typeof useUserStore>
): Promise<PortalAcquireResult> {
    const token = getMbaseToken();
    if (!isIntegratedMode() || !token) return 'unavailable';
    const companyId = getMbaseCompanyId();
    const companyName = getMbaseCompanyName();

    // 门户 URL 是本次会话的权威来源。即使 Pinia 中仍有上次账号的持久化 token，
    // 也必须先清空旧用户和权限，再接收新身份，防止换号后展示旧账号信息。
    userStore.clearLocalSession();
    userStore.setToken(token);
    // companyId/companyName 必须在清理 URL 前读取并保存。
    userStore.setCompanyContext(companyId, companyName);
    // 标记门户来源（清 URL 后仍可识别），并立即清除地址栏 token
    markPortalSource();
    cleanPortalParamsFromUrl();

    // 先完成服务端公司上下文同步，再加载用户、权限、菜单和业务数据。
    // 同步失败必须阻断，不能带着旧公司上下文继续进入业务首页。
    try {
        await initializeMbaseCompanyContext({ companyId, companyName });
    } catch (error) {
        console.error('[company-context] 门户公司上下文初始化失败', error);
        return 'company-error';
    }

    // 用户信息失败不阻断页面打开；至少保证不会回显上一账号的数据。
    try {
        await userStore.GetUserInfo();
    } catch (error) {
        console.warn('[auth] 门户用户信息加载失败，已保留空用户态', error);
    }
    return 'acquired';
}

/**
 * 处理未认证状态
 * @returns true = token 已获取（集成模式成功），false = 需要跳转登录页
 */
async function handleUnauthenticated(
    userStore: ReturnType<typeof useUserStore>
): Promise<PortalAcquireResult> {
    if (!isIntegratedMode()) return 'unavailable';
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

        const userStore = useUserStore();

        // 公司初始化失败页不能再次触发权限加载，否则会用未就绪上下文发请求。
        if (to.path === PageEnum.PORTAL_CONTEXT_ERROR) {
            next();
            return;
        }

        // 每次导航都探测本次 URL；非 integrated 或无新 token 时会立即返回。
        // 不能仅在本地无 token 时处理，否则 WebView 复用时会继续使用旧账号/旧公司。
        const directAcquireResult = await tryAcquireMbaseToken(userStore);
        if (directAcquireResult === 'company-error') {
            next(PageEnum.PORTAL_CONTEXT_ERROR);
            return;
        }

        // 白名单页面直接放行
        if (whitePathList.includes(to.path as PageEnum)) {
            next();
            return;
        }

        // 未登录时的处理逻辑
        if (!userStore.getToken) {
            const acquireResult = await handleUnauthenticated(userStore);
            if (acquireResult === 'company-error') {
                next(PageEnum.PORTAL_CONTEXT_ERROR);
                return;
            }
            if (acquireResult !== 'acquired') {
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
