# Skill：原型扫描 prototype-scan

> 触发词：`扫描原型` / `分析原型` / `解析设计稿`

## 输入

Axure HTML 文件路径、设计文档（Markdown）或截图描述

## 输出

结构化 `page-spec.json`，描述页面骨架：

```json
{
  "pageName": "customer-archive",
  "pageTitle": "客户档案",
  "pageType": "LIST",
  "search": { "fields": ["keyword"] },
  "tabs": [
    { "key": "all", "label": "全部客户" },
    { "key": "temp", "label": "临时客户" }
  ],
  "card": {
    "primary": "name",
    "secondary": "code",
    "tags": ["category", "conversionStatus"],
    "meta": [
      { "label": "联系人", "key": "contactName" },
      { "label": "业务员", "key": "salesPerson" }
    ]
  },
  "operations": [
    { "label": "转化", "action": "convert", "show": "row.conversionStatus === 'unconverted'" },
    { "label": "作废", "action": "void", "type": "danger" }
  ],
  "footer": { "type": "add", "label": "+ 新增客户档案" }
}
```

## 移动端适配要点

- PC 表格行 → 移动端卡片，提取 `primary / secondary / tags / meta` 层级
- 底部固定操作栏是移动端特有的
- Tab 过滤是水平滑动标签，不是左侧筛选面板
- 操作按钮区在卡片底部，用条件 `show` 控制显示

## 执行步骤

1. 读取原型文件或文档
2. 识别页面类型：LIST / FORM / DETAIL / TABS / DASHBOARD
3. 提取字段列表、状态枚举、操作按钮
4. 对比规范：字段命名 camelCase，状态必须有 Map 映射
5. 输出 page-spec.json
