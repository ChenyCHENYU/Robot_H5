import { get, post, put, del } from '@/utils/http';
import { withMbaseCompanyContext } from '@/platform/mbase/company-context';
import type { Customer, CustomerInput } from '#/Customer/type';

export const getCustomerList = () => get<Customer[]>('/customer/list', withMbaseCompanyContext({}));
export const getCustomerDetail = (id: number) => get<Customer>('/customer/detail', withMbaseCompanyContext({ id }));
export const addCustomer = (data: CustomerInput) => post<Customer>('/customer', withMbaseCompanyContext({ ...data }));
export const updateCustomer = (id: number, data: Partial<CustomerInput> & { action?: 'convert' | 'public' }) => put<Customer>('/customer', withMbaseCompanyContext({ id, ...data }));
export const deleteCustomer = (id: number) => del<void>('/customer', withMbaseCompanyContext({ id }));
