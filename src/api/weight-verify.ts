import { get, post } from '@/utils/http';

/** 获取字典映射 */
export const getMapByDicSn = (strSn: string) => get('/system/dict/getMapByDicSn', { strSn });

/** 获取校磅任务列表（分页，与 PC 一致：current、size + 实体扁平查询字段） */
export const getCalibrationTaskList = (params?: any) =>
    get('/mes/scale/amScaleCalibrationTask/list', params);

/** 按 id 查询单条校磅任务（详情页优先使用，避免仅依赖 list 全量再查找） */
export const getCalibrationTaskById = (id: string) =>
    get('/mes/scale/amScaleCalibrationTask/getById', { id });

/** 开始执行任务（后端为 @RequestParam taskId，须走 query） */
export const startCalibrationTask = (taskId: string) =>
    post('/mes/scale/amScaleCalibrationTask/start', { taskId }, { joinParamsToUrl: true });

/** 停产无需执行（后端为 @RequestParam taskId/userNo，须走 query） */
export const suspendCalibrationTask = (taskId: string, userNo?: string) =>
    post('/mes/scale/amScaleCalibrationTask/suspend', { taskId, userNo }, { joinParamsToUrl: true });

/** 提交执行结果 */
export const submitCalibrationTask = (data: {
    taskId: string;
    execUserNo?: string;
    weighVal?: string;
    befWeighVal?: number;
    midWeighVal?: number;
    aftWeighVal?: number;
}) => post('/mes/scale/amScaleCalibrationTask/submit', data);

/** 根据ID获取砝码信息 */
export const getStandardWeightsById = (id: string) =>
    get('/mes/scale/amStandardWeights/getById', { id });

/** 获取所有砝码信息（不分页） */
export const getStandardWeightsNoPage = (params?: any) =>
    get('/mes/scale/amStandardWeights/listNoPage', params);

/** 获取所有磅秤信息（不分页），用于匹配磅秤名称 */
export const getWeightSiteListNoPage = (params?: any) =>
    get('/mes/base/amWeighbridgeSite/listNoPage', params);
