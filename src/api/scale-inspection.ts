import { get, post } from '@/utils/http';

/** 获取字典映射 */
export const getMapByDicSn = (strSn: string) => get('/system/dict/getMapByDicSn', { strSn });

/** 获取巡检任务列表（分页，与 PC 一致：current、size + 实体扁平查询字段） */
export const getInspectionTaskList = (params?: {
    current?: number;
    size?: number;
    taskNo?: string;
    taskName?: string;
    taskStatus?: string;
    inspectTaskChargeUserNo?: string;
}) => get('/mes/scale/amInspectionTask/list', params);

/** 获取巡检任务详情 */
export const getInspectionTaskDetail = (id: string) =>
    get('/mes/scale/amInspectionTask/detail', { id });

/** 提交巡检结果 */
export const submitInspectionTask = (data: {
    taskId: string;
    execUserNo: string;
    itemResults: Array<{
        planItemId?: string;
        inspectItemId: string;
        inspectResult: string;
        inspectAbnormal: string;
        inspectStd: string;
    }>;
}) => post('/mes/scale/amInspectionTask/submit', data);

/** 开始执行任务（后端为 @RequestParam taskId，须走 query） */
export const startInspectionTask = (taskId: string) =>
    post('/mes/scale/amInspectionTask/start', { taskId }, { joinParamsToUrl: true });

/** 停产无需巡检（后端为 @RequestParam taskId，须走 query） */
export const suspendInspectionTask = (taskId: string) =>
    post('/mes/scale/amInspectionTask/suspend', { taskId }, { joinParamsToUrl: true });
