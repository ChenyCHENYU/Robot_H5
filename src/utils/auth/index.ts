/**
 * 认证适配器 — 双模式登录机制
 *
 * 设计原则：
 * - standalone 模式：使用项目自身的登录页面和 token 管理（当前默认行为，不做任何改变）
 * - integrated 模式：作为 mbase 子应用时，从 mbase 获取 token，跳过自身登录
 *
 * 切换方式：通过环境变量 VITE_APP_MODE 控制，不侵入业务代码
 *
 * mbase 集成机制（对齐 wl-mbase 当前实现）：
 * - mbase 打开子应用时通过 URL 透传认证参数（buildAppUrl 生成）：
 *   ?portal_token=xxx&from=portal&user_id=xxx&companyId=xxx
 * - 子应用读取的 token 参数名固定为 portal_token
 * - companyId 为权限校验必需，缺失会被后端拒为"用户不属于所选公司"
 */

export type AppMode = 'standalone' | 'integrated';

/** 获取当前应用运行模式 */
export function getAppMode(): AppMode {
    const mode = import.meta.env.VITE_APP_MODE as string;
    return mode === 'integrated' ? 'integrated' : 'standalone';
}

/** 是否为集成模式（作为 mbase 子应用） */
export function isIntegratedMode(): boolean {
    return getAppMode() === 'integrated';
}

/** 是否为独立模式 */
export function isStandaloneMode(): boolean {
    return getAppMode() === 'standalone';
}

/** 从 URL（含 hash query）读取指定参数 */
function getUrlParam(name: string): string {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    return urlParams.get(name) || hashParams.get(name) || '';
}

/**
 * 集成模式下从 mbase 获取 Token
 *
 * mbase 通过 URL query 透传 portal_token（buildAppUrl 生成），
 * 子应用从 URL 读取，参数名固定为 portal_token。
 *
 * @returns token 字符串，获取失败返回空字符串
 */
export function getMbaseToken(): string {
    return getUrlParam('portal_token');
}

/**
 * 集成模式下从 mbase 获取当前公司 ID
 *
 * mbase 透传的 companyId 是后端权限校验的必需参数，
 * 缺失会被拒为"用户不属于所选公司"。
 *
 * @returns companyId 字符串，获取失败返回空字符串
 */
export function getMbaseCompanyId(): string {
    return getUrlParam('companyId');
}

/**
 * 集成模式下从 mbase 获取用户 ID（透传自基座登录态）
 *
 * @returns userId 字符串，获取失败返回空字符串
 */
export function getMbaseUserId(): string {
    return getUrlParam('user_id');
}

/**
 * 是否来自 mbase 门户（URL 带 from=portal 标识）
 */
export function isFromPortal(): boolean {
    return getUrlParam('from') === 'portal';
}
