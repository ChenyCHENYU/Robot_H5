# Skill：规范审计 convention-audit

> **自动执行**：每次生成或修改代码后，在交付前自动运行，无需用户触发。
> 也可手动触发：`审计规范` / `代码检查` / `规范检查`

## 执行时机

本技能是 Skills 工作流的**终结步骤**，在以下场景自动执行：

1. `page-codegen` 生成页面代码后
2. `mock-gen` 生成 Mock 数据后
3. 任何涉及 `.vue` / `.scss` / `data.ts` / `api/*.ts` 的修改后

```
① prototype-scan → ② api-spec → ③ api-contract → ④ page-codegen
    → ⑤ route-register → ⑥ mock-gen → ⑦ convention-audit（自动）→ ✅ 交付
```

## 检查维度

### 🔴 Error（必须修复 — P0）

**样式令牌合规：**

| 检查项 | 规则 |
|--------|------|
| 硬编码颜色 | 不允许 `#xxx` / `rgb()` / `rgba()`，必须用 `var(--ds-xxx)` |
| 硬编码圆角 | 不允许 `border-radius: Npx`，必须用 `var(--ds-radius-*)` |
| 硬编码阴影 | 不允许 `box-shadow` 字面量，必须用 `var(--ds-shadow-*)` |
| 缺少 defineOptions | `<script setup>` 必须有 `defineOptions({ name: 'PageName' })` |
| 内联 style 块 | 禁止 `<style>` 块，样式必须外置 `.scss` 文件 |
| script setup 导出类型 | 禁止在 `<script setup>` 中 `export` 类型，放 `types/{Name}/type.ts` |
| import 未使用 | 不允许未使用的导入 |

**运行时安全（页面不可报错/白屏）：**

| 检查项 | 规则 |
|--------|------|
| 类型检查 | `pnpm type-check`（vue-tsc --noEmit）必须零错误 |
| 导入有效性 | 导入的组件/模块/函数必须存在且路径正确，不可导入不存在的文件 |
| 未定义变量 | 模板 `<template>` 中引用的变量/方法必须在 `<script setup>` 中定义 |
| 必填 Props | 组件必填 props 必须传值，不可遗漏（如 C_NavBar 的 title） |
| 响应式正确 | `ref()` / `reactive()` 使用正确，模板中不出现 `.value` |
| 路由存在 | `router.push` / `<router-link :to>` 的目标路由必须已在 `modules.ts` 或 `menu.ts` 注册 |
| API 端点一致 | `src/api/*.ts` 中请求路径必须与 `mock/*.ts` 端点 url 一致 |

### 🟡 Warning（建议修复 — P1）

**样式规范：**

| 检查项 | 规则 |
|--------|------|
| 缺少 C_NavBar | 页面级组件必须以 `<C_NavBar>` 开头 |
| 安全区缺失 | 底部固定栏必须有 `env(safe-area-inset-bottom)` |
| 图标不合规 | 必须用 `i-ph:xxx-bold` 或 `i-ic:xxx`，禁止 CDN |
| API 命名 | 必须遵循 `get/add/update/delete + Module` 命名 |
| 状态映射缺失 | 状态字段必须有 `xxxMap` 常量 + `<VanTag>` 渲染 |
| Vant 类型约束 | VanTag size 只接受 `'large' \| 'medium'`，Picker columns 必须 `PickerOption[]` |

**原型/详设精细度对比（有原型或详设输入时执行）：**

| 检查项 | 规则 |
|--------|------|
| 字段完整性 | data.ts 的 interface 字段 ≥ 原型/详设字段，不可遗漏 |
| 按钮文案一致 | 操作按钮标签必须与原型一字不差（"修改"不可改"编辑"） |
| 按钮完整性 | 原型有的按钮不可少，原型没有的不可自编 |
| 页面结构一致 | 列表/详情/表单的区块顺序与原型布局一致 |
| 状态枚举覆盖 | 原型中所有状态值都有 Map 映射和 VanTag 渲染 |
| 条件显示 | 不同状态显示不同按钮时，用 `show: (row) => boolean` 控制 |
| 页面流程 | 列表→详情→表单的跳转路径与原型一致 |
| Mock 端点对应 | 每个 API 函数都有对应 Mock 端点，字段名一致 |

### 🟢 Info（建议优化 — P2）

| 检查项 | 规则 |
|--------|------|
| 间距不合规 | 间距值必须是 4 的倍数 |
| 字号不合规 | font-size 必须在 11/12/13/14/15/16/17/20/22/28/34 范围内 |
| data.ts 缺失 | 有重复结构应提取到 data.ts 用 v-for 驱动 |
| Mock 不完整 | Mock 数据应 6-10 条、覆盖所有枚举值 |

## 原型对比检查

生成页面后必须核对：

1. **字段完整性** — data.ts 的 interface 字段 ≥ 原型字段，不可遗漏
2. **按钮文案** — 操作按钮标签必须与原型一字不差（"修改"不可改"编辑"）
3. **状态标签** — 所有状态枚举值都有对应 Map 映射和 VanTag 渲染
4. **按钮条件显示** — 不同状态显示不同按钮时，用 `show: (row) => boolean` 控制
5. **接口对应** — 每个 API 都有 Mock 端点，字段名与前端一致

## 执行步骤

1. 扫描本次变更涉及的 `.vue` / `.scss` / `data.ts` / `api/*.ts` 文件
2. 逐项匹配 P0 + P1 规则
3. **P0（Error）→ 静默修复**，不打断用户
4. **P1（Warning）→ 自动修复 + 在回复末尾简报**
5. **P2（Info）→ 仅报告**，不自动修改
6. 运行 `pnpm type-check` 确认零错误
7. 交付代码

### 令牌速查

修复时参考 `.github/prompts/convention-audit.prompt.md` 中的映射表。
