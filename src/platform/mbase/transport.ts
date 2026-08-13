import { getMbaseHost } from './host';

const APP_BRIDGE_WAIT_MS = 6000;

export class MbaseBridgeError extends Error {
    code: string;
    details?: unknown;

    constructor(code: string, message: string, details?: unknown) {
        super(message);
        this.name = 'MbaseBridgeError';
        this.code = code;
        this.details = details;
    }
}

export function resolveMbaseOrigin(): string {
    const configured = String(import.meta.env.VITE_MBASE_ORIGIN || '').trim();
    const candidate = configured || document.referrer;
    if (!candidate) {
        throw new MbaseBridgeError(
            'mbase_origin_missing',
            '未配置 VITE_MBASE_ORIGIN，无法安全地向门户发送消息',
        );
    }
    try {
        return new URL(candidate, window.location.origin).origin;
    } catch {
        throw new MbaseBridgeError('mbase_origin_invalid', 'VITE_MBASE_ORIGIN 不是有效地址', {
            configured,
        });
    }
}

function hasAppSdk(): boolean {
    return typeof window.uni?.postMessage === 'function';
}

function hasNativeBridge(): boolean {
    return Boolean(
        window.plus ||
        window.__dcloud_weex_postMessage ||
        window.__dcloud_weex_,
    );
}

function waitForAppBridge(timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        let timer: ReturnType<typeof setTimeout> | undefined;

        const cleanup = () => {
            if (timer) clearTimeout(timer);
            document.removeEventListener('UniAppJSBridgeReady', probe);
            document.removeEventListener('plusready', probe);
        };
        const probe = () => {
            if (hasAppSdk() && hasNativeBridge()) {
                cleanup();
                resolve();
                return;
            }
            if (Date.now() - startedAt >= timeoutMs) {
                cleanup();
                reject(new MbaseBridgeError(
                    'app_bridge_not_ready',
                    'App WebView 桥接未就绪，请确认 uni.webview SDK 与原生容器状态',
                    getMbaseTransportStatus(),
                ));
                return;
            }
            timer = setTimeout(probe, 80);
        };

        document.addEventListener('UniAppJSBridgeReady', probe);
        document.addEventListener('plusready', probe);
        probe();
    });
}

export async function waitForMbaseAppBridge(timeoutMs = APP_BRIDGE_WAIT_MS): Promise<void> {
    if (typeof window === 'undefined') {
        throw new MbaseBridgeError('bridge_unavailable', '当前运行环境不支持 WebView 桥接');
    }
    await waitForAppBridge(timeoutMs);
}

export async function postMbaseMessage(message: Record<string, unknown>): Promise<void> {
    const host = getMbaseHost();
    if (host === 'app') {
        await waitForMbaseAppBridge();
        window.uni?.postMessage({ data: message });
        return;
    }
    if (host === 'iframe' && window.parent !== window.self) {
        window.parent.postMessage(message, resolveMbaseOrigin());
        return;
    }
    throw new MbaseBridgeError('bridge_unavailable', '当前页面未运行在 wl-mbase 宿主中');
}

export function getMbaseTransportStatus() {
    let portalOrigin = '';
    try {
        portalOrigin = resolveMbaseOrigin();
    } catch {
        portalOrigin = '';
    }
    return {
        host: getMbaseHost(),
        sdkPostMessage: typeof window !== 'undefined' && hasAppSdk(),
        nativeBridge: typeof window !== 'undefined' && hasNativeBridge(),
        portalOrigin,
    };
}
