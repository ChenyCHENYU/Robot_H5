# 移动端 AI Skills 工作流方案

> 状态：**v1.2** · 2026-04-19 · 全部 7 个 Skill 已实现，8 种 AI 编辑器同源配置，待讨论项已确认

---

## 一、背景与目标

参考 PC 端 `@agile-team/wl-skills-kit` 的 Skill 工作流思路，为 **Robot_H5 移动端项目** 设计一套 AI 辅助开发体系。

**核心差异**：PC 端基于 Element Plus + AbstractPageQueryHook 配置化驱动，移动端基于 **Vant 4 + Apple HIG Liquid Glass 设计系统 + 自研组件（C_Form / C_Table / C_NavBar 等）**，页面模式完全不同。

**最终目标**：AI 拿到原型/详设 → 自动生成可运行的完整页面代码，且风格、结构、命名全部符合项目规范。

---

## 二、当前项目技术栈盘点

| 维度 | 现状 |
|------|------|
| 框架 | Vue 3.5 + Vite 7 + TypeScript |
| UI 库 | Vant 4 |
| 设计系统 | Apple HIG Liquid Glass，`--ds-*` 令牌，亮/暗双主题 |
| 样式方案 | UnoCSS + SCSS，4px 网格间距 |
| 图标 | Iconify（ph + ic 两个图标包） |
| 状态管理 | Pinia（持久化 + AES 加密） |
| HTTP | @miracle-web/utils MAxios 二次封装 |
| 路由 | vue-router 4，静态模块式注册 |
| 自研组件 | C_NavBar / C_Form / C_Table / C_PullRefreshList / C_Icon / C_SvgIcon |
| Hooks | useTheme / useEnv / useECharts / useScrollCache / useOpenInstall |
| Mock | vite-plugin-mock-dev-server |
| 指令库 | v-lazy / v-slide-in / v-drag / v-copy / v-long-press / v-watermark / v-ripple / v-debounce / v-throttle |

---

## 三、Skill 定义（6 + 1）

### Skill 1：prototype-scan — 原型扫描

**触发词**：`扫描原型` / `分析原型` / `解析设计稿`

**输入**：Axure HTML 文件路径 或 设计文档（Markdown / 图片）

**输出**：`page-spec.json` — 结构化页面描述

```json
{
  "pageName": "customer-archive",
  "pageTitle": "客户档案",
  "pageType": "LIST",          // LIST | FORM | DETAIL | TABS
  "search": { "fields": [...] },
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

**移动端适配要点**：
- PC 是表格行，移动端是卡片。需提取 `primary / secondary / tags / meta` 层级
- 底部固定操作栏（新增按钮）是移动端特有的
- Tab 过滤是水平滑动，不是左侧筛选面板

---

### Skill 2：api-contract — 接口约定

**触发词**：`生成接口文档` / `生成 api.md` / `接口约定`

**输入**：page-spec.json

**输出**：`api.md` — 前后端接口约定

```markdown
## 客户档案 API

### 1. 查询列表
- POST /api/customer/list
- Body: { keyword?, customerType?, page, pageSize }
- Response: { code, data: { records: Customer[], total } }

### 2. 查看详情
- GET /api/customer/{id}
- Response: { code, data: Customer }

### 3. 新增
- POST /api/customer/add
- Body: CustomerForm

### 4. 编辑
- PUT /api/customer/{id}
- Body: CustomerForm

