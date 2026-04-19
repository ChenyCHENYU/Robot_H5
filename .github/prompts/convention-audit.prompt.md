# convention-audit — 设计系统规范审计

> 对指定文件（或整个 `src/views/` 目录）执行规范审计，**逐项扫描 → 输出报告 → 自动修复**。

## 使用方式

在 Copilot Chat 中输入：
- `审计规范 src/views/xxx/` — 审计指定模块
- `审计规范` — 审计整个 views 目录

---

## 审计规则

按优先级从高到低执行，发现违规时直接修复。

### 🔴 P0 — 必须修复

#### R01 硬编码颜色
- **扫描**：`.scss` 文件中出现 `#` 十六进制色值、`rgb(`、`rgba(`、`hsl(`
- **排除**：`variables.scss` 自身（定义处）、注释行
- **修复**：替换为最接近的 `var(--ds-*)` 令牌

| 硬编码值 | 替换为 |
|----------|--------|
| `#fff` / `#ffffff` | `var(--ds-bg)` 或 `var(--ds-surface)` |
| `#000` / `#000000` | `var(--ds-text-primary)` |
| `#1d1d1f` | `var(--ds-text-primary)` |
| `#6e6e73` | `var(--ds-text-secondary)` |
| `#aeaeb2` | `var(--ds-text-tertiary)` |
| `#f5f5f7` | `var(--ds-bg-secondary)` |
| `#e8e8ed` | `var(--ds-bg-tertiary)` |
| `#0071e3` 系列蓝色 | `var(--ds-accent)` |
| 绿色系 | `var(--ds-success)` |
| 橙色系 | `var(--ds-warning)` |
| 红色系 | `var(--ds-danger)` |
| 其他 `rgba(0,0,0,0.0x)` | `var(--ds-border)` 或 `var(--ds-divider)` |

#### R02 硬编码圆角
- **扫描**：`border-radius` 值为字面量 `Npx`
- **排除**：`50%`、`9999px`（pill 形状允许直接写）
- **修复**：

| 硬编码值 | 替换为 |
|----------|--------|
| `8px` | `var(--ds-radius-sm)` |
| `12px` | `var(--ds-radius-md)` |
| `16px` | `var(--ds-radius-lg)` |
| `20px` | `var(--ds-radius-xl)` |
| `9999px` | `var(--ds-radius-full)` |

#### R03 硬编码阴影
- **扫描**：`box-shadow` 值为字面量（非 `var(--ds-*)`）
- **修复**：替换为 `var(--ds-shadow-1)` / `var(--ds-shadow-2)` / `var(--ds-shadow-3)`

#### R04 禁止 `<style>` 块
- **扫描**：`.vue` 文件中出现 `<style` 标签
- **排除**：`src/App.vue`（全局入口允许）、`src/components/C_Icon/`（已知例外）
- **修复**：将样式提取到同目录 `index.scss`，在 `<script setup>` 中 `import './index.scss'`

#### R05 缺少 defineOptions
- **扫描**：`<script setup>` 中无 `defineOptions({ name:`
- **修复**：在 `<script setup>` 首行添加 `defineOptions({ name: 'XxxPage' })`，name 与路由 name 一致

#### R06 禁止 script setup 导出类型
- **扫描**：`<script setup>` 中出现 `export type` 或 `export interface`
- **修复**：移动到 `types/{Name}/type.ts`，用 `#/{Name}/type` 别名导入

#### R07 类型检查
- **扫描**：运行 `pnpm type-check`（vue-tsc --noEmit）
- **修复**：修复所有 TypeScript 类型错误，确保零错误

#### R08 导入有效性
- **扫描**：`import` 的组件/模块/函数的文件路径必须存在
- **修复**：修正路径或补充缺失文件

#### R09 未定义变量
- **扫描**：`<template>` 中引用的变量/方法必须在 `<script setup>` 中定义或导入
- **修复**：补充定义或删除无效引用

#### R10 必填 Props
- **扫描**：组件必填 props 未传值（如 `C_NavBar` 的 `title`、`C_Table` 的 `columns`）
- **修复**：补充缺失的 prop

#### R11 响应式正确
- **扫描**：模板中出现 `xxx.value`（应由 Vue 自动解包）、`reactive()` 被解构丢失响应式
- **修复**：模板中去掉 `.value`，解构改用 `toRefs()`

#### R12 路由存在
- **扫描**：`router.push({ name: 'xxx' })` 中的 name 必须在 `src/router/modules.ts` 或 `menu.ts` 中注册
- **修复**：补充路由注册或修正 name

### 🟡 P1 — 建议修复

**样式规范：**

#### R13 缺少 C_NavBar
- **扫描**：`src/views/` 下的 `index.vue`，`<template>` 首个子元素不是 `<C_NavBar`
- **修复**：在 `<template>` 顶部添加 `<C_NavBar title="页面标题" />`

#### R14 底部安全区缺失
- **扫描**：有 `position: fixed` + `bottom: 0` 但无 `env(safe-area-inset-bottom)`
- **修复**：添加 `padding-bottom: calc(Xpx + env(safe-area-inset-bottom))`

