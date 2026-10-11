import { showDialog, showFailToast, showSuccessToast } from 'vant';
import { axios, BrowserType, type AxiosRequestConfig, type AxiosResponse, type RequestOptions } from '@miracle-web/utils';
import { isIntegratedMode, isFromPortal, notifyPortalLogout } from '@/utils/auth';
import { ResultEnum } from './httpEnum';
import { useEnv } from '@/hooks/useEnv';
import { useUserStoreWidthOut } from '@/store/modules/user';

export interface ApiRes<T = unknown> {
    code: number;
    message: string;
    data: T;
}

export class ApiError extends Error {
    constructor(message: string, readonly code: number) {
        super(message);
        this.name = 'ApiError';
    }
}

export type HttpOptions = Partial<RequestOptions> & {
    /** 默认返回 data；需要完整业务响应时显式开启。 */
    returnEnvelope?: boolean;
};

const client = axios.create({ timeout: 10000 });
let expiryTask: Promise<void> | undefined;

async function handleSessionExpired() {
    if (expiryTask) return expiryTask;
    expiryTask = (async () => {
        const userStore = useUserStoreWidthOut();
        const fromPortal = isIntegratedMode() && isFromPortal();
        userStore.clearLocalSession();
        if (fromPortal) {
            await notifyPortalLogout().catch(() => undefined);
            return;
        }
        await showDialog({ title: '提示', message: '登录身份已失效，请重新登录!' });
        const { default: router } = await import('@/router');
        await router.replace('/login');
    })().finally(() => { expiryTask = undefined; });
    return expiryTask;
}

function resolveUrl(url: string, options: HttpOptions) {
    if (/^https?:\/\//i.test(url)) return url;
    const { getEnvConfig } = useEnv();
    const env = getEnvConfig();
    const prefix = options.joinPrefix === false ? '' : (options.urlPrefix ?? env.urlPrefix ?? '');
    return `${options.apiUrl ?? env.apiUrl ?? ''}${prefix}${url}`;
}

function requestHeaders(config: AxiosRequestConfig, options: HttpOptions) {
    const headers = { ...config.headers } as Record<string, string>;
    const token = useUserStoreWidthOut().getToken;
    if (token && options.withToken !== false) {
        const scheme = isIntegratedMode() ? 'Bearer' : '';
        headers.Authorization = scheme ? `${scheme} ${token}` : token;
    }
    const { platform, system } = BrowserType();
    headers['mi-platform'] = platform;
    headers['mi-system'] = system;
    return headers;
}

function prepareRequest(config: AxiosRequestConfig, options: HttpOptions): AxiosRequestConfig {
    const params = { ...config.params };
    if ((config.method || 'GET').toUpperCase() === 'GET' && options.joinTime !== false) params._t = Date.now();
    return { ...config, url: resolveUrl(config.url || '', options), headers: requestHeaders(config, options), params };
}

function isTransientError(error: unknown) {
    if (!axios.isAxiosError(error) || axios.isCancel(error)) return false;
    const status = error.response?.status;
    return !status || status === 429 || status >= 500;
}

async function sendAttempt(config: AxiosRequestConfig, remaining: number, delay: number): Promise<AxiosResponse> {
    try { return await client.request(config); }
    catch (error) {
        if (!remaining || config.signal?.aborted || !isTransientError(error)) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        if (config.signal?.aborted) throw error;
        return sendAttempt(config, remaining - 1, delay);
    }
}

function sendRequest(config: AxiosRequestConfig, options: HttpOptions) {
    const method = (config.method || 'GET').toUpperCase();
    // 写操作不自动重试；调用方应在业务层通过幂等契约处理。
    const safe = ['GET', 'HEAD'].includes(method) && options.retryOptions?.isRetry !== false;
    const count = safe ? Math.min(3, Math.max(0, options.retryOptions?.retryCount ?? 2)) : 0;
    return sendAttempt(config, count, options.retryOptions?.retryWaitTime ?? 1000);
}

function isExpired(code: number) {
    return code === ResultEnum.TOKEN_EXPIRED || code === ResultEnum.PLATFORM_TOKEN_EXPIRED;
}

function validateResponse<T>(body: ApiRes<T>) {
    const code = Number(body?.code);
    if (isExpired(code)) void handleSessionExpired().catch(() => undefined);
    if (code !== ResultEnum.SUCCESS && code !== ResultEnum.PLATFORM_SUCCESS) {
        throw new ApiError(body?.message || '请求失败，请稍后重试', code);
    }
}

function decodeResponse<T>(response: AxiosResponse<ApiRes<T>>, options: HttpOptions): T | ApiRes<T> | AxiosResponse<ApiRes<T>> {
    const body = response.data;
    validateResponse(body);
    if (options.isShowSuccessMessage) showSuccessToast(options.successMessageText || body.message);
    if (options.isReturnNativeResponse) return response;
    if (options.returnEnvelope || options.isTransformResponse === true) return body;
    return body.data;
}

function reportError(error: unknown, options: HttpOptions) {
    if (axios.isAxiosError(error) && error.response?.status === 401) void handleSessionExpired().catch(() => undefined);
    if (axios.isCancel(error) || options.isShowMessage === false) return;
    const message = error instanceof Error ? error.message : '请求失败';
    showFailToast(options.errorMessageText || (message === 'Network Error' ? '网络连接失败，请稍后重试' : message));
}

async function request<T = unknown>(config: AxiosRequestConfig, options: HttpOptions & { isReturnNativeResponse: true }): Promise<AxiosResponse<ApiRes<T>>>;
async function request<T = unknown>(config: AxiosRequestConfig, options: HttpOptions & { returnEnvelope: true }): Promise<ApiRes<T>>;
async function request<T = unknown>(config: AxiosRequestConfig, options: HttpOptions & { isTransformResponse: true }): Promise<ApiRes<T>>;
async function request<T = unknown>(config: AxiosRequestConfig, options?: HttpOptions): Promise<T>;
async function request<T = unknown>(config: AxiosRequestConfig, options: HttpOptions = {}) {
    try {
        const response = await sendRequest(prepareRequest(config, options), options);
        return decodeResponse<T>(response, options);
    } catch (error) {
        reportError(error, options);
        throw error;
    }
}

export const http = { request };
export const toast = (msg: string): HttpOptions => ({ isShowSuccessMessage: true, successMessageText: msg });
type DataOptions = Omit<HttpOptions, 'returnEnvelope' | 'isReturnNativeResponse' | 'isTransformResponse'>;
export const get = <T = unknown>(url: string, params?: object, options?: DataOptions) => request<T>({ url, method: 'GET', params }, options);
export const post = <T = unknown>(url: string, data?: object, options?: DataOptions) => request<T>({ url, method: 'POST', data }, options);
export const put = <T = unknown>(url: string, data?: object, options?: DataOptions) => request<T>({ url, method: 'PUT', data }, options);
export const del = <T = unknown>(url: string, params?: object, options?: DataOptions) => request<T>({ url, method: 'DELETE', params }, options);
