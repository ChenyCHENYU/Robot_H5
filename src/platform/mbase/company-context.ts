import { http } from '@/utils/http';
import { isIntegratedMode } from '@/utils/auth';
import { useUserStoreWidthOut } from '@/store/modules/user';

export type MbaseCompanySyncMode = 'server' | 'explicit';

export interface MbaseCompanyContext {
    companyId: string;
    companyName: string;
}

export type MbaseCompanyContextErrorCode =
    | 'company_context_missing'
    | 'company_context_sync_failed';

/** 公司上下文初始化错误；字段可直接交给现场诊断页展示。 */
export class MbaseCompanyContextError extends Error {
    readonly code: MbaseCompanyContextErrorCode;
    readonly endpoint?: string;
    readonly companyId: string;

    constructor(
        code: MbaseCompanyContextErrorCode,
        message: string,
        options: { endpoint?: string; companyId?: string; cause?: unknown } = {}
    ) {
        super(message);
        this.name = 'MbaseCompanyContextError';
        this.code = code;
        this.endpoint = options.endpoint;
        this.companyId = options.companyId || '';
        if (options.cause !== undefined) {
            Object.defineProperty(this, 'cause', {
                value: options.cause,
                configurable: true,
            });
        }
    }
}

function getCompanySyncMode(): MbaseCompanySyncMode {
    return import.meta.env.VITE_MBASE_COMPANY_SYNC_MODE === 'explicit' ? 'explicit' : 'server';
}

function getChangeCompanyEndpoint(): string {
    return String(import.meta.env.VITE_MBASE_CHANGE_COMPANY_API || '/hrms/user/changeCompany').trim();
}

function buildChangeCompanyUrl(endpoint: string, companyId: string): string {
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}companyId=${encodeURIComponent(companyId)}`;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error) return error;
    return '服务端公司上下文同步失败';
}

function createMissingCompanyError() {
    return new MbaseCompanyContextError(
        'company_context_missing',
        '缺少公司上下文，请从移动门户重新进入'
    );
}

function setCompanyContextError(error: MbaseCompanyContextError) {
    useUserStoreWidthOut().setCompanyContextStatus('error', {
        code: error.code,
        message: error.message,
        endpoint: error.endpoint,
    });
}

async function syncServerCompanyContext(companyId: string): Promise<void> {
    const userStore = useUserStoreWidthOut();
    const endpoint = getChangeCompanyEndpoint();
    userStore.setCompanyContextStatus('syncing');
    try {
        // 与 wl-ui-public 保持一致：companyId 作为 query 传递，body 为空。
        const response: any = await http.request(
            {
                url: buildChangeCompanyUrl(endpoint, companyId),
                method: 'POST',
                data: {},
            },
            // 平台存量接口成功码为 2000，模板演示接口为 200；这里读取原生响应兼容两者。
            { isReturnNativeResponse: true }
        );
        const responseData = response?.data || {};
        const code = Number(responseData.code);
        if (code !== 200 && code !== 2000) {
            throw new Error(responseData.message || `公司切换接口返回异常（${code || 'unknown'}）`);
        }
        userStore.setCompanyContextStatus('ready');
    } catch (cause) {
        const error = new MbaseCompanyContextError(
            'company_context_sync_failed',
            `公司上下文初始化失败：${getErrorMessage(cause)}`,
            { endpoint, companyId, cause }
        );
        setCompanyContextError(error);
        throw error;
    }
}

/**
 * 在权限、菜单和业务请求发出前初始化公司上下文。
 *
 * server：兼容现有平台接口，先调用 /hrms/user/changeCompany。
 * explicit：不修改服务端状态，业务接口必须显式携带 companyId。
 */
export async function initializeMbaseCompanyContext(
    context: MbaseCompanyContext
): Promise<MbaseCompanyContext> {
    const userStore = useUserStoreWidthOut();
    const companyId = String(context.companyId || '').trim();
    const companyName = String(context.companyName || '').trim();
    userStore.setCompanyContext(companyId, companyName);

    if (!isIntegratedMode()) {
        userStore.setCompanyContextStatus('ready');
        return { companyId, companyName };
    }

    if (!companyId) {
        const error = createMissingCompanyError();
        setCompanyContextError(error);
        throw error;
    }

    if (getCompanySyncMode() === 'explicit') {
        userStore.setCompanyContextStatus('ready');
        return { companyId, companyName };
    }

    await syncServerCompanyContext(companyId);
    return { companyId, companyName };
}

/**
 * 给新业务接口显式追加 companyId；standalone 模式保持原参数不变。
 * 后端仍须用 token + companyId 校验当前用户的数据权限。
 */
export function withMbaseCompanyContext<T extends Record<string, unknown>>(
    params: T
): T & { companyId?: string } {
    if (!isIntegratedMode()) return { ...params };

    const companyId = useUserStoreWidthOut().getCompanyId;
    if (!companyId) {
        throw new MbaseCompanyContextError(
            'company_context_missing',
            '缺少公司上下文，已阻止发送可能落入错误公司的业务请求'
        );
    }
    return { ...params, companyId };
}

/** 为持久化业务缓存生成按公司隔离的 key，避免切换后复用旧公司数据。 */
export function getMbaseCompanyScopedKey(key: string): string {
    const normalizedKey = String(key || '').trim();
    if (!isIntegratedMode()) return normalizedKey;
    const companyId = useUserStoreWidthOut().getCompanyId;
    if (!companyId) {
        throw new MbaseCompanyContextError(
            'company_context_missing',
            '缺少公司上下文，无法创建公司级缓存键'
        );
    }
    return `${normalizedKey}:${companyId}`;
}

export function getMbaseCompanyContextStatus() {
    const userStore = useUserStoreWidthOut();
    return {
        mode: getCompanySyncMode(),
        companyId: userStore.getCompanyId,
        companyName: userStore.getCompanyName,
        status: userStore.companyContextStatus,
        error: userStore.companyContextError,
        endpoint: getCompanySyncMode() === 'server' ? getChangeCompanyEndpoint() : undefined,
    };
}
