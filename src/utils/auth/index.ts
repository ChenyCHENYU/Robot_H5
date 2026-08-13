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

import { postMbaseMessage } from '@/platform/mbase';

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

// ─── 门户来源标记（sessionStorage）───────────────────────────────────
// 清除地址栏 portal 参数后仍可判断是否来自 mbase 门户，
// 用于 token 失效等场景决定是否通知基座（而非跳自身登录页）。
const PORTAL_FROM_KEY = 'h5_login_from';
const PORTAL_FROM_VALUE = 'portal';

/** 标记当前访问来源为 mbase 门户 */
export function markPortalSource(): void {
    sessionStorage.setItem(PORTAL_FROM_KEY, PORTAL_FROM_VALUE);
}

/** 清除门户来源标记 */
export function clearPortalSource(): void {
    sessionStorage.removeItem(PORTAL_FROM_KEY);
}

/** 是否由 mbase 门户嵌入（from=portal） */
export function isFromPortal(): boolean {
    return sessionStorage.getItem(PORTAL_FROM_KEY) === PORTAL_FROM_VALUE;
}

// ─── URL 参数清理 ─────────────────────────────────────────────────────
/**
 * 从地址栏移除 portal_token、from，避免 token 残留在 URL 暴露。
 * 调用时机：子应用读取并应用 portal_token 之后。
 */
export function cleanPortalParamsFromUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('portal_token');
    url.searchParams.delete('from');
    const [hashPath, hashQuery = ''] = url.hash.split('?');
    if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery);
        hashParams.delete('portal_token');
        hashParams.delete('from');
        const cleanHashQuery = hashParams.toString();
        url.hash = `${hashPath}${cleanHashQuery ? `?${cleanHashQuery}` : ''}`;
    }
    const search = url.searchParams.toString();
    window.history.replaceState(null, '', url.pathname + (search ? `?${search}` : '') + url.hash);
}

// ─── 子应用 → 基座 通信 ───────────────────────────────────────────────
/**
 * 通知 mbase 基座子应用登录态失效（token 过期/拒绝，被动失效）。
 *
 * 集成模式下 token 由基座统一签发，子应用不应在 iframe 内跳自身登录页，
 * 而是通知基座（postMessage {action:'logout'}），由基座重新签发 token 或
 * 跳转登录页。基座 webview 页的 onMessage 会消费此消息。
 */
export async function notifyPortalLogout(): Promise<void> {
    await postMbaseMessage({ action: 'logout' }).catch(e => {
        console.warn('[auth] notifyPortalLogout failed:', e);
        throw e;
    });
}

/**
 * 通知 mbase 基座用户主动退出登录（区别于 token 失效的被动退出）。
 *
 * 子应用"退出登录"按钮触发时调用。基座收到 {action:'user-logout'} 后
 * 执行完整退出流程（调退出接口 + 跳登录页），避免子应用 iframe 退出后
 * 基座会话残留。
 */
export async function notifyPortalUserLogout(): Promise<void> {
    await postMbaseMessage({ action: 'user-logout' }).catch(e => {
        console.warn('[auth] notifyPortalUserLogout failed:', e);
        throw e;
    });
}

