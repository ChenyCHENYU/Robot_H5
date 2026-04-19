/**
 * PC 端网关 HTTP 请求工具
 *
 * 复用主 http 实例（共享 Token 注入、错误处理、重试策略），
 * 仅覆盖 apiUrl 和 urlPrefix 指向 PC 端网关地址。
 *
 * 用途：登录鉴权、菜单权限、用户信息等与 PC 端共享的接口。
 */
import { http } from './index';
import type { RequestOptions } from '@miracle-web/utils';
import { useEnv } from '@/hooks/useEnv';

const { getEnvConfig } = useEnv();

/** 获取 PC 端网关请求选项 */
function pcOptions(): Partial<RequestOptions> {
    const config = getEnvConfig();
    return {
        apiUrl: config.pcApiUrl || '',
        urlPrefix: config.pcUrlPrefix || '',
    };
}

/** PC 网关 GET 请求 */
export function pcGet<T = any>(url: string, params?: object, options?: Partial<RequestOptions>) {
    return http.request<T>({ url, method: 'GET', params }, { ...pcOptions(), ...options });
}

/** PC 网关 POST 请求 */
export function pcPost<T = any>(url: string, data?: object, options?: Partial<RequestOptions>) {
    return http.request<T>({ url, method: 'POST', data }, { ...pcOptions(), ...options });
}
