# mock-gen — Mock 数据生成技能说明

## 工作流位置

```
data.ts (interface) → [mock-gen] → MOCK_XXX 常量 + mock/{module}.ts 端点
```

通常在 `api-contract` 之后、`page-codegen` 之前运行，也可独立触发。

## 触发方式

- 对话中提到：`生成 Mock` / `补充模拟数据` / `生成测试数据`

## 两种 Mock 产物

| 产物 | 位置 | 用途 |
|------|------|------|
| `MOCK_XXX` 常量 | `data.ts` 末尾 | 页面开发时的本地预览数据 |
| vite-plugin-mock 端点 | `mock/{module}.ts` | 拦截真实 HTTP 请求，模拟后端响应 |

## vite-plugin-mock 规则

- 文件位置：`mock/{module}.ts`（扁平化，不嵌套子目录）
- 类型导入：`import type { MockMethod } from 'vite-plugin-mock'`
- 默认导出：`export default [...] as MockMethod[]`
- 工具函数：从 `mock/_util` 导入 `resultSuccess` / `resultPageSuccess` / `resultError`
- 请求参数：`requestParams` 类型（含 `body` / `query` / `headers` / `method`）
- 分页响应：使用 `resultPageSuccess(page, pageSize, dataPool)` 自动处理分页截取
- 状态变更：enable/disable/submit 等操作必须修改 `dataPool` 中对应项的字段
- url 路径：必须与 `src/api/{module}.ts` 中的请求路径完全一致

## 数据质量要求

- 条数：6-10 条（少于 6 条无法覆盖所有枚举，多于 10 条冗余）
- 枚举覆盖：每个状态枚举值至少出现 1 次
- 真实感：姓名用常见中文名，公司名用合理格式，电话用 `138xxxxxxxx` 格式
- 时间字段：使用 `YYYY-MM-DD HH:mm:ss` 格式，时间要有跨度（不全是同一天）

## 已知局限（Gaps）

- 嵌套关联数据（如订单 → 订单明细）需要手动维护关联关系
- 文件/图片字段暂使用占位 URL，不是真实文件
- 分页 Mock 使用 `resultPageSuccess` 支持真实分页，但不支持模糊搜索过滤
- vite-plugin-mock 仅在开发环境生效，生产构建时自动移除

## 维护指引

- 每次 `interface` 新增字段后，**必须同步更新** `MOCK_XXX` 数组和 `dataPool` 中每条数据
- Mock 端点的 `dataPool` 与 `data.ts` 的 `MOCK_XXX` 常量保持相同的数据结构
- 当 interface 字段改名时，Mock 数据的字段名也要同步修改，否则列显示空
- 每个 `src/api/{module}.ts` 的 API 函数都必须有对应 Mock 端点
