# prototype-scan — 原型扫描技能说明

## 工作流位置

```
原型/设计稿 → [prototype-scan] → page-spec.json → [page-codegen] → 代码
```

这是页面生成流水线的**第一步**，负责将非结构化的设计信息转换为标准 JSON 规格。

## 触发方式

- 对话中提到：`扫描原型` / `分析原型` / `解析设计稿`
- 提供 Axure HTML 文件路径、截图描述或 Markdown 文档

## 输出结构说明

| 字段 | 说明 |
|------|------|
| `pageName` | kebab-case 页面路径名（对应路由 path 后缀） |
| `pageType` | LIST / FORM / DETAIL / TABS / DASHBOARD |
| `search` | 搜索栏字段列表 |
| `tabs` | 顶部 Tab 配置（水平滑动，不是侧边栏） |
| `card.primary` | 卡片主标题字段（加粗大字） |
| `card.secondary` | 副标题字段（灰色小字） |
| `card.tags` | 状态标签字段（需生成对应 Map 映射） |
| `card.meta` | 底部 label:value 网格字段 |
| `operations` | 行内操作按钮（含条件显示表达式） |
| `footer` | 固定底部区域（如"新增"按钮） |

## 已知局限（Gaps）

- 无法自动读取 Axure HTML 的 CSS 位置信息来判断视觉层次，需要人工辅助描述
- 嵌套弹窗、级联选择器等复杂交互需要补充说明
- 多层 Tab（Tab 内再嵌套 Tab）目前不支持自动解析
- 图表类页面（ECharts）不在此技能范围内

## 维护指引

- 当新增页面类型时，在 `pageType` 枚举中添加新值，并在 `page-codegen` 技能中补充对应模板
- `operations` 的 `show` 条件表达式格式参考 `convention-audit` 技能中的按钮规范
- 如果产品设计文档格式发生变化，更新本文件的"输入"部分说明
