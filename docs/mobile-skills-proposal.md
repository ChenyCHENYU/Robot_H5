# 移动端 AI Skills 工作流方案

> 状态：**v2.0** · 2026-04-19 · 全部 7 个 Skill 已实现 · 8 种 AI 编辑器同源配置 · 决策项已全部确认

---

## 一、背景与目标

参考 PC 端 `@agile-team/wl-skills-kit@1.2.1` 的 Skill 工作流思路，为 **Robot_H5 移动端项目** 设计了一套 AI 辅助开发体系。

**核心差异**：PC 端基于 Element Plus + AbstractPageQueryHook 配置化驱动，移动端基于 **Vant 4 + Apple HIG Liquid Glass 设计系统 + 自研组件（C_Form / C_Table / C_NavBar 等）**，页面模式完全不同。

**最终目标**：AI 拿到原型/详设 → 自动生成可运行的完整页面代码，且风格、结构、命名全部符合项目规范。

**分发策略**：当前在项目内直接维护，后续业务页面和模板场景补齐、提炼成熟后，再抽取为 `@agile-team/wl-skills-kit-mobile` 独立 npm 包（与 PC 端 `wl-skills-kit` 各自独立，互不耦合）。

---

## 二、当前项目技术栈

| 维度 | 技术 |
|------|------|
| 框架 | Vue 3.5 + Vite 7 + TypeScript 5.9 |
| UI 库 | Vant 4.9（自动导入） |
| 设计系统 | Apple HIG Liquid Glass，`--ds-*` 令牌，亮/暗双主题 |
| 样式方案 | UnoCSS + SCSS，4px 网格间距，BEM 命名 |
| 图标 | Iconify（`@iconify-json/ph` + `@iconify-json/ic`） |
| 状态管理 | Pinia 3（持久化 + AES 加密） |
| HTTP | `@miracle-web/utils` MAxios 封装，快捷方法 `get / post / put / del / toast` |
| 路由 | vue-router 4.5，静态模块式注册 |
| Mock | `vite-plugin-mock`（MockMethod 类型，`mock/` 目录 + `data.ts` 静态常量双产物） |
| 自研组件 | C_NavBar / C_Form / C_Table / C_PullRefreshList / C_Icon / C_SvgIcon / C_Logo / C_VirtualStatusBar / C_WebSite |
| Hooks | useTheme / useEnv / useECharts / useScrollCache / useOpenInstall |
| 指令库 | v-lazy / v-slide-in / v-drag / v-copy / v-long-press / v-watermark / v-ripple / v-debounce / v-throttle |
| CI | GitHub Actions — `pnpm type-check` 门禁 + `standard-version` 自动发版 |

---

## 三、Skills 工作流（7 个）

### 完整流水线

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
  ⑥ mock-gen ────────── 补充 Mock 数据（data.ts 常量 + mock/ 端点）
         │
         ▼
  ⑦ convention-audit ── 审计 → P0 静默修复 + P1 修复报告 → pnpm type-check
         │
         ▼
  ✅ 可运行的完整页面