### 5. 作废
- POST /api/customer/{id}/void
```

**规范约束**：
- HTTP 工具：使用 `src/utils/http` 的 `get / post / put / del`
- API 文件位置：`src/api/{domain}/{module}.ts`
- 命名规则：`get{Module}List` / `get{Module}Detail` / `add{Module}` / `update{Module}` / `delete{Module}`
- 统一响应格式：`{ code: number, data: T, msg: string }`

---

### Skill 3：page-codegen — 页面代码生成（核心）

**触发词**：`生成页面` / `生成代码` / `帮我写页面`

**输入**：page-spec.json + api.md（或直接从详设文档）

**输出**：每个页面生成一组文件：

```
src/views/{domain}/{module}/
├── index.vue          ← 主页面（列表 / 表单 / 详情）
├── index.scss         ← 样式（BEM命名，--ds-* 令牌）
├── data.ts            ← 类型定义 + 常量映射 + Mock数据
├── detail.vue         ← 详情页（如有）
├── detail.scss
├── form.vue           ← 表单页（如有）
└── form.scss
```

#### 3.1 页面模板体系

| 模板 ID | 适用场景 | 参考样例 |
|---------|---------|---------|
| **TPL-LIST** | 搜索 + Tab 过滤 + 卡片列表 + 操作 + 底部新增 | `demo/customer/index.vue` |
| **TPL-DETAIL** | 顶部信息卡 + 分区 VanCellGroup 信息展示 | `demo/customer/detail.vue` |
| **TPL-FORM** | Liquid Glass 分区表单 + 必填切换 + pill/chip 选择器 + 固定底栏 | `demo/c-form/index.vue` |
| **TPL-TABS** | 顶部 Tab + 每 Tab 不同内容 | 待建设 |
| **TPL-DASHBOARD** | 数据看板 + 图表 | `views/chart/` |

#### 3.2 生成规范约束（编码规范指令）

**文件结构**：
```
<template>               ← 顶部
</template>

<script setup lang="ts">  ← 底部，必须有 defineOptions({ name })
import './index.scss';
import { ... } from 'vant';
import { ... } from './data';
</script>
<!-- 样式写在独立 .scss 文件，不用 <style> 内联 -->
```

**样式规范**：
- 禁止硬编码颜色/圆角/阴影 — 必须用 `var(--ds-xxx)` 令牌
- BEM 命名：`.{page-name}__{element}--{modifier}`
- 间距使用 4px 网格：`4 / 8 / 12 / 16 / 20 / 24 / 32`
- 字体大小梯度：`11(说明) / 12(辅助) / 13(列表) / 14(正文) / 15(卡片标题) / 16(页标题)`
- 底部安全区：`padding-bottom: calc(Xpx + env(safe-area-inset-bottom))`

**布局规范**：
- 分区标题：左侧 3px accent 竖线 + 14px/600 标题文字
- 表单区：`<VanCellGroup inset>` 包裹，每区独立分组
- 固定底栏：`position: fixed; bottom: 0; border-top: 0.5px solid var(--ds-divider)`
- 卡片：`background: var(--ds-bg-secondary); border-radius: var(--ds-radius-md); padding: 12px 14px`
- 页面背景：`var(--ds-bg)` 不可用白色
- 最小高度：`min-height: 100dvh`

**组件使用规范**：
- 导航栏：`<C_NavBar title="xxx" />` 必须作为第一个子元素
- 图标：UnoCSS 类名 `i-ph:{name}-bold`，不用 CDN
- 搜索：`<VanField>` 带 `left-icon` 插槽
- Tab 过滤：`<VanTabs shrink>` + `<VanTab>` 循环
- 列表卡片：手写 div 卡片（不用 C_Table，因为真实业务卡片布局各不相同）
- 表单：`<VanForm :show-error="false" scroll-to-error>` + `<VanCellGroup inset>` 分区
- Picker 选择：`<VanPopup position="bottom" round>` + `<VanPicker>`
- 操作确认：`showConfirmDialog()`
- 反馈：`showToast()`
- 状态标签：`<VanTag :type round size="medium">`

**TypeScript 规范**：
- 类型定义放 `data.ts`，用 `export interface`
- 状态映射常量用 `Record<string, { text: string, type: string }>`
- 组件 name 与路由 name 保持一致
- `defineOptions({ name: 'PageName' })` 必须有

---

### Skill 4：route-register — 路由与菜单注册

**触发词**：`注册路由` / `添加菜单`

**输入**：页面信息（路径、标题、是否缓存）

**操作**：
1. 在 `src/router/modules.ts` 的 `routeModuleList` 数组末尾追加路由
2. 如需在首页菜单显示，在 `src/views/demo/data.ts` 的 `menuItems` 数组追加
3. 详情/表单等子页面只注册路由，不注册菜单

**路由规范**：
```typescript
{
    path: '/customerArchive',        // 驼峰命名
    name: 'CustomerArchive',         // 与 defineOptions.name 一致
    meta: {
        title: '客户档案',            // 中文标题
        keepAlive: false,             // 列表页建议 false，编辑页 false
    },
    component: () => import('@/views/{domain}/{module}/index.vue'),
}
```

---

### Skill 5：convention-audit — 规范审计

**触发词**：`审计规范` / `代码检查` / `还原度检查`

**检查维度**：

| 检查项 | 规则 | 严重度 |
|--------|------|--------|
| 硬编码颜色 | 不允许 `#xxx` / `rgb()` / `rgba()`，必须用 `--ds-*` | 🔴 Error |
| 硬编码圆角 | 不允许 `border-radius: Npx`，必须用 `--ds-radius-*` | 🔴 Error |
| 缺少 defineOptions | `<script setup>` 必须有 `defineOptions({ name })` | 🔴 Error |
| 缺少 C_NavBar | 页面级组件必须以 `<C_NavBar>` 开头 | 🟡 Warn |
| 内联样式 | 禁止 `<style>` 块，必须外置 `.scss` | 🟡 Warn |
| 安全区适配 | 底部固定栏必须有 `env(safe-area-inset-bottom)` | 🟡 Warn |
| 间距不合规 | 间距值必须是 4 的倍数 | 🟢 Info |
| 字号不合规 | font-size 必须在 `11/12/13/14/15/16/17/20/22/28/34` 之内 | 🟢 Info |
| 图标规范 | 必须用 `i-ph:xxx-bold` 或 `i-ic:xxx`，不可用 CDN | 🟡 Warn |
| API 命名 | 必须遵循 `get/add/update/delete + Module` 命名 | 🟡 Warn |
| import 未使用 | 不允许未使用的导入 | 🔴 Error |
| data.ts 状态映射 | 状态类字段必须有 `XxxMap` 常量 + `<VanTag>` 渲染 | 🟡 Warn |

