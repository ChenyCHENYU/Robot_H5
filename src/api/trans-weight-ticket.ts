import { get, post } from '@/utils/http';

/** 获取磅单列表（分页 current/size + 查询条件 + flagDeduct 扣杂标记） */
export const getWeighTicketList = (params?: any) => get('/mes/bill/amWeighTicket/list', params);

/** 获取磅单详情 */
export const getWeighTicketDetail = (id: string) => get('/mes/bill/amWeighTicket/getById', { id });

/** 扣杂（老代码 post + params 传参，后端为 @RequestParam 契约，须走 query） */
export const deductImpurity = (data: {
    id: string;
    moistureDeductWgt: number;
    packageDeductWgt: number;
    impurityDeductWgt: number;
}) => post('/mes/bill/amWeighTicket/deductImpurity', data, { joinParamsToUrl: true });