```

### 各 Skill 概要

| # | Skill | 触发词 | 输入 | 输出 |
|---|-------|--------|------|------|
| ① | **prototype-scan** | `扫描原型` / `分析原型` | Axure HTML / 截图 / Markdown | `page-spec.json` 页面骨架 |
| ② | **api-spec** | `生成接口规格` / `接口字段说明` | page-spec.json | `docs/api-spec/{module}.md` 数据契约（字段名/类型/约束/示例） |
| ③ | **api-contract** | `生成接口` / `接口约定` | page-spec.json + api-spec | `src/api/{module}.ts` 前端 API 代码 |
| ④ | **page-codegen** | `生成页面` / `生成代码` | page-spec + api.ts | 三文件分离（vue + scss + data.ts） |
| ⑤ | **route-register** | `注册路由` / `添加菜单` | 页面信息 | `modules.ts` / `menu.ts` 追加路由 |
| ⑥ | **mock-gen** | `生成 Mock` / `补充模拟数据` | data.ts interface | `MOCK_XXX` 常量 + `mock/{module}.ts` 端点 |
| ⑦ | **convention-audit** | 自动执行（每次代码变更后） | 变更文件 | P0 静默修复 + P1 修复报告 |

> 详细规则见各 Skill 的 `skills.md`，审计令牌映射见 `.github/prompts/convention-audit.prompt.md`。

### 页面模板体系

| 模板 | 适用场景 | 参考样例 | 状态 |
|------|---------|---------|------|
| **TPL-LIST** | 搜索 + Tab + 卡片列表 + 操作 + 底部新增 | `src/views/demo/customer/index.vue` | ✅ 已有样例 |
| **TPL-DETAIL** | 顶部信息卡 + VanCellGroup 分区 | `src/views/demo/customer/detail.vue` | ✅ 已有样例 |
| **TPL-FORM** | Liquid Glass 分区表单 + pill/chip 选择器 | `src/views/demo/c-form/index.vue` | ✅ 已有样例 |
| **TPL-TABS** | 顶部 Tab + 每 Tab 不同内容 | — | 🔜 待建设 |
| **TPL-DASHBOARD** | 数据看板 + 图表 | `src/views/chart/` | ✅ 已有样例 |

---

## 四、AI 编辑器支持（8 种）

所有配置文件内容同源自 `.github/copilot-instructions.md`，内嵌 **Skills 自动调度注册表**，任何支持 `read_file` / `tool_use` 的 AI 工具均可自动调度 Skill。

| AI 工具 | 配置文件 | 加载方式 |
|---------|---------|---------|
| **GitHub Copilot** | `.github/copilot-instructions.md` | 自动（原生支持） |
| **Cursor** | `.cursorrules` | 自动 |
| **Windsurf** | `.windsurfrules` | 自动 |
| **Kiro** | `.kiro/steering/conventions.md` | 自动 |
| **Trae** | `.trae/rules/conventions.md` | 自动 |
| **Claude Code** | `CLAUDE.md` | 自动 |
| **Cline / Roo Code** | `.clinerules` | 自动 |
| **通用标准** | `AGENTS.md` | 自动 |

---

## 五、当前目录结构（Skills 体系全景）

以下是 Skills 工作流相关的完整目录树。每项标注当前状态：
- ✅ 已完成，可直接使用
- 🔜 待后续项目迭代补充

### 📦 未来可提取到 `@agile-team/wl-skills-kit-mobile` 的内容

> 这些内容是 **项目无关的**，可在任何新 H5 项目中复用。一旦场景和模板稳定，将整体打包为 npm 包。

```
.github/
├── copilot-instructions.md              ✅ 编码规范母版（11 条规范 + 自动审计 + Skills 注册表）
├── prompts/
│   └── convention-audit.prompt.md       ✅ 审计令牌映射（30 条规则 R01-R30，P0/P1/P2 三级）
└── skills/
    ├── prototype-scan/                  ✅ Skill ① 原型扫描
    │   ├── skills.md                        规则定义
    │   └── README.md                        说明文档
    ├── api-spec/                        ✅ Skill ② 接口规格说明
    │   ├── skills.md
    │   └── README.md
    ├── api-contract/                    ✅ Skill ③ 接口约定
    │   ├── skills.md
    │   └── README.md
    ├── page-codegen/                    ✅ Skill ④ 页面代码生成
    │   ├── skills.md
    │   ├── README.md
    │   ├── TPL-LIST.md                  🔜 待从样例固化
    │   ├── TPL-DETAIL.md                🔜 待从样例固化
    │   └── TPL-FORM.md                  🔜 待从样例固化
    ├── route-register/                  ✅ Skill ⑤ 路由注册
    │   ├── skills.md
    │   └── README.md
    ├── mock-gen/                        ✅ Skill ⑥ Mock 数据生成
    │   ├── skills.md
    │   └── README.md
    └── convention-audit/                ✅ Skill ⑦ 规范审计（自动执行）
        ├── skills.md
        └── README.md

