/**
 * 校磅任务 —— 类型定义 + 常量映射（数据兜底）
 */
import type { TagType } from 'vant';

/** 校磅任务状态默认映射（字典接口失败时兜底） */
export const defaultTaskStatusMap: Record<string, string> = {
    '1': '待执行',
    '2': '执行中',
    '3': '已完成',
    '4': '已超期',
    '5': '停产无需执行',
};

/** 校磅类型默认映射（字典接口失败时兜底） */
export const defaultCalibTypeMap: Record<string, string> = {
    C: '车辆校磅',
    T: '三点校磅',
    S: '线性校磅',
};

/** 任务状态 -> Vant Tag 类型 */
export const taskStatusTagTypeMap: Record<string, TagType> = {
    '1': 'default',
    '2': 'primary',
    '3': 'success',
    '4': 'danger',
    '5': 'warning',
};

/** 校磅任务列表项 */
export interface CalibrationTaskItem {
    id: string;
    calibTaskNo?: string;
    calibTaskName?: string;
    taskStatus?: string;
    calibType?: string;
    calibTaskChargeUserNo?: string;
    calibTaskChargeUserName?: string;
    scaleIds?: string;
    weightsIds?: string;
    taskStartTime?: string;
    taskDeadlineTime?: string;
    taskCompleteTime?: string;
    updateDateTime?: string;
    taskResult?: string;
    resultDesc?: string;
    weighVal?: string;
    befWeighVal?: number | null;
    midWeighVal?: number | null;
    aftWeighVal?: number | null;
}

/** 提交执行结果参数 */
export interface SubmitCalibrationParams {
    taskId: string;
    execUserNo?: string;
    weighVal?: string;
    befWeighVal?: number;
    midWeighVal?: number;
    aftWeighVal?: number;
}
