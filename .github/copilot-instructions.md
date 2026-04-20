# Robot H5 — Copilot 项目指令

> 本文件由 GitHub Copilot 自动加载，作为所有 AI 辅助开发的上下文基线。
> 同源规则同步至 `CLAUDE.md`（Claude Code）/ `AGENTS.md`（通用标准），变更时须同步更新。

## 项目概述

Vue 3.5 + Vite 7 + TypeScript 移动端 H5 应用，设计语言为 Apple HIG Liquid Glass。
UI 库 Vant 4（自动导入），原子 CSS 为 UnoCSS，状态管理 Pinia。

## 核心规范

### 1. 三文件分离

每个页面/模块为独立目录，包含：

| 文件 | 职责 |
|------|------|
| `index.vue` | 模板 + 逻辑，`<template>` 在上，`<script setup lang="ts">` 在下，**禁止 `<style>` 块** |
| `index.scss` | 样式，BEM 命名，使用 `--ds-*` 设计令牌，通过 `import './index.scss'` 引入 |
| `data.ts` | 类型定义 + 常量映射 + 静态数据 + Mock 数据 |

子页面（detail.vue / form.vue）同理配套 `.scss`。

### 2. 组件命名 C_ 前缀

- 全局组件放 `src/components/C_{Name}/`，自动注册
- 组件类型定义放 `types/{Name}/type.ts`，使用 `#/{Name}/type` 别名导入
- **禁止在 `<script setup>` 中 `export` 类型**

### 3. 类型检查（零容忍）

- 每次修改后运行 `pnpm type-check`（vue-tsc --noEmit），必须**零错误**
- Vant 组件属性须符合类型约束（如 VanTag size 只接受 `'large' | 'medium'`）
- Picker 的 columns 必须是 `PickerOption[]`，不可用 `string[]`

### 4. 样式规范

- **禁止硬编码**颜色/圆角/阴影 → 必须用 `var(--ds-xxx)` 令牌
- BEM 命名：`.{page-name}__{element}--{modifier}`
- 间距 4px 网格：4 / 8 / 12 / 16 / 20 / 24 / 32
- 字号梯度：11 / 12 / 13 / 14 / 15 / 16 / 17 / 20 / 22 / 28 / 34
- 底部安全区：`padding-bottom: calc(Xpx + env(safe-area-inset-bottom))`
- 毛玻璃：`background: var(--ds-glass-bg); backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate))`

### 5. 图标规范

- UnoCSS 类名：`i-ph:{name}-bold`（Phosphor）或 `i-ic:{name}`（IC）
- data.ts 中动态引用的图标类名**必须加入 `uno.config.ts` 的 `safelist`**
- 禁止 CDN 图标

### 6. data.ts 职责

```ts
// 类型
export interface Customer { ... }

// 常量映射（状态标签色）
export const STATUS_MAP: Record<string, { text: string; type: string }> = { ... };

// 静态数据（驱动 v-for）
export const FORM_SECTIONS: FormSection[] = [ ... ];

// Mock 数据
export const MOCK_CUSTOMERS: Customer[] = [ ... ];
```

- 状态字段必须有 `xxxMap` 常量 + `<VanTag>` 渲染
- Mock 数据 6-10 条，覆盖所有枚举值

### 7. 路由规范

- 路由 `name` 必须与 `defineOptions({ name })` **完全一致**
- 子页面注册在 `src/router/modules.ts`
- TabBar 主页注册在 `src/router/menu.ts`
- keepAlive 规则：列表页建议 `true`，详情/表单页 `false`

### 8. 接口规范

- 一个业务模块一个文件：`src/api/{module}.ts`（扁平化，详见 `src/api/README.md`）
- 使用快捷方法：`import { get, post, put, del, toast } from '@/utils/http'`
- 命名规则：`get{Module}List` / `get{Module}Detail` / `add{Module}` / `update{Module}` / `delete{Module}`
- 每个 API 必须有对应 Mock

### 9. 自动发版

推送到 `main` 分支后 CI 自动根据 commit type 升版本号：
- `fix` → patch, `feat` → minor, `BREAKING CHANGE` → major
- CI 发版前自动执行 `pnpm type-check` 质量门禁
- 基于 release-please，CI 配置见 `.github/workflows/release.yml`
- commitlint 允许的所有 type（`wip` / `deps` / `test` 等）须在 release-please 的 `changelog-sections` 中同步声明（可 `hidden: true`）

### 10. 代码交付前自动审计（convention-audit）

**每次生成或修改 `.vue` / `.scss` / `data.ts` / `api/*.ts` 后，必须在交付给用户前自动执行以下审计并直接修复，无需用户触发。**

#### 🔴 P0 — 自动修复（静默执行，不问用户）

**样式令牌合规：**

| 规则 | 扫描 | 修复 |
|------|------|------|
| 硬编码颜色 | `.scss` 中 `#xxx` / `rgb()` / `rgba()` | → `var(--ds-*)` |
| 硬编码圆角 | `border-radius: Npx` | → `var(--ds-radius-*)` |
| 硬编码阴影 | `box-shadow` 字面量 | → `var(--ds-shadow-*)` |
| 禁止 `<style>` | `.vue` 中有 `<style` 标签 | → 提取到 `.scss` |
| 缺少 defineOptions | `<script setup>` 无 `defineOptions` | → 添加，name 与路由一致 |
| 类型导出 | `<script setup>` 中 `export type/interface` | → 移到 `types/` |