# 编辑器配置文件（安装时由 CLI 从母版自动生成）
.cursorrules                             ✅ Cursor
.windsurfrules                           ✅ Windsurf
.clinerules                              ✅ Cline
.kiro/steering/conventions.md            ✅ Kiro
.trae/rules/conventions.md               ✅ Trae
CLAUDE.md                                ✅ Claude Code
AGENTS.md                                ✅ 通用标准

# 设计系统
DESIGN_SYSTEM.md                         ✅ 令牌定义 + 组件用法指南
src/styles/variables.scss                ✅ 令牌 CSS 实现（亮/暗双主题）
```

### 🔄 需随项目迭代持续完善的内容

> 这些内容依赖具体业务场景，随项目推进逐步积累。

```
src/api/
├── README.md                            ✅ API 目录规范说明
└── user.ts                              ✅ 用户鉴权接口（已有）
    # 🔜 后续业务模块按 {module}.ts 扁平新增（如 customer.ts / order.ts）

src/components/                          ✅ 9 个全局组件（各含 README.md）
├── C_NavBar/                                导航栏
├── C_Form/                                  配置式表单
├── C_Table/                                 数据表格
├── C_PullRefreshList/                       下拉刷新列表
├── C_Icon/                                  图标
├── C_SvgIcon/                               SVG 图标
├── C_Logo/                                  Logo
├── C_VirtualStatusBar/                      虚拟状态栏
└── C_WebSite/                               网站组件

src/views/demo/customer/                 ✅ 领域样例（LIST + DETAIL + FORM 全套）
├── index.vue / index.scss / data.ts         列表页
├── detail.vue / detail.scss                 详情页
└── form.vue / form.scss                     表单页
    # 🔜 后续积累更多业务域样例（设备管理、订单管理等）

mock/
├── _util.ts                             ✅ Mock 工具函数（resultSuccess / resultPageSuccess）
├── _createProductionServer.ts           ✅ 生产 Mock 服务
└── user/user.ts                         ✅ 用户 Mock 数据
    # 🔜 后续业务模块按 {module}.ts 扁平新增

docs/
├── mobile-skills-proposal.md            ✅ 本文件
└── api-spec/                            🔜 各模块接口规格文档（由 Skill ② 生成）
    # 🔜 待补充：c-navbar.md / c-form.md 等组件 API 独立文档