**输出**：偏差报告 + 自动修复建议

---

### Skill 6（附加）：mock-gen — Mock 数据生成

**触发词**：`生成 Mock` / `补充模拟数据`

**输入**：data.ts 中的类型定义

**输出**：在 `data.ts` 中生成 `MOCK_XXX` 常量数组（6~10 条真实感数据）

**规范**：
- 数据必须覆盖所有字段，不可留空
- 状态字段必须覆盖所有枚举值
- 时间格式：`YYYY-MM-DD HH:mm:ss`
- 编号格式：与业务一致（如 `10000001`、`L10000001`）

---

## 四、完整工作流

```
  设计稿 / Axure 原型 / 详设文档
         │
         ▼
  ① prototype-scan ──── 扫描 → page-spec.json
         │
         ▼
  ② api-spec ────────── 生成 → docs/api-spec/{module}.md（数据契约）
         │
         ▼
  ③ api-contract ────── 生成 → src/api/{module}.ts（前端 API 代码）
         │
         ▼
  ④ page-codegen ────── 生成 → index.vue + index.scss + data.ts
         │                      detail.vue + detail.scss（如有）
         │                      form.vue + form.scss（如有）
         │
         ▼
  ⑤ route-register ──── 注册路由 + 菜单入口
         │
         ▼
  ⑥ mock-gen ────────── 补充 Mock 数据（如 data.ts 中未生成）
         │
         ▼
  ⑦ convention-audit ── 审计所有生成的代码 → 偏差报告 → 自动修复
         │
         ▼
  ✅ 可运行的完整页面
```

---

## 五、交付物清单

