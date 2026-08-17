import { getUserListWithDept, getUserMap } from '@/api/hrms-user';

/**
 * 从人员行对象提取工号、姓名（兼容多字段命名）
 */
function mergeUserRow(u: Record<string, unknown>, m: Record<string, string>) {
    if (!u || typeof u !== 'object') return;
    const no = u.userNo ?? u.userCode ?? u.workNo ?? u.loginName ?? u.account;
    const name = (u.userName as string) ?? (u.name as string) ?? (u.nickName as string) ?? (u.realName as string);
    if (no == null || no === '' || name == null || name === '') return;
    const key = String(no).trim();
    m[key] = String(name).trim();
}

/**
 * 解析 getUserMap 常见结构，合并进 m
 */
function mergeGetUserMapPayload(raw: unknown, m: Record<string, string>) {
    if (raw == null) return;
    if (Array.isArray(raw)) {
        raw.forEach((u) => mergeUserRow(u as Record<string, unknown>, m));
        return;
    }
    if (typeof raw !== 'object') return;
    const obj = raw as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === 'string' && v !== '') {
            m[String(k).trim()] = v;
        } else if (v && typeof v === 'object' && !Array.isArray(v)) {
            mergeUserRow(v as Record<string, unknown>, m);
        }
    }
}

type PageShape = { records?: unknown[]; list?: unknown[]; rows?: unknown[]; total?: number };

function getPageFromListRes(res: unknown): PageShape | null {
    if (res == null || typeof res !== 'object') return null;
    const r0 = res as PageShape;
    if (Array.isArray(r0.records) || Array.isArray(r0.list) || r0.total != null) {
        return r0;
    }
    const r = res as { data?: unknown };
    let page: unknown = r.data;
    if (page && typeof page === 'object' && (page as { data?: unknown }).data) {
        const inner = (page as { data?: PageShape }).data;
        if (inner && typeof inner === 'object' && (Array.isArray(inner.records) || Array.isArray(inner.list))) {
            page = inner;
        }
    }
    return page && typeof page === 'object' ? (page as PageShape) : null;
}

const MAX_LIST_PAGES = 20;
const PAGE_SIZE = 500;

/**
 * 工号 -> 中文名（与 PC 端 fetchChargeUserNameMap 一致：listWithDept 分页 + getUserMap）
 */
export async function fetchChargeUserNameMap(): Promise<Record<string, string>> {
    const m: Record<string, string> = {};
    for (let current = 1; current <= MAX_LIST_PAGES; current++) {
        try {
            // eslint-disable-next-line no-await-in-loop
            const res: any = await getUserListWithDept({ current, size: PAGE_SIZE });
            const page = getPageFromListRes(res);
            if (!page) break;
            const raw = page.records ?? page.list ?? page.rows;
            const list: unknown[] = Array.isArray(raw) ? raw : [];
            list.forEach((u) => {
                try {
                    mergeUserRow(u as Record<string, unknown>, m);
                } catch {
                    /* 单行坏数据跳过 */
                }
            });
            const total = page.total != null ? Number(page.total) : list.length;
            if (list.length === 0) break;
            if (current * PAGE_SIZE >= total || list.length < PAGE_SIZE) break;
        } catch (e) {
            console.warn('[chargeUserNameMap] listWithDept 第', current, '页失败，已跳过后续分页', e);
            break;
        }
    }
    try {
        const res: any = await getUserMap();
        const payload = res?.data !== undefined ? res.data : res;
        mergeGetUserMapPayload(payload, m);
    } catch (e) {
        console.warn('[chargeUserNameMap] getUserMap 失败，已忽略', e);
    }
    return m;
}

/**
 * 负责人展示：优先「中文名（工号）」；无姓名时用工号在 map 中补全
 */
export function formatUserNoWithName(
    nameMap: Record<string, string>,
    userNo: string | null | undefined,
    extName?: string | null
): string {
    if (userNo == null || userNo === '') return '-';
    const s = String(userNo).trim();
    if (extName) return `${String(extName).trim()}（${s}）`;
    const name = nameMap[s] || nameMap[String(userNo)];
    return name ? `${name}（${s}）` : s;
}