```

### 提取就绪度总览

| 分类 | 数量 | 就绪 | 待补 |
|------|------|------|------|
| AI 编码指令 | 1 份母版 + 7 份编辑器配置 | ✅ 8/8 | — |
| Skills 规则 | 7 个 Skill × (skills.md + README.md) | ✅ 14/14 | — |
| 审计 Prompt | 30 条规则 | ✅ 完整 | — |
| 设计系统文档 | 令牌定义 + CSS 实现 | ✅ 完整 | — |
| 组件 README | 9 个组件 | ✅ 9/9 | — |
| TPL 模板文件 | LIST / DETAIL / FORM | — | 🔜 3 份 |
| 领域样例 | customer 全套 | ✅ 1 套 | 🔜 需更多业务域 |
| 组件 API 文档 | 独立 docs/*.md | — | 🔜 约 8 份 |

---

## 六、与 PC 端 wl-skills-kit 的对比

| 维度 | PC 端 `@agile-team/wl-skills-kit@1.2.1` | 移动端 Skills（本方案） |
|------|------------------------------------------|-----------------------|
| UI 框架 | Element Plus + @jhlc/jh-ui | Vant 4 |
| 设计语言 | — | Apple HIG Liquid Glass，`--ds-*` 令牌 |
| 页面模式 | AbstractPageQueryHook 配置化 | 原生 VanForm / VanCellGroup 分区式 |
| 列表形态 | BaseTable 表格行 | 卡片式（div 手写，移动端布局灵活） |
| 表单形态 | BaseForm 配置化 | VanForm + VanCellGroup inset 分区 |
| 详情形态 | DETAIL_TABS 上表单下 Tab 子表 | 信息卡 + CellGroup 分区展示 |
| 模板数 | 9 种 TPL | 5 种（LIST / DETAIL / FORM / TABS / DASHBOARD） |
| 复杂布局 | 主从分栏 / 左树右列表 / 变更历史 | 不适用（移动端不做复杂布局） |
| Skills 数 | 5 个 | 7 个（增加 api-spec / route-register / mock-gen） |
| 审计方案 | convention-extract（规范提炼） | convention-audit（30 条规则，P0 静默修复 + P1 报告） |
| 分发方式 | npx CLI（init / update / clean） | 项目内维护（成熟后提取独立包） |
| 菜单同步 | API 同步后端菜单表 | 仅路由注册 + 首页菜单数组 |
| AI 编辑器 | 8 种（npx 自动生成） | 8 种（手动同源，提取后 CLI 生成） |
| Mock | vite-plugin-mock | vite-plugin-mock |

### 关键决策：独立两包，不合并

PC 和 H5 的 Skills **各自独立维护**，不合并到同一个 npm 包。理由：

1. **共享部分仅 ~5%**（CLI 引擎 200 行 + api-spec 1 个文件），95% 内容完全不同
2. **技术栈差异大** — 配置化驱动 vs 组件组合式，连"页面长什么样"都不一样
3. **发版节奏不同** — H5 快速建设中，PC 已相对稳定
4. **零耦合** — 各端独立迭代、独立维护，PR 不互相干扰

---

## 七、已确认决策

- [x] **7 个 Skill 全部实现**：prototype-scan → api-spec → api-contract → page-codegen → route-register → mock-gen → convention-audit
- [x] **页面模板**：TPL-LIST / TPL-DETAIL / TPL-FORM 三种核心已有样例，TPL-TABS / TPL-DASHBOARD 后续按需补充
- [x] **API 扁平化**：`src/api/{module}.ts`，一模块一文件（详见 `src/api/README.md`）
- [x] **Mock 双产物**：`data.ts` 静态常量（页面预览）+ `mock/{module}.ts` 端点（`vite-plugin-mock` HTTP 拦截）
- [x] **C_Form 定位**：简单/快速表单用 C_Form 配置驱动，复杂表单直接 VanForm + VanCellGroup 手写
- [x] **分发策略**：项目内维护 → 场景补齐提炼后 → 抽取为 `@agile-team/wl-skills-kit-mobile` 独立包
- [x] **编码规范母版**：`.github/copilot-instructions.md`（11 条规范 + 自动审计 + Skills 注册表）
- [x] **8 种 AI 编辑器**：Copilot / Cursor / Windsurf / Kiro / Trae / Claude Code / Cline / AGENTS.md 全部同源配置

---

## 八、后续待推进项

| 优先级 | 事项 | 说明 |
|--------|------|------|
| P1 | **page-codegen TPL 模板文件** | 将 TPL-LIST / TPL-DETAIL / TPL-FORM 的代码固化为 `.md` 文件放入 `page-codegen/` |
| P1 | **更多业务页面积累** | 随项目迭代积累真实业务页面，检验 Skills 生成质量 |
| P2 | **TPL-TABS / TPL-DASHBOARD 模板** | 遇到真实场景时补充 |
| P2 | **组件 API 独立文档** | 从各组件 README.md 提取为 `docs/c-*.md` 独立 API 文档 |
| P2 | **工具/Hooks/指令文档** | `docs/http.md`、`docs/hooks.md`、`docs/directives.md` |
| P3 | **抽取独立 npm 包** | 场景充分、模板稳定后提取 `@agile-team/wl-skills-kit-mobile`，参照 PC 端 npx CLI 模式 |
