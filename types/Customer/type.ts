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

export type CustomerInput = Pick<Customer, 'name' | 'customerClass' | 'category' | 'contactName' | 'contactPhone' | 'position' | 'address' | 'remark'>;
