/** 磅单（weigh ticket）模块 — 类型定义与常量映射 */
import type { TagType } from 'vant';

/** 磅单列表项 */
export interface TicketItem {
    id?: string | number;
    weighbillNo?: string;
    weighbillStatus?: string;
    matName?: string;
    carNo?: string;
    netWgt?: number | string | null;
    busDate?: string;
}

/** 磅单详情（字段与后端 AmWeighTicket 一致） */
export interface TicketDetail {
    id?: string | number;
    weighbillNo?: string;
    weighbillStatus?: string;
    grossDateTime?: string;
    tareDateTime?: string;
    netDateTime?: string;
    busDate?: string;
    carNo?: string;
    driverName?: string;
    sendOrg?: string;
    receiveOrg?: string;
    sendWh?: string;
    receiveWh?: string;
    grossWgt?: number | string | null;
    tareWgt?: number | string | null;
    netWgt?: number | string | null;
    moistureDeductWgt?: number | string | null;
    packageDeductWgt?: number | string | null;
    impurityDeductWgt?: number | string | null;
    matCode?: string;
    matName?: string;
    matSpec?: string;
    matSpecification?: string;
    grossWeighSiteName?: string;
    grossWeighSiteNo?: string;
    tareWeighSiteName?: string;
    tareWeighSiteNo?: string;
    netWeighSiteName?: string;
    netWeighSiteNo?: string;
    remark?: string;
}

/** 扣杂提交参数 */
export interface DeductImpurityPayload {
    id: string;
    moistureDeductWgt: number;
    packageDeductWgt: number;
    impurityDeductWgt: number;
}

/** 磅单状态 → 文案（静态字典，与老代码一致） */
export const weighbillStatusMap: Record<string, string> = {
    PENDING: '待过磅',
    ONCE_COMPLETE: '一次过磅',
    TWICE_COMPLETE: '二次过磅',
    COMPLETE: '过磅完成',
    EXCEPTION: '过磅异常',
    SUSPEND: '暂停过磅',
};

/** 磅单状态 → VanTag type */
export const weighbillStatusTagTypeMap: Record<string, TagType> = {
    PENDING: 'default',
    ONCE_COMPLETE: 'primary',
    TWICE_COMPLETE: 'primary',
    COMPLETE: 'success',
    EXCEPTION: 'danger',
    SUSPEND: 'warning',
};
