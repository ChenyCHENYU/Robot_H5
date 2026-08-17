/**
 * 磅秤巡检任务 —— 类型定义 + 常量映射（数据兜底）
 */
import type { TagType } from 'vant';

/** 巡检任务状态默认映射（字典接口失败时兜底） */
export const defaultTaskStatusMap: Record<string, string> = {
    '1': '待执行',
    '2': '执行中',
    '3': '已完成',
    '4': '已超期',
    '5': '停产无需巡检',
};

/** 巡检计划周期默认映射（字典接口失败时兜底） */
export const defaultPlanCycleMap: Record<string, string> = {
    '1': '每天',
    '2': '每周',
    '3': '每月',
    '4': '每季度',
};

/** 任务状态 -> Vant Tag 类型 */
export const taskStatusTagTypeMap: Record<string, TagType> = {
    '1': 'default',
    '2': 'primary',
    '3': 'success',
    '4': 'danger',
    '5': 'warning',
};

/** 巡检任务列表项 */
export interface InspectionTaskItem {
    id: string;
    taskNo?: string;
    taskName?: string;
    taskStatus?: string;
    inspectTaskChargeUserNo?: string;
    deadlineTime?: string;
    startTime?: string;
    taskCompleteTime?: string;
    updateDateTime?: string;
    taskResult?: string;
    planId?: string;
}

/** 巡检项结果 */
export interface InspectionItemResult {
    taskItemId?: string;
    inspectItemId?: string;
    inspectItemName?: string;
    inspectStd?: string;
    inspectResult?: string;
    inspectAbnormal?: string;
}

/** 提交巡检结果参数 */
export interface SubmitInspectionParams {
    taskId: string;
    execUserNo: string;
    itemResults: Array<{
        planItemId?: string;
        inspectItemId: string;
        inspectResult: string;
        inspectAbnormal: string;
        inspectStd: string;
    }>;
}
