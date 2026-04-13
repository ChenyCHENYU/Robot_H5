# Robot H5

> **Vue 3 + Vite 7 + TypeScript** — 移动端 H5 应用框架  
> 设计语言：Apple HIG Liquid Glass · 暗黑模式 · 响应式 viewport 适配

---

## 目录

- [快速开始](#快速开始)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [设计系统](#设计系统)
- [开发指南](#开发指南)
  - [新增页面](#新增页面)
  - [新增路由](#新增路由)
  - [调用 API](#调用-api)
  - [新增 Mock 数据](#新增-mock-数据)
  - [使用图标](#使用图标)
  - [使用组件](#使用组件)
  - [状态管理](#状态管理)
- [构建与部署](#构建与部署)
- [环境变量](#环境变量)
- [常用命令](#常用命令)
- [提交规范](#提交规范)
- [架构决策与约定](#架构决策与约定)
- [扩展与优化建议](#扩展与优化建议)
- [License](#license)

---

## 快速开始

```bash
# 环境要求
node >= 20.0.0
pnpm >= 8.15.6

# 安装依赖
pnpm install

# 启动开发服务
pnpm dev

# 构建产物
pnpm build:test    # 测试环境
pnpm build:prod    # 生产环境
```

**默认账号**：`admin` / `123456`

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | 3.5 |
| 构建 | Vite | 7.1 |
| 类型 | TypeScript | 5.9 |
| UI 库 | Vant 4 (自动导入) | 4.9 |
| 状态管理 | Pinia + 持久化 | 3.0 |
| 路由 | Vue Router | 4.5 |
| 原子 CSS | UnoCSS + preset-icons | 66.5 |
| 图表 | ECharts | 6.0 |
| HTTP | Axios (MAxios 封装) | — |
| Mock | vite-plugin-mock + MockJS | — |
| 工程规范 | @robot-admin/git-standards (ESLint + Husky + Commitlint + lint-staged) | 1.0 |

---

## 目录结构

```
├── build/                           # 构建配置
│   ├── utils.ts                     #   工具函数
│   └── vite/
│       ├── build.ts                 #   构建选项（chunk 拆分）
│       ├── proxy.ts                 #   开发代理
│       └── plugin/                  #   Vite 插件集
│
├── mock/                            # Mock 数据
│   ├── _util.ts                     #   响应工具
│   └── user/user.ts                 #   用户接口 Mock
│
├── src/
│   ├── main.ts                      # 应用入口
│   ├── App.vue                      # 根组件
│   ├── api/                         # 接口层（按模块分目录）
│   ├── assets/                      # 静态资源
│   │   ├── icons/                   #   异常页图标
│   │   └── svgs/                    #   SVG 图标库
│   ├── components/                  # 全局组件（C_ 前缀）
│   │   ├── C_NavBar/                #   导航栏
│   │   ├── C_PullRefreshList/       #   下拉刷新列表
│   │   ├── C_SvgIcon/               #   SVG 图标
│   │   ├── C_VirtualStatusBar/      #   虚拟状态栏
│   │   └── C_WebSite/               #   WebView 容器
│   ├── enums/                       # 枚举常量
│   ├── hooks/                       # 组合式函数
│   │   ├── useTheme/                #   主题切换
│   │   ├── useEnv/                  #   环境变量
│   │   ├── useECharts/              #   ECharts 管理
│   │   └── useScrollCache/          #   滚动缓存
│   ├── layout/                      # 布局容器（TabBar）
│   ├── plugins/                     # 插件注册
│   ├── router/                      # 路由
│   │   ├── base.ts                  #   基础路由（Login/Root/404）
│   │   ├── menu.ts                  #   TabBar 菜单路由
│   │   ├── modules.ts               #   子页面路由
│   │   └── router-guards.ts         #   路由守卫
│   ├── services/                    # 原生桥接
│   ├── store/                       # Pinia 状态管理
│   │   └── modules/
│   │       ├── user.ts              #   用户/Token
│   │       ├── theme.ts             #   主题配置
│   │       ├── route.ts             #   菜单/KeepAlive
│   │       └── app.ts               #   应用设置
│   ├── styles/                      # 全局样式
│   │   ├── variables.scss           #   CSS Token 定义
│   │   ├── common.scss              #   基础样式
│   │   └── transition/              #   转场动画集
│   ├── utils/                       # 工具函数
│   │   ├── http/                    #   Axios 封装
│   │   └── directives/              #   自定义指令
│   └── views/                       # 页面视图
│       ├── dashboard/               #   首页
│       ├── demo/                    #   功能演示
│       ├── chart/                   #   图表
│       ├── mine/                    #   个人中心
│       ├── login/                   #   登录
│       └── exception/               #   404
│
├── types/                           # 全局类型声明
├── vite.config.ts                   # Vite 配置
├── uno.config.ts                    # UnoCSS 配置
└── tsconfig.json                    # TypeScript 配置
```

---

## 设计系统

基于 **Apple HIG Liquid Glass** 设计规范，详见 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)。

### 核心 Token

| Token | 用途 | 亮色值 |
|-------|------|--------|
| `--ds-bg` | 页面背景 | `#FFFFFF` |
| `--ds-bg-secondary` | 卡片背景 | `#F5F5F7` |
| `--ds-accent` | 主题强调色 | `#0071E3` |
| `--ds-text-primary` | 主文本 | `#1D1D1F` |
| `--ds-glass-bg` | 毛玻璃背景 | `rgba(255,255,255,0.52)` |
| `--ds-glass-blur` | 背景模糊 | `40px` |
| `--ds-radius-lg` | 大圆角 | `16px` |

### BEM 命名

```scss
.page-name { &__section { ... } &__cell { &--active { ... } } }
```

---

## 开发指南

### 新增页面

**1. 创建目录（标准三文件结构）：**

```
src/views/my-page/
├── index.vue        # 模板 + 逻辑
├── index.scss       # 样式
└── data.ts          # 静态数据（可选）
```

**2. 编写 `index.vue`：**

```vue
<template>
    <div class="my-page">
        <CNavBar />
        <div class="my-page__content">
            <!-- 页面内容 -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import './index.scss';
    defineOptions({ name: 'MyPage' });
</script>
```

> **重要**：`defineOptions({ name: 'MyPage' })` 中的 `name` 必须与路由的 `name` 一致，否则 `KeepAlive` 缓存失效。

**3. 编写 `index.scss`：**

```scss
.my-page {
    min-height: 100%;
    padding: 0 20px 32px;
    background: var(--ds-bg);

    &__content {
        // 毛玻璃卡片
        background: var(--ds-glass-bg);
        backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate));
        border: 1px solid var(--ds-glass-border);
        border-radius: var(--ds-radius-lg);
        box-shadow: var(--ds-glass-shine), var(--ds-glass-shadow);
    }
}
```

---

### 新增路由

**子页面路由**（点击跳转的页面）→ 添加到 `src/router/modules.ts`：

```ts
{
    path: '/myPage',
    name: 'MyPage',                           // 必须与组件 defineOptions.name 一致
    meta: {
        title: '页面标题',                      // 自动设置 document.title
        keepAlive: false,                      // 是否缓存（默认 false）
    },
    component: () => import('@/views/my-page/index.vue'),
},
```

**TabBar 主页路由**（底部导航页面）→ 修改 `src/router/menu.ts`：

```ts
// menu.ts children 数组中添加
{
    path: '/myTab',
    name: 'MyTab',
    meta: {
        title: '标签名',
        icon: 'i-ph:icon-name-bold',          // UnoCSS 图标类名
        keepAlive: true,
    },
    component: () => import('@/views/my-tab/index.vue'),
},
```

> **提示**：新增 TabBar 图标后需要在 `uno.config.ts` 的 `safelist` 中添加对应图标类名。

---

### 调用 API

**1. 定义接口（`src/api/` 按模块分目录）：**

```ts
// src/api/system/order.ts
import { http } from '@/utils/http';

// GET 请求
export const getOrderList = (params?: object) =>
    http.request({ url: '/order/list', method: 'GET', params });

// POST 请求
export const createOrder = (data: object) =>
    http.request({
        url: '/order/create',
        method: 'POST',
        data,
    }, {
        isShowSuccessMessage: true,           // 成功弹 Toast
        successMessageText: '创建成功',
    });

// 不携带 Token 的请求
export const publicApi = (params?: object) =>
    http.request({ url: '/public/data', method: 'GET', params }, { withToken: false });
```

**2. 在组件中使用：**

```vue
<script setup lang="ts">
    import { getOrderList, createOrder } from '@/api/system/order';

    // 获取数据
    const list = ref([]);
    const fetchList = async () => {
        const { data } = await getOrderList({ page: 1 });
        list.value = data.list;
    };

    // 提交数据
    const handleCreate = async () => {
        await createOrder({ name: 'test' });
        fetchList(); // 刷新列表
    };

    onMounted(fetchList);
</script>
```

**3. HTTP 请求选项 (`RequestOptions`)：**

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `withToken` | `boolean` | `true` | 是否携带 Token |
| `isShowMessage` | `boolean` | `true` | 是否自动显示消息 |
| `isShowSuccessMessage` | `boolean` | `false` | 成功时弹 Toast |
| `isShowErrorMessage` | `boolean` | `false` | 失败时弹 Toast |
| `successMessageText` | `string` | - | 自定义成功消息 |
| `isReturnNativeResponse` | `boolean` | `false` | 返回原始响应 |
| `isTransformResponse` | `boolean` | `true` | 返回预处理数据 |
| `joinTime` | `boolean` | `true` | GET 请求加时间戳防缓存 |

---

### 新增 Mock 数据

在 `mock/` 目录下按模块创建文件：

```ts
// mock/order/order.ts
import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError } from '../_util';

export default [
    {
        url: '/api/order/list',
        timeout: 500,
        method: 'get',
        response: ({ query }) => {
            return resultSuccess({
                list: [
                    { id: 1, name: '订单A', status: 'paid' },
                    { id: 2, name: '订单B', status: 'pending' },
                ],
                total: 2,
            });
        },
    },
    {
        url: '/api/order/create',
        timeout: 300,
        method: 'post',
        response: ({ body }) => {
            if (!body.name) return resultError('订单名称不能为空');
            return resultSuccess({ id: Date.now() });
        },
    },
] as MockMethod[];
```

> Mock 文件以 `_` 开头的会被忽略（如 `_util.ts`）。

---

### 使用图标

**UnoCSS 图标（推荐）：**

```html
<!-- 直接在模板中使用 -->
<i class="i-ph:heart-bold" />
<i class="i-mdi:home" />

<!-- 动态绑定 -->
<i :class="iconClass" />
```

图标浏览：[icones.js.org](https://icones.js.org/)

已安装的图标集：`ph`、`ic`、`mdi`、`carbon`、`tabler`、`bxs`、`mingcute`、`mage`、`iconamoon`

> **注意**：在 `.ts` 数据文件中使用的图标类名需要添加到 `uno.config.ts` 的 `safelist` 中。

**SVG 图标（自定义图标）：**

```html
<!-- 将 SVG 文件放入 src/assets/svgs/ -->
<SvgIcon name="logo" :size="32" color="#333" />
```

---

### 使用组件

全局组件通过 `unplugin-vue-components` 自动注册，无需手动 import：

```html
<!-- 导航栏 -->
<CNavBar title="自定义标题" />

<!-- 下拉刷新列表 -->
<CPullRefreshList :request="fetchList" :finished="noMore">
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
</CPullRefreshList>

<!-- SVG 图标 -->
<CSvgIcon name="logo" :size="24" />

<!-- Vant 组件（自动导入） -->
<van-button type="primary">按钮</van-button>
<van-cell title="标题" is-link />
```

---

### 状态管理

```ts
// 在组件中使用 Store
import { useUserStore } from '@/store/modules/user';
import { useThemeStore } from '@/store/modules/theme';

const userStore = useUserStore();
const themeStore = useThemeStore();

// 读取（响应式）
const nickname = computed(() => userStore.getUserInfo.nickname);
const isDark = computed(() => themeStore.getThemeMode === 'dark');

// 修改
themeStore.setThemeMode('dark');
userStore.setToken('xxx');
```

新建 Store 模块：

```ts
// src/store/modules/order.ts
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useOrderStore = defineStore('app-order-store', {
    state: () => ({ list: [] }),
    getters: { getList: state => state.list },
    actions: {
        setList(list) { this.list = list; },
    },
    persist: { key: 'ORDER-DATA' },  // 可选：持久化
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot));
}
```

---

## 构建与部署

```bash
pnpm build:prod       # 生产构建（类型检查 + Gzip）
pnpm preview:dist     # 预览构建产物
```

构建产出目录为 `dist/`，支持 Gzip 压缩。部署到 Nginx 示例：

```nginx
server {
    listen 80;
    root /path/to/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 开启 Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_static on;
}
```

---

## 环境变量

配置文件：`.env.development` / `.env.test` / `.env.production`

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_GLOB_APP_TITLE` | 应用名称 | `Robot H5` |
| `VITE_PORT` | 开发端口 | `8888` |
| `VITE_PUBLIC_PATH` | 公共路径 | `/` |
| `VITE_PROXY` | 代理配置 | `[["/api","http://host"]]` |
| `VITE_GLOB_API_URL` | API 地址 | `http://api.example.com` |
| `VITE_GLOB_API_URL_PREFIX` | 接口前缀 | `/api` |
| `VITE_USE_MOCK` | 启用 Mock | `true` |
| `VITE_HASH_ROUTE` | Hash 路由 | `false` |
| `VITE_BUILD_COMPRESS` | 压缩方式 | `gzip` / `brotli` / `none` |

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build:prod` | 生产构建 |
| `pnpm preview` | 构建 + 预览 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查并自动修复 |
| `pnpm cz` | 交互式规范提交（Commitizen） |
| `pnpm clean` | 清理 node_modules + dist |
| `pnpm deps:check` | 检查依赖更新 |

---

## 提交规范

本项目基于 [`@robot-admin/git-standards`](https://www.npmjs.com/package/@robot-admin/git-standards) 统一管理 Git 工程化标准，采用 **标准模式**（Commitizen + Commitlint + Husky + ESLint + lint-staged + EditorConfig）。

### 提交方式

```bash
# 交互式规范提交（推荐）
pnpm cz

# 全局安装 commitizen 后也可使用
git cz
```

### 提交类型

| 类型 | 说明 |
|------|------|
| `feat` | 🎯 新功能 |
| `fix` | 🐛 Bug 修复 |
| `perf` | ⚡️ 性能优化 |
| `refactor` | ♻️ 重构 |
| `docs` | 📚 文档变更 |
| `style` | 💄 代码样式 |
| `build` | 🧳 构建/打包 |
| `chore` | 🔧 其他杂项 |
| `deps` | 📦 依赖更新 |
| `test` | 🔎 测试相关 |
| `revert` | 🔙 回退 |
| `wip` | 🚧 开发中 |

### Git Hooks

| Hook | 触发时机 | 作用 |
|------|----------|------|
| `pre-commit` | `git commit` 前 | lint-staged 增量检查暂存文件 |
| `commit-msg` | 提交信息写入后 | commitlint 校验提交格式 |

### 配置文件

所有配置文件由 `robot-standards init` 生成，独立完整，可直接修改：

| 文件 | 用途 |
|------|------|
| `.cz-config.cjs` | Commitizen 提交类型/模板配置 |
| `commitlint.config.cjs` | 提交信息校验规则 |
| `eslint.config.ts` | ESLint Flat Config |
| `.editorconfig` | 编辑器统一格式 |

---

## 架构决策与约定

| 约定 | 说明 |
|------|------|
| **样式提取** | `.vue` 不写 `<style>`，样式放 `index.scss` 用 `import` 引入 |
| **BEM 作用域** | 每个页面用唯一根类名隔离（如 `.mine-page`），不使用 `scoped` |
| **组件命名** | 全局组件 `C_` 前缀；页面子组件放 `components/` |
| **路由命名** | `name` 必须与组件 `defineOptions({ name })` 一致 |
| **自动导入** | Vue/Router/VueUse API 自动导入，无需手动 `import { ref }` |
| **Vant 按需** | 通过 `@vant/auto-import-resolver` 自动按需引入 |
| **图标方案** | 优先 UnoCSS preset-icons，自定义 SVG 放 `assets/svgs/` |
| **Token 鉴权** | 自动注入 Authorization 头，过期自动跳转登录 |
| **数据持久化** | Pinia store 带 `persist` 配置，生产环境 AES 加密 |

---

## 扩展与优化建议

### 短期优化

| 建议 | 说明 |
|------|------|
| **图片资源优化** | 引入 `vite-plugin-imagemin` 或使用 WebP 格式，减少首屏加载体积 |
| **路由懒加载预取** | 对高频页面使用 `<link rel="prefetch">` 或 Vite 的 `modulePreload` |
| **骨架屏** | 首页和列表页加入 Vant Skeleton 组件，提升感知速度 |
| **请求缓存** | 引入 `@tanstack/vue-query` 或 `useFetch` 实现 SWR 缓存策略 |
| **字体子集化** | 使用 `fonttools` 裁剪中文字体子集，减少字体文件体积 |

### 中期扩展

| 建议 | 说明 |
|------|------|
| **权限管理** | 路由层面 `meta.roles` + 指令层面 `v-permission` |
| **国际化 i18n** | 集成 `vue-i18n`，配合 locale 文件按需加载 |
| **单元测试** | 引入 `Vitest` + `@vue/test-utils`，为核心 hooks 和 utils 编写测试 |
| **E2E 测试** | 使用 `Playwright` 覆盖登录、表单提交等关键路径 |
| **PWA 支持** | 集成 `vite-plugin-pwa`，支持离线访问和桌面安装 |
| **错误监控** | 接入 Sentry 或自建上报，Vue errorHandler + unhandledrejection |

### 长期架构

| 建议 | 说明 |
|------|------|
| **微前端** | 使用 `qiankun` 或 `Module Federation` 拆分独立业务模块 |
| **CI/CD** | GitHub Actions / GitLab CI 自动化构建、测试、部署 |
| **性能监控** | 接入 Web Vitals (LCP/FID/CLS) 采集和告警 |
| **组件文档** | 使用 `Storybook` 或 `Histoire` 构建组件库文档 |

---

## License

**PROPRIETARY** — 本项目为内部私有项目，未经授权不得复制、分发或使用。

© Robot H5. All rights reserved.
