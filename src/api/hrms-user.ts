import { get } from '@/utils/http';

/**
 * 用户列表（含部门），与 PC 端一致，供负责人工号/姓名展示等能力使用
 */
export function getUserListWithDept(query?: Record<string, unknown>) {
    return get('/hrms/user/listWithDept', query);
}

/**
 * 工号/账号到姓名的映射
 */
export function getUserMap(query?: Record<string, unknown>) {
    return get('/hrms/user/getUserMap', query);
}
