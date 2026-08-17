import type { PickerOption } from 'vant';

// 客户档案 demo 共享数据与类型定义

/** 客户状态 */
export const STATUS_MAP = {
    converted: { text: '已转化', type: 'success' as const },
    unconverted: { text: '未转化', type: 'danger' as const },
};

/** 客户类型 */
export const CATEGORY_MAP: Record<string, { text: string; type: 'primary' | 'success' | 'warning' }> = {
    hotRolled: { text: '热轧', type: 'primary' },
    wireRod: { text: '盘元', type: 'warning' },
    coldRolled: { text: '冷轧', type: 'success' },
};

/** 客户分类标签 */
export const CUSTOMER_TYPE_MAP: Record<string, string> = {
    temp: '临时客户',
    formal: '正式客户',
    public: '公海客户',
};

/** 客户分类 picker 选项 */
export const CLASS_OPTIONS: PickerOption[] = [
    { text: '重要客户', value: '重要客户' },
    { text: '普通客户', value: '普通客户' },
    { text: '潜在客户', value: '潜在客户' },
];

/** 产品类别 picker 选项（由 CATEGORY_MAP 动态生成） */
export const CATEGORY_OPTIONS: PickerOption[] = Object.entries(CATEGORY_MAP).map(([k, v]) => ({
    text: v.text,
    value: k,
}));

export interface Customer {
    id: number;
    code: string;
    name: string;
    contactName: string;
    contactPhone: string;
    salesPerson: string;
    category: string;
    customerType: string;
    conversionStatus: string;
    creator: string;
    createTime: string;
    lastFollower: string;
    lastFollowTime: string;
    address: string;
    businessLicense: string;
    customerClass: string;
    position: string;
    remark: string;
}

/** 模拟客户数据 */
export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 1,
        code: '10000001',
        name: '烟台华新不锈钢智能化深加工基地',
        contactName: '潘灵连',
        contactPhone: '18174888864',
        salesPerson: '王松',
        category: 'hotRolled',
        customerType: 'formal',
        conversionStatus: 'converted',
        creator: '王松',
        createTime: '2024-12-15 12:30:30',
        lastFollower: '王三',
        lastFollowTime: '2025-12-15 12:30:30',
        address: '山东省烟台市芝罘区工业园A区',
        businessLicense: '',
        customerClass: '重要客户',
        position: '采购经理',
        remark: '',
    },
    {
        id: 2,
        code: 'L10000001',
        name: '宝钢特殊钢材有限公司',
        contactName: '张明辉',
        contactPhone: '13800138001',
        salesPerson: '王松',
        category: 'wireRod',
        customerType: 'temp',
        conversionStatus: 'unconverted',
        creator: '王松',
        createTime: '2024-11-20 09:15:00',
        lastFollower: '李四',
        lastFollowTime: '2025-11-20 09:15:00',
        address: '上海市宝山区钢铁大道88号',
        businessLicense: '',
        customerClass: '普通客户',
        position: '总经理',
        remark: '意向较强',
    },
    {
        id: 3,
        code: 'L10000002',
        name: '中信泰富特钢集团',
        contactName: '陈建国',
        contactPhone: '13912345678',
        salesPerson: '刘洋',
        category: 'coldRolled',
        customerType: 'formal',
        conversionStatus: 'converted',
        creator: '刘洋',
        createTime: '2024-10-05 14:20:00',
        lastFollower: '王三',
        lastFollowTime: '2025-10-05 14:20:00',
        address: '江苏省江阴市华西路168号',
        businessLicense: '',
        customerClass: '重要客户',
        position: '采购部长',
        remark: '',
    },
    {
        id: 4,
        code: '10000004',
        name: '太原钢铁集团有限公司',
        contactName: '赵红梅',
        contactPhone: '15888886666',
        salesPerson: '王松',
        category: 'hotRolled',
        customerType: 'public',
        conversionStatus: 'unconverted',
        creator: '张三',
        createTime: '2024-09-10 08:00:00',
        lastFollower: '张三',
        lastFollowTime: '2025-03-01 16:45:00',
        address: '山西省太原市尖草坪区不锈钢园区',
        businessLicense: '',
        customerClass: '普通客户',
        position: '销售总监',
        remark: '',
    },
    {
        id: 5,
        code: 'L10000005',
        name: '浙江永兴特种不锈钢',
        contactName: '吴芳',
        contactPhone: '13655557777',
        salesPerson: '刘洋',
        category: 'wireRod',
        customerType: 'temp',
        conversionStatus: 'unconverted',
        creator: '刘洋',
        createTime: '2025-01-08 10:30:00',
        lastFollower: '刘洋',
        lastFollowTime: '2025-04-02 11:20:00',
        address: '浙江省湖州市长兴县工业区',
        businessLicense: '',
        customerClass: '普通客户',
        position: '业务主管',
        remark: '需回访',
    },
    {
        id: 6,
        code: '10000006',
        name: '甬金股份科技有限公司',
        contactName: '林志远',
        contactPhone: '13700137000',
        salesPerson: '王松',
        category: 'coldRolled',
        customerType: 'formal',
        conversionStatus: 'converted',
        creator: '王松',
        createTime: '2024-08-22 13:10:00',
        lastFollower: '王三',
        lastFollowTime: '2025-03-28 09:00:00',
        address: '浙江省宁波市北仑区甬金大道1号',
        businessLicense: '',
        customerClass: '重要客户',
        position: '副总经理',
        remark: '',
    },
    {
        id: 7,
        code: 'L10000007',
        name: '广州联众不锈钢有限公司',
        contactName: '黄国强',
        contactPhone: '13511113333',
        salesPerson: '刘洋',
        category: 'hotRolled',
        customerType: 'temp',
        conversionStatus: 'unconverted',
        creator: '刘洋',
        createTime: '2025-02-14 15:40:00',
        lastFollower: '刘洋',
        lastFollowTime: '2025-04-10 10:05:00',
        address: '广东省广州市南沙区龙穴岛',
        businessLicense: '',
        customerClass: '普通客户',
        position: '采购员',
        remark: '',
    },
    {
        id: 8,
        code: '10000008',
        name: '天津友发德众钢管',
        contactName: '周建华',
        contactPhone: '18622228888',
        salesPerson: '王松',
        category: 'wireRod',
        customerType: 'formal',
        conversionStatus: 'converted',
        creator: '王松',
        createTime: '2024-07-03 11:00:00',
        lastFollower: '王三',
        lastFollowTime: '2025-02-18 14:30:00',
        address: '天津市静海区大邱庄镇',
        businessLicense: '',
        customerClass: '重要客户',
        position: '总经理',
        remark: '',
    },
];

/** Tab 配置 */
export const TAB_LIST = [
    { key: 'all', label: '全部客户' },
    { key: 'temp', label: '临时客户' },
    { key: 'formal', label: '正式客户' },
    { key: 'public', label: '公海客户' },
];
