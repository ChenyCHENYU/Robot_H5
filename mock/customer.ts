import type { MockMethod } from 'vite-plugin-mock';
import { demoRepository } from './_demo';
import { customerSeed } from './_fixtures/customer';
import { resultError, resultSuccess, type requestParams } from './_util';
import { getDemoUser } from './user/user';
import type { Customer, CustomerInput } from '#/Customer/type';

function repository(request: requestParams) {
    const user = getDemoUser(request);
    if (!user) throw new Error('请先登录');
    return demoRepository<Customer[]>(`customers:${user.userId}:${request.query?.companyId || request.body?.companyId || 'standalone'}`, customerSeed);
}
function response(request: requestParams, operation: (items: Customer[]) => unknown) {
    try {
        const db = repository(request); const items = db.read();
        const result = operation(items); db.write(items); return resultSuccess(result);
    } catch (error) { return resultError(error instanceof Error ? error.message : '客户操作失败'); }
}
function find(items: Customer[], id: unknown) {
    const item = items.find(customer => customer.id === Number(id));
    if (!item) throw new Error('客户不存在或已被删除');
    return item;
}
function validate(data: CustomerInput) {
    if (!data.name?.trim() || !data.customerClass || !data.contactName?.trim() || !/^1\d{10}$/.test(data.contactPhone)) throw new Error('请完整填写客户名称、分类、联系人和手机号');
}
export default [
    { url: '/api/customer/list', method: 'get', response: (request: requestParams) => response(request, items => items) },
    { url: '/api/customer/detail', method: 'get', response: (request: requestParams) => response(request, items => find(items, request.query.id)) },
    { url: '/api/customer', method: 'post', response: (request: requestParams) => response(request, items => {
        validate(request.body);
        const user = getDemoUser(request)!;
        const now = new Date().toLocaleString('zh-CN', { hour12: false });
        const item: Customer = { ...customerSeed[0], ...request.body, id: Date.now(), code: `L${Date.now()}`, customerType: 'temp', conversionStatus: 'unconverted', creator: user.nickname, salesPerson: user.nickname, createTime: now, lastFollower: user.nickname, lastFollowTime: now };
        items.unshift(item); return item;
    }) },
    { url: '/api/customer', method: 'put', response: (request: requestParams) => response(request, items => {
        const item = find(items, request.body.id);
        if (request.body.action === 'convert') { item.conversionStatus = 'converted'; item.customerType = 'formal'; }
        else if (request.body.action === 'public') item.customerType = 'public';
        else { validate({ ...item, ...request.body }); for (const key of ['name', 'customerClass', 'category', 'contactName', 'contactPhone', 'position', 'address', 'remark'] as const) if (request.body[key] !== undefined) item[key] = request.body[key]; }
        return item;
    }) },
    { url: '/api/customer', method: 'delete', response: (request: requestParams) => response(request, items => {
        const item = find(items, request.query.id); items.splice(items.indexOf(item), 1); return null;
    }) },
] as MockMethod[];
