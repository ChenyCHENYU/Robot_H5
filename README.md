# Robot H5

> **Vue 3 + Vite 7 + TypeScript** 移动端 H5 应用框架
>
> 设计语言：Apple HIG Liquid Glass · 暗黑模式 · CSS Cascade Layers · 响应式 viewport 适配

---

## 目录

- [快速开始](#快速开始)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [设计系统](#设计系统)
- [开发指南](#开发指南)
- [构建与部署](#构建与部署)
- [环境变量](#环境变量)
- [常用命令](#常用命令)
- [提交规范](#提交规范)
- [架构约定](#架构约定)
- [已知坑点](#已知坑点)

---

## 快速开始

```bash
# 环境要求
node >= 20.0.0
pnpm >= 8.15.6

# 安装依赖
pnpm install

# 启动开发服务（含 Mock）
pnpm dev

# 生产构建
pnpm build:prod
```

**默认账号**：`admin` / `123456`

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 Composition API | 3.5 |
| 构建 | Vite | 7.1 |
| 类型 | TypeScript | 5.9 |
| UI 库 | Vant 4（自动导入） | 4.9 |
| 状态管理 | Pinia + 持久化 | 3.0 |
| 路由 | Vue Router | 4.5 |
| 原子 CSS | UnoCSS + preset-icons | 66.5 |
| 图表 | ECharts | 6.0 |
| HTTP | Axios（MAxios 封装） | — |
| Mock | vite-plugin-mock + MockJS | — |
| PWA | vite-plugin-pwa | 1.2 |
| 工程规范 | @robot-admin/git-standards | 1.0 |

---

## 目录结构

```
├── build/                      # 构建配置
│   └── vite/
│       ├── build.ts            #   Rollup 输出配置
│       ├── proxy.ts            #   开发代理
│       └── plugin/             #   Vite 插件集（按需启用）
│
├── mock/                       # Mock 数据（模块 = 目录）
│
├── src/
│   ├── api/                    # 接口层（按模块分目录）
│   ├── components/             # 全局组件（C_ 前缀，自动注册）
│   ├── hooks/                  # 组合式函数
│   ├── layout/                 # 布局容器（TabBar）
│   ├── plugins/                # 插件注册入口
│   ├── router/                 # 路由（守卫 + 菜单 + 子页面）
│   ├── services/               # 原生桥接（JSBridge）
│   ├── store/                  # Pinia 状态管理
│   ├── styles/                 # 全局样式（Token + 动画）
│   ├── utils/                  # 工具函数（http / directives / const）
│   └── views/                  # 页面视图
│       ├── dashboard/          #   首页
│       ├── chart/              #   图表
│       ├── demo/               #   功能演示
│       ├── mine/               #   个人中心
│       ├── login/              #   登录/注册/找回密码
│       └── exception/          #   404
│
├── types/                      # 全局类型声明
├── index.html                  # HTML 模板（@layer 声明在此）
├── vite.config.ts              # Vite 配置
└── uno.config.ts               # UnoCSS 配置
```

---

## 设计系统

基于 **Apple HIG Liquid Glass** 设计规范，详见 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)。

### 核心 CSS Token

```css
/* 背景 */
--ds-bg / --ds-bg-secondary / --ds-surface
/* 文字 */
--ds-text-primary / --ds-text-secondary / --ds-text-tertiary
/* 强调色（跟随主题色变化） */
--ds-accent / --ds-accent-hover / --ds-accent-light
/* 语义色 */
--ds-success / --ds-warning / --ds-danger
/* 毛玻璃 */
--ds-glass-bg / --ds-glass-blur / --ds-glass-border / --ds-glass-shine
/* 圆角 */
--ds-radius-sm(8px) / --ds-radius-md(12px) / --ds-radius-lg(16px) / --ds-radius-xl(20px)
```

### BEM 命名约定

```scss
.page-name {
    &__section { ... }
    &__cell {
        &--active { ... }
    }
}
```

---

## 开发指南

### 新增页面

**1. 创建三文件结构：**

```
src/views/my-page/
├── index.vue     # 模板 + 逻辑
├── index.scss    # 样式（不写 <style>，用 import 引入）
└── data.ts       # 静态数据（可选，用于 v-for 驱动列表）
```

**2. `index.vue` 模板：**

```vue
<template>
    <div class="my-page">
        <CNavBar />
        <div class="my-page__content">
            <!-- 内容 -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    defineOptions({ name: 'MyPage' });  // name 必须与路由 name 一致
</script>
```

**3. `index.scss` 模板：**

```scss
.my-page {
    min-height: 100%;           // ⚠️ 必须 min-height，不能 height:100%（内容会截断）
    background: var(--ds-bg);

    &__content {
        background: var(--ds-glass-bg);
        backdrop-filter: blur(var(--ds-glass-blur));
        border-radius: var(--ds-radius-lg);
    }
}
```

### 新增路由

**子页面**（点击跳转）→ `src/router/modules.ts`：

```ts
{
    path: '/myPage',
    name: 'MyPage',                    // ⚠️ 与 defineOptions.name 一致
    meta: { title: '页面标题', keepAlive: false },
    component: () => import('@/views/my-page/index.vue'),
},
```

**TabBar 主导航页**→`src/router/menu.ts`：

```ts
{
    path: '/myTab',
    name: 'MyTab',
    meta: { title: '标签名', icon: 'i-ph:icon-bold', keepAlive: true },
    component: () => import('@/views/my-tab/index.vue'),
},
```

> `keepAlive: true` 的页面才会被 `<keep-alive>` 缓存，组件 `name` 必须与路由 `name` 一致。

### 调用 API

```ts
// src/api/system/order.ts
import { http } from '@/utils/http';

export const getOrderList = (params?: object) =>
    http.request({ url: '/order/list', method: 'GET', params });

export const createOrder = (data: object) =>
    http.request({ url: '/order/create', method: 'POST', data },
        { isShowSuccessMessage: true, successMessageText: '创建成功' });
```

**HTTP 请求选项（RequestOptions）：**

| 选项 | 默认 | 说明 |
|------|------|------|
| `withToken` | `true` | 是否携带 Token |
| `isShowSuccessMessage` | `false` | 成功时弹 Toast |
| `isShowErrorMessage` | `false` | 失败时弹 Toast |
| `successMessageText` | — | 自定义成功消息 |
| `isReturnNativeResponse` | `false` | 返回原始 AxiosResponse |
| `joinTime` | `true` | GET 加时间戳防缓存 |

### Mock 数据

```ts
// mock/order/order.ts
import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError } from '../_util';

export default [
    {
        url: '/api/order/list',
        method: 'get',
        response: () => resultSuccess({ list: [], total: 0 }),
    },
] as MockMethod[];
```

> 文件名以 `_` 开头则被忽略（用于工具文件，如 `_util.ts`）。

### 使用图标

```html
<!-- UnoCSS 图标（推荐） -->
<i class="i-ph:heart-bold" />
<i :class="dynamicIcon" />
```

已安装图标集：`ph`、`ic`、`mdi`、`carbon`、`tabler`、`bxs`、`mingcute`、`mage`、`iconamoon`

> 在 `.ts` 数据文件中用到的图标类名需加入 `uno.config.ts` 的 `safelist`。

```html
<!-- SVG 图标（自定义图标） -->
<!-- 将 .svg 文件放入 src/assets/svgs/ -->
<CSvgIcon name="logo" :size="24" />
```

### 全局组件

通过 `unplugin-vue-components` 自动注册，无需手动 `import`：

```html
<CNavBar title="标题" />
<CIcon name="ph:heart-bold" :size="20" color="var(--ds-accent)" />
<CSvgIcon name="logo" />
<CPullRefreshList :request="fetchList" :finished="noMore" />
<CWebSite />    <!-- 内嵌 WebView 容器 -->
```

### 状态管理

```ts
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();

const nickname = computed(() => userStore.getUserInfo.nickname);
userStore.setToken('xxx');
```

新建 Store：

```ts
// src/store/modules/order.ts
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useOrderStore = defineStore('app-order-store', {
    state: () => ({ list: [] as any[] }),
    actions: { setList(list: any[]) { this.list = list; } },
    persist: { key: 'ORDER-DATA' },
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot));
```

---

## 构建与部署

```bash
pnpm build:prod       # 生产构建（类型检查 + Gzip）
pnpm preview:dist     # 预览构建产物
```

**Nginx 部署示例：**

```nginx
server {
    listen 80;
    root /path/to/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_static on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

---

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_GLOB_APP_TITLE` | 应用名称 |
| `VITE_PORT` | 开发端口（默认 8888） |
| `VITE_PUBLIC_PATH` | 公共路径（部署子目录时配置） |
| `VITE_PROXY` | 开发代理 `[["/api","http://host"]]` |
| `VITE_GLOB_API_URL` | 接口 Base URL |
| `VITE_GLOB_API_URL_PREFIX` | 接口前缀（默认 `/api`） |
| `VITE_USE_MOCK` | 启用 Mock（**生产环境必须为 false**） |
| `VITE_HASH_ROUTE` | 启用 Hash 路由 |
| `VITE_BUILD_COMPRESS` | 压缩方式 `gzip` / `brotli` / `none` |

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（含 Mock） |
| `pnpm build:prod` | 生产构建 |
| `pnpm preview` | 构建 + 预览 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查并自动修复 |
| `pnpm cz` | 交互式规范提交（Commitizen） |
| `pnpm clean` | 清理 node_modules + dist |
| `pnpm deps:check` | 检查依赖更新 |

---

## 提交规范

```bash
pnpm cz   # 交互式规范提交（推荐）
```

基于 [`@robot-admin/git-standards`](https://www.npmjs.com/package/@robot-admin/git-standards)，包含 Commitizen + Commitlint + Husky + lint-staged。

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `perf` | 性能优化 |
| `refactor` | 重构 |
| `docs` | 文档变更 |
| `style` | 代码样式 |
| `build` | 构建/打包 |
| `chore` | 其他杂项 |
| `revert` | 回退 |

**Git Hooks：**

| Hook | 作用 |
|------|------|
| `pre-commit` | lint-staged 增量检查暂存文件 |
| `commit-msg` | commitlint 校验提交格式 |

---

## 架构约定

| 约定 | 说明 |
|------|------|
| **样式文件分离** | `.vue` 不写 `<style>`，样式放 `index.scss` 用 `import './index.scss'` 引入 |
| **CSS @layer 层级** | `base`（reset）< `components`（SCSS）< `utilities`（UnoCSS），见下方 |
| **BEM 作用域** | 每个页面用唯一根类名隔离（如 `.mine-page`），不使用 `scoped` |
| **页面最小高度** | 页面根类 `min-height: 100%`（非 `height: 100%`），防止短内容垂直截断 |
| **组件命名** | 全局组件 `C_` 前缀；页面子组件放 `components/`（三文件结构） |
| **路由 name 一致性** | 路由 `name` 必须与组件 `defineOptions({ name })` 完全一致 |
| **自动导入** | Vue / VueRouter / VueUse API 均自动导入，无需手动 `import { ref }` |
| **数据驱动模板** | 重复列表标签提取到 `data.ts` 用 `v-for` 驱动，避免硬编码冗余 |
| **Token 鉴权** | HTTP 请求自动注入 `Authorization`，401 自动跳转登录 |
| **数据持久化** | Pinia persist：生产环境 AES 加密，开发环境 JSON |

### CSS @layer 优先级体系

```
@layer base         ← UnoCSS preflight（reset/normalize），最低优先级
@layer components   ← 组件 SCSS（vite.config.ts additionalData 自动包裹）
@layer utilities    ← UnoCSS 工具类（flex / mb-4 等），最高优先级
```

| 关键文件 | 作用 |
|----------|------|
| `index.html` | `<style>@layer base, components, utilities;</style>` 声明层顺序 |
| `uno.config.ts` | `outputToCssLayers`：preflight → `base`，工具类 → `utilities` |
| `vite.config.ts` | `additionalData`：`src/` 下 SCSS 自动包裹进 `@layer components` |

---

## 已知坑点

### Vue Router v-slot class fallthrough（已修复）

```vue
<!-- ❌ 错误写法：class 会 fallthrough 到匹配组件根元素 -->
<routerView v-slot="{ Component }" class="overflow-hidden">

<!-- ✅ 正确写法：用真实 div 承接 class -->
<div class="flex-1 overflow-hidden">
    <routerView v-slot="{ Component }">
        <component :is="Component" />
    </routerView>
</div>
```

原因：Vue Router 4 的 `v-slot` 会把 `<routerView>` 上的 class 透传给子组件根元素。
当 `overflow-hidden`（UnoCSS utilities 层，最高优先级）被注入页面根元素时，会覆盖页面 SCSS 的 `overflow-y: auto`，导致所有页面内部滚动失效。

### Flexbox top-clip bug（已修复）

```scss
// ❌ 错误：内容超出时 margin:auto 将上方溢出推入不可滚动区域
&__inner { margin-top: auto; margin-bottom: auto; }

// ✅ 正确：伪元素占位，内容短时居中，内容长时收缩为 0 可滚动
&__inner { flex-shrink: 0; }
&::before, &::after { content: ''; flex: 1 1 0; }
```

### SCSS @layer 包裹与 :deep() 不兼容

`vite.config.ts additionalData` 将组件 SCSS 包裹进 `@layer components { ... }`，
因此不能在 `.vue` 的 `<style>` 中使用 `:deep()`（会被包进层导致选择器失效）。
统一用 `index.scss` + `.class :deep(.van-xx)` 的方式覆盖 Vant 样式。

### 生产环境必须关闭 Mock

`.env.production` 中 `VITE_USE_MOCK = false`（已配置）。
如果设置为 `true` 会将 Mock 数据打包进产物，暴露接口数据结构。

### KeepAlive 与路由 name 一致性

`<keep-alive>` 按组件 `name` 匹配缓存，路由 `name` 与 `defineOptions({ name })` 不一致时缓存静默失效，表现为每次进入页面都重新加载。

---

**PROPRIETARY** — 内部私有项目。© Robot H5. All rights reserved.