#### R15 图标不合规
- **扫描**：class 中有 `el-icon-`、`van-icon-`、CDN 图标链接
- **修复**：替换为 `i-ph:{name}-bold` 或 `i-ic:{name}` 格式

#### R16 API 命名不规范
- **扫描**：`src/api/*.ts` 中函数名不符合 `get/add/update/delete + Module + List/Detail` 模式
- **修复**：重命名函数并更新所有引用

#### R17 状态映射缺失
- **扫描**：`data.ts` 中有状态类型字段（名含 `status`/`state`/`type`）但无对应 `xxxMap` 常量
- **修复**：生成 `Record<string, { text: string; type: string }>` 映射常量

#### R18 Vant 类型约束
- **扫描**：`VanTag` 的 `size` 属性值不在 `'large' | 'medium'` 范围内
- **扫描**：`Picker` 的 `columns` 类型不是 `PickerOption[]`
- **修复**：修正属性值/类型

**原型/详设精细度对比（有原型或详设文档输入时必须执行）：**

#### R19 字段完整性
- **扫描**：`data.ts` 的 interface 字段数量和名称 ≥ 原型/详设文档中的字段
- **修复**：补充遗漏字段，字段名与后端约定一致

#### R20 按钮文案一致
- **扫描**：操作按钮的文本必须与原型/详设完全一致（"修改"不可改"编辑"，"作废"不可改"删除"）
- **修复**：改为原型文案

#### R21 按钮完整性
- **扫描**：原型中有的按钮不可遗漏，原型中没有的不可自编
- **修复**：增删按钮使其与原型一一对应

#### R22 页面结构一致
- **扫描**：列表/详情/表单的区块顺序（搜索→Tab→列表→底部操作）与原型布局一致
- **修复**：调整区块顺序

#### R23 状态枚举覆盖
- **扫描**：原型中出现的所有状态值都有 `xxxMap` 映射和 `VanTag` 渲染
- **修复**：补充遗漏的状态枚举

#### R24 条件显示
- **扫描**：不同状态下应显示不同按钮时，必须有 `show: (row) => boolean` 条件控制
- **修复**：添加条件逻辑

#### R25 页面流程
- **扫描**：列表→详情→表单的跳转路径与原型流程一致
- **修复**：修正路由跳转的 name 和 params

#### R26 Mock 端点对应
- **扫描**：`src/api/*.ts` 每个 API 函数都有 `mock/*.ts` 中的对应端点，字段名一致
- **修复**：补充缺失的 Mock 端点

### 🟢 P2 — 优化建议

#### R27 间距不合规
- **扫描**：`margin`/`padding`/`gap` 的 `px` 值不在 `4 8 12 16 20 24 32 40 48 64` 中
- **修复**：调整为最近的合规值

#### R28 字号不合规
- **扫描**：`font-size` 的 `px` 值不在 `11 12 13 14 15 16 17 20 22 28 34` 中
- **修复**：调整为最近的合规值

#### R29 data.ts 缺失
- **扫描**：`.vue` 中有 3 个以上硬编码对象/数组（应提取到 data.ts）
- **修复**：提取常量到 `data.ts`，用 `v-for` 驱动渲染

#### R30 Mock 不完整
- **扫描**：`data.ts` 有 interface 但无 `MOCK_` 常量，或 Mock 条数 < 6
- **修复**：按 mock-gen skill 规则补充

---

## 输出格式

扫描完成后输出结构化报告：

```
## 审计报告：{模块名}

扫描文件：X 个 | 违规：X 项（P0: X / P1: X / P2: X）

### 🔴 P0 必须修复
| # | 规则 | 文件 | 行号 | 违规内容 | 修复方案 |
|---|------|------|------|---------|---------|
| 1 | R01 | index.scss | L12 | `color: #333` | → `var(--ds-text-primary)` |

### 🟡 P1 建议修复
（同上格式）

### 🟢 P2 优化建议
（同上格式）

### ✅ 已通过
（列出通过的规则）
```

报告输出后，**询问用户是否自动修复**，确认后逐项执行修复。

---

## 可用设计令牌速查

### 颜色
`--ds-bg` `--ds-bg-secondary` `--ds-bg-tertiary` `--ds-surface`
`--ds-text-primary` `--ds-text-secondary` `--ds-text-tertiary`
`--ds-accent` `--ds-accent-hover` `--ds-accent-light`
`--ds-success` `--ds-warning` `--ds-danger`
`--ds-border` `--ds-divider`

### 圆角
`--ds-radius-sm(8)` `--ds-radius-md(12)` `--ds-radius-lg(16)` `--ds-radius-xl(20)` `--ds-radius-full(9999)`

### 阴影
`--ds-shadow-1` `--ds-shadow-2` `--ds-shadow-3`

### 毛玻璃
`--ds-glass-bg` `--ds-glass-border` `--ds-glass-blur` `--ds-glass-saturate` `--ds-glass-shine` `--ds-glass-shadow` `--ds-glass-gradient`

### 间距（4px 网格）
`4` `8` `12` `16` `20` `24` `32` `40` `48` `64`

### 字号
`11` `12` `13` `14` `15` `16` `17` `20` `22` `28` `34`
