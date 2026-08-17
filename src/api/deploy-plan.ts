import { get, post } from '@/utils/http';

/** 获取字典映射 */
export const getMapByDicSn = (strSn: string) => get('/system/dict/getMapByDicSn', { strSn });

/** 获取调拨计划列表 */
export const getDeployPlanList = (params?: any) => get('/mes/plan/amDeployPlan/list', params);

/** 新增调拨计划 */
export const saveDeployPlan = (data: any) => post('/mes/plan/amDeployPlan/save', data);

/** 设置优先过磅（后端为 @RequestParam id，须走 query） */
export const setPriority = (id: string) =>
    post('/mes/plan/amDeployPlan/updatePriority', { id }, { joinParamsToUrl: true });

/** 生成过磅二维条码（PDF417，接口路径仍为 generateWeighQr） */
export const generateWeighQr = (deployPlanNo: string, carNo: string) =>
    get('/mes/plan/amDeployPlan/generateWeighQr', { deployPlanNo, carNo });
