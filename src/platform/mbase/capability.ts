import { getMbaseHost, isMbaseHosted } from './host';
import { MbaseBridgeError, postMbaseMessage, resolveMbaseOrigin } from './transport';

const SOURCE = 'mbase-bridge';
const PROTOCOL = 1;
const APP_RESULT_EVENT = 'mbase:bridge-result';
const DEFAULT_TIMEOUT_MS = 60000;

interface CapabilityResult<T> {
    source: typeof SOURCE;
    type: 'capability:result';
    id: string;
    ok: boolean;
    data?: T;
    error?: string;
    reason?: string;
    _debug?: unknown;
}

function parseMessage<T>(value: unknown): CapabilityResult<T> | null {
    if (value && typeof value === 'object') return value as CapabilityResult<T>;
    if (typeof value !== 'string') return null;
    try {
        return JSON.parse(value) as CapabilityResult<T>;
    } catch {
        return null;
    }
}

/**
 * 调用 @robot-h5/core 尚未封装的 wl-mbase v1 能力。
 * 拍照、扫码、定位优先使用 core 对应 Hook；媒体选择等扩展能力才使用本函数。
 */
export function invokeMbaseCapability<T = Record<string, unknown>>(
    api: string,
    payload: Record<string, unknown> = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
    if (!isMbaseHosted()) {
        return Promise.reject(new MbaseBridgeError(
            'unsupported',
            '当前环境未接入 wl-mbase，无法调用宿主能力',
            { api },
        ));
    }

    const host = getMbaseHost();
    const id = `robot:${api}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;

    return new Promise((resolve, reject) => {
        let finished = false;

        const cleanup = () => {
            window.removeEventListener('message', onWindowMessage);
            window.removeEventListener(APP_RESULT_EVENT, onAppResult as EventListener);
            clearTimeout(timer);
        };
        const finish = (callback: (value: any) => void, value: any) => {
            if (finished) return;
            finished = true;
            cleanup();
            callback(value);
        };
        const handleResult = (raw: unknown) => {
            const message = parseMessage<T>(raw);
            if (
                !message ||
                message.source !== SOURCE ||
                message.type !== 'capability:result' ||
                message.id !== id
            ) return;

            if (message.ok) {
                finish(resolve, message.data as T);
                return;
            }
            finish(reject, new MbaseBridgeError(
                message.error || 'invoke_failed',
                message.reason || '基座能力调用失败',
                { api, id, host, response: message._debug },
            ));
        };
        const onWindowMessage = (event: MessageEvent) => {
            if (host !== 'iframe' || event.source !== window.parent) return;
            if (event.origin !== resolveMbaseOrigin()) return;
            handleResult(event.data);
        };
        const onAppResult = (event: Event) => {
            if (host === 'app') handleResult((event as CustomEvent).detail);
        };

        window.addEventListener('message', onWindowMessage);
        window.addEventListener(APP_RESULT_EVENT, onAppResult as EventListener);
        const timer = setTimeout(() => {
            finish(reject, new MbaseBridgeError(
                'timeout',
                `基座 ${timeoutMs / 1000} 秒内未响应`,
                { api, id, host },
            ));
        }, timeoutMs);

        postMbaseMessage({
            source: SOURCE,
            type: 'capability:invoke',
            protocol: PROTOCOL,
            id,
            api,
            payload,
            host: host || '',
        }).catch(error => finish(reject, error));
    });
}
