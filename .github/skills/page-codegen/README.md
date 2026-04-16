# page-codegen — 页面代码生成技能说明

## 工作流位置

```
page-spec.json + api.ts → [page-codegen] → index.vue + index.scss + data.ts
                                                  ↓
                                         [route-register] 注册路由
```

## 触发方式

- 对话中提到：`生成页面` / `生成代码` / `帮我写页面`

## 三文件分离规范

每个页面目录必须包含：

| 文件 | 职责 | 禁止事项 |
|------|------|---------|
| `index.vue` | 模板 + 逻辑 | 禁止 `<style>` 块 |
| `index.scss` | 样式（BEM + 设计令牌） | 禁止硬编码颜色/圆角 |
| `data.ts` | 类型 + 常量 + Mock 数据 | 禁止业务逻辑 |

## SFC 块顺序（重要）

必须严格按照：`<template>` → `<script setup>` → （无 `<style>`）

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
  // 逻辑
</script>
<!-- 禁止 <style> 块，样式写在 index.scss -->
```

## 模板选择指南

| 场景 | 模板 | 参考文件 |
|------|------|---------|
| 搜索+列表 | TPL-LIST | `src/views/demo/customer/index.vue` |
| 详情展示 | TPL-DETAIL | `src/views/demo/customer/detail.vue` |
| 表单填写 | TPL-FORM | `src/views/demo/c-form/index.vue` |

## 已知局限（Gaps）

- 图表页面（ECharts）暂无标准模板，需参考 `src/views/chart/`
- 多级嵌套列表（树形结构）不在当前模板范围
- 离线缓存/PWA 相关逻辑需手动添加
- 权限控制（按钮级别 v-permission）尚未集成到模板中

## 维护指引

- 新增页面模板时，在 `skills.md` 的"页面模板"章节添加 `TPL-XXX` 条目，并指向参考文件
- 当设计系统令牌（`--ds-*`）新增时，更新 `skills.md` 中的"样式规范"部分
- 生成后检查清单（Checklist）与 `convention-audit` 技能保持同步
