/**
 * 认证适配器 — 双模式登录机制
 *
 * 设计原则：
 * - standalone 模式：使用项目自身的登录页面和 token 管理（当前默认行为，不做任何改变）
 * - integrated 模式：作为 mbase 子应用时，从 mbase 获取 token，跳过自身登录
 *
 * 切换方式：通过环境变量 VITE_APP_MODE 控制，不侵入业务代码
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

/**
 * 集成模式下从 mbase 获取 Token
 *
 * 支持三种传递方式（通过 VITE_MBASE_TOKEN_METHOD 配置）：
 * 1. query   — mbase 通过 URL query 参数传递 token（如 ?token=xxx）
 * 2. postMessage — mbase 通过 window.postMessage 传递
 * 3. storage — mbase 与子应用共享同域 localStorage
 *
 * @returns token 字符串，获取失败返回空字符串
 */
export function getMbaseToken(): string {
    const method = import.meta.env.VITE_MBASE_TOKEN_METHOD as string || 'query';

    switch (method) {
        case 'query': {
            // 从 URL 参数中获取 token
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
            return urlParams.get('token') || hashParams.get('token') || '';
        }
        case 'storage': {
            // 从 localStorage 获取（mbase 与子应用同域时可共享）
            const MBASE_TOKEN_KEY = 'mbase_token';
            return localStorage.getItem(MBASE_TOKEN_KEY) || '';
        }
        case 'postMessage':
        default:
            // postMessage 方式需要异步监听，这里返回空
            // 实际通过 listenMbaseToken() 异步获取
            return '';
    }
}

/**
 * 监听 mbase 通过 postMessage 传递的 token（异步）
 *
 * @param callback 收到 token 后的回调
 * @param timeout 超时时间（ms），超时后 callback 收到空字符串
 */
export function listenMbaseToken(
    callback: (token: string) => void,
    timeout = 5000,
): () => void {
    const mbaseOrigin = import.meta.env.VITE_MBASE_ORIGIN as string || '*';

    let resolved = false;

    const handler = (event: MessageEvent) => {
        // 校验来源（安全性）
        if (mbaseOrigin !== '*' && event.origin !== mbaseOrigin) return;

        const { type, token } = event.data || {};
        if (type === 'mbase:token' && token && !resolved) {
            resolved = true;
            window.removeEventListener('message', handler);
            callback(token);
        }
    };

    window.addEventListener('message', handler);

    // 超时兜底
    const timer = setTimeout(() => {
        if (!resolved) {
            resolved = true;
            window.removeEventListener('message', handler);
            callback('');
        }
    }, timeout);

    // 返回清理函数
    return () => {
        resolved = true;
        clearTimeout(timer);
        window.removeEventListener('message', handler);
    };
}

/**
 * 通知 mbase 宿主应用（子应用 → 宿主通信）
 */
export function notifyMbase(type: string, payload?: Record<string, unknown>): void {
    const mbaseOrigin = import.meta.env.VITE_MBASE_ORIGIN as string || '*';
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type, ...payload }, mbaseOrigin);
    }
}
