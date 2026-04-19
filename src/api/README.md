# API 目录规范

> 按业务域扁平化组织，一个模块一个文件。

## 目录结构

```
src/api/
├── README.md          ← 本文件
├── user.ts            ← 用户/鉴权（登录、登出、用户信息）
└── {module}.ts        ← 后续业务模块按需新增（如 customer.ts / order.ts）
```

**规则**：每个业务模块对应一个文件，文件名使用 kebab-case（如 `customer-follow.ts`）。

## 命名规范

| 操作 | 函数命名 | HTTP 方法 |
|------|---------|-----------|
| 查询列表 | `get{Module}List` | GET / POST |
| 查看详情 | `get{Module}Detail` | GET |
| 新增 | `add{Module}` | POST |
| 修改 | `update{Module}` | PUT |
| 删除 | `delete{Module}` | DELETE |
| 状态切换 | `toggle{Module}{Status}` | PUT |

## 标准示例

```ts
// src/api/customer.ts
import { get, post, put, del, toast } from '@/utils/http';

/** 获取客户列表 */
export const getCustomerList = (params?: object) =>
    get('/customer/list', params);

/** 获取客户详情 */
export const getCustomerDetail = (id: string | number) =>
    get(`/customer/detail/${id}`);

/** 新增客户 */
export const addCustomer = (data: object) =>
    post('/customer/add', data, toast('新增成功'));

/** 修改客户 */
export const updateCustomer = (data: object) =>
    put('/customer/update', data, toast('修改成功'));

/** 删除客户 */
export const deleteCustomer = (id: string | number) =>
    del(`/customer/delete/${id}`, {}, toast('删除成功'));

/** 客户转化 */
export const convertCustomer = (id: string | number) =>
    post(`/customer/${id}/convert`, {}, toast('转化成功'));
```

## HTTP 工具

统一使用 `@/utils/http` 的快捷方法，**禁止直接 import axios**：

```ts
import { get, post, put, del, toast } from '@/utils/http';

// toast() 是第三个参数，用于操作成功提示
post('/api/xxx', data, toast('操作成功'));
```

## 注意事项

- 每个 API 函数必须有对应的 Mock 端点（`mock/{module}.ts`）
- 接口路径使用 kebab-case：`/customer-follow/list`
- 分页参数统一：`{ pageNo, pageSize, ...filters }`
- 响应格式统一：`{ code: number, data: T, message: string }`
