import { useUserStoreWidthOut } from '@/store/modules/user';
import { getStore } from '@/utils/store';

function trimUserNo(v: unknown): string {
    if (v == null || v === undefined) return '';
    return String(v).trim();
}

/**
 * 当前登录人工号（多源兜底，避免 user store 未拉取/未落库 userNo 时无法按负责人过滤）
 * 顺序：主用户库 userNo → personId（getCurUser 里与工号同义）→ 本地登录存的用户名
 */
export function getMesCurrentUserNo(): string {
    const store = useUserStoreWidthOut();
    let s = trimUserNo(store.getUserNo);
    if (s) return s;
    s = trimUserNo(store.getPersonId);
    if (s) return s;
    const fromStore = getStore('userNo');
    return trimUserNo(fromStore);
}

/**
 * 与 common-core 一致：工号为 admin 或角色含 admin/admin_role 视为可查看全部数据
 */
export function isMesDataAdmin(): boolean {
    const store = useUserStoreWidthOut();
    const me = getMesCurrentUserNo();
    if (me === 'admin') return true;
    const roles = store.userInfo.roles || [];
    return roles.includes('admin') || roles.includes('admin_role');
}

/**
 * 非管理员时，仅允许查看负责人工号与当前用户一致的数据
 */
export function canViewMesTaskByChargeUserNo(
    chargeUserNo: string | null | undefined
): boolean {
    if (isMesDataAdmin()) return true;
    const me = getMesCurrentUserNo();
    if (!me) return false;
    return String(chargeUserNo ?? '').trim() === me;
}