| 交付物 | 位置 | 说明 |
|--------|------|------|
| AI 编码规范指令 | `.github/copilot-instructions.md` | 项目总纲（设计令牌、组件用法、命名规范） |
| Skill 1 | `.github/skills/prototype-scan/SKILL.md` | 原型扫描规则 |
| Skill 2 | `.github/skills/api-spec/SKILL.md` | 接口规格说明生成规则 |
| Skill 3 | `.github/skills/api-contract/SKILL.md` | 接口约定生成规则 |
| Skill 4 | `.github/skills/page-codegen/SKILL.md` | 页面代码生成规则 |
| Skill 4 模板 | `.github/skills/page-codegen/TPL-LIST.md` | 列表页模板 |
| Skill 4 模板 | `.github/skills/page-codegen/TPL-DETAIL.md` | 详情页模板 |
| Skill 4 模板 | `.github/skills/page-codegen/TPL-FORM.md` | 表单页模板 |
| Skill 5 | `.github/skills/route-register/SKILL.md` | 路由注册规则 |
| Skill 6 | `.github/skills/convention-audit/SKILL.md` | 规范审计规则 |
| Skill 7 | `.github/skills/mock-gen/SKILL.md` | Mock 生成规则 |
| 组件文档 | `docs/c-navbar.md` | C_NavBar API 文档 |
| 组件文档 | `docs/c-form.md` | C_Form API 文档（配置驱动场景） |
| 组件文档 | `docs/c-table.md` | C_Table API 文档 |
| 组件文档 | `docs/c-pull-refresh-list.md` | C_PullRefreshList API 文档 |
| 组件文档 | `docs/c-icon.md` | C_Icon API 文档 |
| 组件文档 | `docs/http.md` | HTTP 请求工具文档 |
| 组件文档 | `docs/hooks.md` | Hooks 合集文档 |
| 组件文档 | `docs/directives.md` | 指令库文档 |
| 设计系统 | `DESIGN_SYSTEM.md`（已有） | 设计令牌参考 |
| 领域样例 | `src/views/demo/customer/` | 客户档案（LIST + DETAIL + FORM 全套样例） |

---

## 六、与 PC 端 wl-skills-kit 的对比

| 维度 | PC 端 wl-skills-kit | 移动端 Skills（本方案） |
|------|---------------------|----------------------|
| UI 框架 | Element Plus + @jhlc/jh-ui | Vant 4 |
| 设计语言 | — | Apple HIG Liquid Glass |
| 页面模式 | AbstractPageQueryHook 配置化 | 原生 VanForm/VanCellGroup 分区式 |
| 列表形态 | BaseTable 表格行 | 卡片式（div 手写） |
| 表单形态 | BaseForm 配置化 | VanForm + VanCellGroup inset 分区 |
| 详情形态 | DETAIL_TABS 上表单下Tab子表 | 信息卡 + CellGroup 分区展示 |
| 模板数 | 9 种 | 5 种（LIST / DETAIL / FORM / TABS / DASHBOARD） |
| 复杂度 | 上下分栏/左树右列表/变更历史 | 不适用（移动端不做复杂布局） |
| 分发方式 | npx CLI 注入 | 项目内维护（成熟后提取为独立 npm 包） |
| 菜单同步 | API 同步到后端菜单表 | 仅路由注册 + 首页菜单数组 |
| AI 编辑器 | 8 种（npx 自动生成） | 8 种（Copilot / Cursor / Windsurf / Kiro / Trae / Claude / Cline / AGENTS） |

---

## 七、已确认决策

- [x] **Skill 优先级**：全部 7 个 Skill 已实现（prototype-scan → api-spec → api-contract → page-codegen → route-register → mock-gen → convention-audit）
- [x] **模板体系**：TPL-LIST / TPL-DETAIL / TPL-FORM 三种核心模板，TPL-TABS / TPL-DASHBOARD 后续按需补充
- [x] **API 层级**：已扁平化为 `src/api/{module}.ts`（详见 `src/api/README.md`）
- [x] **Mock 方案**：双产物 — `data.ts` 静态常量（页面预览）+ `mock/{module}.ts` 端点（vite-plugin-mock HTTP 拦截）
- [x] **C_Form 组件定位**：简单/快速表单用 C_Form 配置驱动，复杂表单直接 VanForm + VanCellGroup 手写
- [x] **分发方式**：当前项目内维护，后续场景补齐、提练成熟后再抽取为 `@agile-team/wl-skills-kit-mobile` 独立包
- [x] **copilot-instructions.md**：已生成，含 11 条核心规范 + 自动审计 + Skills 自动调度注册表
- [x] **多编辑器支持**：8 种 AI 编辑器配置同源（Copilot / Cursor / Windsurf / Kiro / Trae / Claude Code / Cline / AGENTS.md）
