export type MbaseHost = 'app' | 'iframe' | null;

const HOST_CACHE_KEY = '__ROBOT_H5_MBASE_HOST__';
const PORTAL_SESSION_KEY = 'h5_login_from';

function readUrlParam(name: string): string {
    if (typeof window === 'undefined') return '';
    const search = new URLSearchParams(window.location.search);
    const hashQuery = window.location.hash.split('?')[1] || '';
    return search.get(name) || new URLSearchParams(hashQuery).get(name) || '';
}

function isPortalIframe(): boolean {
    const fromPortal = readUrlParam('from') === 'portal';
    try {
        return window.parent !== window.self && (
            fromPortal || sessionStorage.getItem(PORTAL_SESSION_KEY) === 'portal'
        );
    } catch {
        // 跨域访问 parent 属性失败时仍须具备明确的门户来源标记。
        return fromPortal;
    }
}

function detectHost(): MbaseHost {
    if (typeof window === 'undefined' || import.meta.env.VITE_APP_MODE !== 'integrated') return null;

    const cached = window[HOST_CACHE_KEY];
    if (cached === 'app' || cached === 'iframe') return cached;

    if (window.__MBASE_BRIDGE_HOST__ === 'app' || readUrlParam('mbase_host') === 'app') {
        window.__MBASE_BRIDGE_HOST__ = 'app';
        window[HOST_CACHE_KEY] = 'app';
        return 'app';
    }

    if (isPortalIframe()) {
        window[HOST_CACHE_KEY] = 'iframe';
        return 'iframe';
    }

    return null;
}

// 必须在认证逻辑清除 from/portal_token 前固化宿主类型。
const initialHost = detectHost();

export function getMbaseHost(): MbaseHost {
    return initialHost || detectHost();
}

export function isMbaseHosted(): boolean {
    return getMbaseHost() !== null;
}

export function isMbaseAppHost(): boolean {
    return getMbaseHost() === 'app';
}

export function applyMbaseHostClass(): void {
    if (typeof document === 'undefined') return;
    const host = getMbaseHost();
    if (!host) return;
    document.documentElement.classList.add('mbase-hosted', `mbase-host-${host}`);
}