**运行时安全（页面不可报错/白屏）：**

| 规则 | 扫描 | 修复 |
|------|------|------|
| 类型检查 | `pnpm type-check`（vue-tsc --noEmit）必须零错误 | → 修复类型错误 |
| 导入有效性 | 导入的组件/模块/函数必须存在且路径正确 | → 修正路径或补充缺失文件 |
| 未定义变量 | 模板中引用的变量/方法必须在 `<script setup>` 中定义 | → 补充定义或删除引用 |
| 必填 Props | 组件必填 props 必须传值，不可遗漏 | → 补充 prop |
| 响应式正确 | `ref()` / `reactive()` 使用正确，模板中不出现 `.value` | → 修正响应式写法 |
| 路由存在 | `router.push` 的目标路由必须已在 `modules.ts` 或 `menu.ts` 注册 | → 补充路由注册 |

#### 🟡 P1 — 自动修复 + 报告

**样式规范：**

| 规则 | 扫描 | 修复 |
|------|------|------|
| 缺少 C_NavBar | 页面 `<template>` 首元素非 `<C_NavBar` | → 添加 |
| 安全区缺失 | `position: fixed; bottom: 0` 无安全区 | → 加 `env(safe-area-inset-bottom)` |
| 间距不合规 | `margin/padding/gap` 非 4px 网格 | → 调整为最近合规值 |
| 字号不合规 | `font-size` 不在梯度范围 | → 调整为最近合规值 |
| 状态映射缺失 | 状态字段无 `xxxMap` 常量 | → 生成映射 + VanTag 渲染 |
| API 命名 | 不符合 `get/add/update/delete + Module` | → 重命名 |

**原型/详设精细度对比（有原型或详设文档输入时必须执行）：**

| 规则 | 扫描 | 修复 |
|------|------|------|
| 字段完整性 | data.ts 的 interface 字段 ≥ 原型/详设字段，不可遗漏 | → 补充缺失字段 |
| 按钮文案一致 | 操作按钮标签必须与原型一字不差（"修改"不可改"编辑"） | → 改为原型文案 |
| 按钮完整性 | 原型有的按钮不可少，原型没有的不可自编 | → 增删按钮 |
| 页面结构一致 | 列表/详情/表单的区块顺序与原型布局一致 | → 调整区块顺序 |
| 状态枚举覆盖 | 原型中所有状态值都有 Map 映射和 VanTag 渲染 | → 补充遗漏状态 |
| 条件显示 | 不同状态显示不同按钮时，用 `show: (row) => boolean` 控制 | → 添加条件逻辑 |
| 页面流程 | 列表→详情→表单的跳转路径与原型一致 | → 修正路由跳转 |
| Mock 端点对应 | 每个 API 函数都有对应 Mock 端点，字段名一致 | → 补充 Mock |

#### 执行时机

```
生成/修改代码 → 自动审计（P0 静默修复 + P1 修复并报告） → pnpm type-check → 交付
```

- **不要等用户说"审计规范"**，每次代码变更后自动执行
- P0 项直接改，不打断用户；P1 项改完后在回复末尾简要列出修复内容
- 最后运行 `pnpm type-check` 确保零错误
- 审计规则详见 `.github/skills/convention-audit/skills.md`
- 令牌速查见 `.github/prompts/convention-audit.prompt.md`

### 11. Skills 自动调度注册表

以下注册表确保所有 AI 编辑器（含 Cursor、Windsurf、Kiro、Trae、Claude Code、Cline）能自动识别并调度 Skill。
当用户提到触发关键词时，AI 必须先 `read_file` 读取对应 `skills.md` 再执行。

| 触发词 | Skill | 文件路径 |
|--------|-------|--------|
| `扫描原型` / `分析原型` / `解析设计稿` | prototype-scan | `.github/skills/prototype-scan/skills.md` |
| `生成接口规格` / `接口字段说明` / `生成 api-spec` | api-spec | `.github/skills/api-spec/skills.md` |
| `生成接口` / `接口约定` / `生成 api.md` | api-contract | `.github/skills/api-contract/skills.md` |
| `生成页面` / `生成代码` / `帮我写页面` | page-codegen | `.github/skills/page-codegen/skills.md` |
| `注册路由` / `添加菜单` / `注册页面` | route-register | `.github/skills/route-register/skills.md` |
| `生成 Mock` / `补充模拟数据` / `生成测试数据` | mock-gen | `.github/skills/mock-gen/skills.md` |
| `审计规范` / `代码检查` / `规范检查` | convention-audit | `.github/skills/convention-audit/skills.md` |

**完整流水线**：用户提供原型/详设并要求批量生成时，按 ①→⑦ 顺序依次执行全部 Skill。
**单独使用**：用户只请求特定操作时，只读取对应 Skill 的 skills.md。
**convention-audit 自动执行**：每次代码变更后自动运行，无需用户触发。
