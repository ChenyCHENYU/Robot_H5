# Skill：Mock 数据生成 mock-gen

> 触发词：`生成 Mock` / `补充模拟数据` / `生成测试数据`

## 输入

data.ts 中的类型定义（interface）

## 输出

在 `data.ts` 中生成 `MOCK_XXX` 常量数组

## 规范

- 数据量：6-10 条
- 字段覆盖：所有 interface 字段必须有值，不可留空
- 枚举覆盖：状态字段必须覆盖所有枚举值
- 时间格式：`YYYY-MM-DD HH:mm:ss`
- 编号格式：与业务一致（如 `CUS-10000001`、`EQ-2024-001`）
- 真实感：使用合理的中文姓名、公司名、地址等

## 生成模板

```ts
export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 1,
        code: 'CUS-10000001',
        name: '杭州钢铁有限公司',
        category: 'hot_rolled',           // 覆盖枚举值 1
        conversionStatus: 'converted',     // 覆盖枚举值 1
        contactName: '张三',
        contactPhone: '13800138001',
        salesPerson: '李四',
        creator: '王五',
        createTime: '2024-01-15 09:30:00',
        lastFollower: '李四',
        lastFollowTime: '2024-03-20 14:00:00',
        // ...所有字段
    },
    // ...6-10 条，轮流覆盖不同枚举值
];
```

## 同步要求

- 新增字段时必须同步更新 Mock 数据
- Mock 字段名必须与 interface 定义一致
- 状态映射常量（xxxMap）的 key 必须在 Mock 数据中出现
