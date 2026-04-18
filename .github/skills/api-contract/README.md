# api-contract — 接口约定技能说明

## 工作流位置

```
page-spec.json → [api-contract] → src/api/{module}.ts + Mock 端点
                                         ↓
                               [page-codegen] 引用 API 方法
```

## 触发方式

- 对话中提到：`生成接口` / `接口约定` / `生成 api.md`

## 生成文件位置

| 文件 | 说明 |
|------|------|
| `src/api/{module}.ts` | 前端 API 方法（使用 `@/utils/http` 快捷方法） |
| `mock/{module}/{module}.ts` | MSW Mock 端点（与 API 一一对应） |

## HTTP 工具说明

项目封装了 `@/utils/http` 快捷方法，禁止直接使用 axios：

```ts
import { get, post, put, del, toast } from '@/utils/http';
// toast(msg) 是 put/post/del 的第三个参数，不是单独调用
```

## 已知局限（Gaps）

- 批量操作接口（如批量删除、批量审批）需要手动补充
- 文件上传/下载接口与标准 CRUD 格式不同，需另行处理
- 分页参数目前统一为 `{ pageNo, pageSize, ...filters }`，若后端格式不同需手动调整
- Mock 端点仅覆盖基础 CRUD，复杂查询逻辑（如嵌套过滤）需手动补充

## 维护指引

- 当 `@/utils/http` 封装方式变化时，更新 `skills.md` 中的"HTTP 工具"部分
- 如果项目统一响应格式 `{ code, data, msg }` 发生变化，同步更新模板
- 新增业务模块后，在 `src/api/` 下建立独立文件，不要合并到通用文件
