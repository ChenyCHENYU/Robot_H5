# Robot H5

> **Vue 3 + Vite 7 + TypeScript** 移动端 H5 应用框架
>
> 设计语言：Apple HIG Liquid Glass · 暗黑模式 · CSS Cascade Layers · 响应式 viewport 适配

---

## 目录

- [快速开始](#快速开始)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [开发全流程](#开发全流程从-0-到-1-完整闭环)
- [样式系统](#样式系统)
- [组件](#组件)
- [图标](#图标)
- [状态管理](#状态管理)
- [环境配置](#环境配置)
- [构建与部署](#构建与部署)
- [工程规范](#工程规范)
- [最佳实践](#最佳实践)

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
│       ├── build.ts            #   Rollup 输出
│       ├── proxy.ts            #   开发代理
│       └── plugin/             #   Vite 插件（按需启用）
│
├── mock/                       # Mock 数据（按模块分目录）
│
├── src/
│   ├── api/                    # 接口层（按模块分目录）
│   ├── components/             # 全局组件（C_ 前缀，自动注册）
│   ├── hooks/                  # 组合式函数
│   ├── layout/                 # 布局容器（TabBar）
│   ├── plugins/                # 插件注册入口
│   ├── router/                 # 路由（守卫 + 菜单 + 子页面）
│   │   ├── menu.ts            #   TabBar 主导航路由
│   │   └── modules.ts         #   子页面路由
│   ├── services/               # 原生桥接（JSBridge）
│   ├── store/                  # Pinia 状态管理
│   ├── styles/                 # 全局样式（Token + 动画）
│   │   └── variables.scss     #   设计令牌（--ds-xxx）
│   ├── utils/                  # 工具函数（http / directives / const）
│   └── views/                  # 页面视图（每页一个目录）
│
├── types/                      # 全局类型声明
├── .env.development            # 开发环境变量
├── .env.test                   # 测试环境变量
├── .env.production             # 生产环境变量
├── index.html                  # HTML 入口（@layer 声明）
├── DESIGN_SYSTEM.md            # 设计系统规范
├── vite.config.ts              # Vite 配置
└── uno.config.ts               # UnoCSS 配置
```

---

## 开发全流程：从 0 到 1 完整闭环

> 以新建一个「订单列表」页面为例，完整走通 **创建页面 → 注册路由 → 定义接口 → Mock 数据 → 页面调用 → 调试验证** 全流程。

### Step 1：创建页面（三文件结构）

每个页面是一个独立目录，包含三个文件：

```
src/views/order/
├── index.vue       # 模板 + 逻辑
├── index.scss      # 样式（不在 .vue 中写 <style>）
└── data.ts         # 静态配置数据（可选，v-for 驱动）
```

**index.vue**

```vue
<template>
    <div class="order-page">
        <!-- 导航栏 -->
        <CNavBar title="订单列表" />

        <!-- 下拉刷新 + 无限滚动列表 -->
        <CPullRefreshList
            :request="fetchOrderList"
            :finished="noMore"
        >
            <div
                v-for="item in orderList"
                :key="item.id"
                class="order-page__card"
            >
                <div class="order-page__card-title">{{ item.orderNo }}</div>
                <div class="order-page__card-desc">{{ item.createTime }}</div>
            </div>
        </CPullRefreshList>
    </div>
</template>

<script setup lang="ts">
import './index.scss';
import { getOrderList } from '@/api/system/order';

// ⚠️ name 必须与路由 name 完全一致（KeepAlive 依赖此值）
defineOptions({ name: 'Order' });

const orderList = ref<any[]>([]);
const noMore = ref(false);

async function fetchOrderList(page: number, pageSize: number) {
    const res = await getOrderList({ page, pageSize });
    orderList.value = page === 1
        ? res.data.list
        : [...orderList.value, ...res.data.list];
    noMore.value = orderList.value.length >= res.data.total;
}
</script>
```

> `ref`、`computed`、`watch` 等 Vue API 已全局自动导入，无需手动 `import`。

**index.scss**

```scss
.order-page {
    min-height: 100%;             // ⚠️ 必须 min-height，不能 height:100%
    background: var(--ds-bg);

    &__card {
        margin: 12px 16px;
        padding: 16px;
        background: var(--ds-glass-bg);
        backdrop-filter: blur(var(--ds-glass-blur));
        border: 1px solid var(--ds-glass-border);
        border-radius: var(--ds-radius-lg);
        box-shadow: var(--ds-glass-shadow);

        &-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--ds-text-primary);
        }

        &-desc {
            margin-top: 8px;
            font-size: 13px;
            color: var(--ds-text-secondary);
        }
    }
}
```

**data.ts（可选）**

当页面有重复结构（如设置菜单、表单字段列表），提取到 data.ts 用 `v-for` 驱动：

```ts
export interface MenuItem {
    key: string;
    label: string;
    icon: string;
}

export const menuItems: MenuItem[] = [
    { key: 'pending',   label: '待处理', icon: 'i-ph:clock-bold' },
    { key: 'completed', label: '已完成', icon: 'i-ph:check-circle-bold' },
    { key: 'cancelled', label: '已取消', icon: 'i-ph:x-circle-bold' },
];
```

> data.ts 中使用的 UnoCSS 图标类名必须加入 `uno.config.ts` 的 `safelist`。

---

### Step 2：注册路由

**子页面**（从其他页面跳转进入）→ `src/router/modules.ts`：

```ts
{
    path: '/order',
    name: 'Order',                  // ⚠️ 必须与 defineOptions({ name }) 一致
    meta: {
        title: '订单列表',
        keepAlive: false,           // true = 返回时保留滚动位置和数据
    },
    component: () => import('@/views/order/index.vue'),
},
```

**TabBar 主导航页**（底部标签栏）→ `src/router/menu.ts`：

```ts
{
    path: '/order',
    name: 'Order',
    meta: {
        title: '订单',
        icon: 'ph:shopping-bag-bold',    // Phosphor 图标名
        keepAlive: true,
    },
    component: () => import('@/views/order/index.vue'),
},
```

> **keepAlive 规则**：`keepAlive: true` 的页面会被 `<keep-alive>` 缓存。组件 `name` 必须与路由 `name` **完全一致**，否则缓存静默失效。

---

### Step 3：定义接口

`src/api/system/order.ts`：

```ts
import { get, post, del, toast } from '@/utils/http';

/** 获取订单列表 */
export const getOrderList = (params?: object) => get('/order/list', params);

/** 创建订单（成功后自动弹 Toast） */
export const createOrder = (data: object) => post('/order/create', data, toast('创建成功'));

/** 删除订单 */
export const deleteOrder = (id: string) => del(`/order/delete/${id}`);
```

**快捷方法一览：**

| 方法 | 用途 | 示例 |
|------|------|------|
| `get<T>(url, params?, options?)` | GET 请求 | `get('/list', { page: 1 })` |
| `post<T>(url, data?, options?)` | POST 请求 | `post('/create', formData)` |
| `put<T>(url, data?, options?)` | PUT 请求 | `put('/update', formData)` |
| `del<T>(url, params?, options?)` | DELETE 请求 | `del('/remove/1')` |
| `toast(msg)` | 成功 Toast 选项 | `post('/save', data, toast('保存成功'))` |
| `ApiRes<T>` | 通用响应类型 | `import { ApiRes } from '@/utils/http'` |

> 泛型 `T` 默认 `any`，不关心返回类型时可省略。需要类型时：`get<UserInfo>('/info')`。

**进阶：直接使用 `http.request()`**

当快捷方法不满足需求时（如 FormData 上传、自定义 Content-Type），可直接调用底层：

```ts
import { http } from '@/utils/http';

export const uploadFile = (data: FormData) =>
    http.request({ url: '/upload', method: 'POST', data }, { withToken: true });
```

**HTTP 请求选项（RequestOptions）：**

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `withToken` | `true` | 自动携带 Authorization |
| `isShowSuccessMessage` | `false` | 成功时弹 Toast |
| `isShowErrorMessage` | `false` | 失败时弹 Toast |
| `successMessageText` | — | 自定义成功消息（推荐用 `toast()` 替代） |
| `isReturnNativeResponse` | `false` | 返回原始 AxiosResponse |
| `joinTime` | `true` | GET 请求加时间戳防缓存 |
| `joinPrefix` | `true` | 拼接 VITE_GLOB_API_URL_PREFIX |
| `isTransformResponse` | `true` | 是否解包 data 层 |

> HTTP 层自动处理：401 跳转登录、重试 2 次（间隔 1s）、GET 防缓存时间戳。

---

### Step 4：编写 Mock 数据

`mock/order/order.ts`：

```ts
import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError } from '../_util';

const orderList = Array.from({ length: 30 }, (_, i) => ({
    id: `${i + 1}`,
    orderNo: `ORD-2024-${String(i + 1).padStart(4, '0')}`,
    createTime: '2024-01-15 14:30:00',
    status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'completed' : 'cancelled',
    amount: (Math.random() * 1000).toFixed(2),
}));

export default [
    {
        url: '/api/order/list',
        method: 'get',
        response: ({ query }: any) => {
            const page = Number(query.page) || 1;
            const pageSize = Number(query.pageSize) || 10;
            const start = (page - 1) * pageSize;
            return resultSuccess({
                list: orderList.slice(start, start + pageSize),
                total: orderList.length,
            });
        },
    },
    {
        url: '/api/order/create',
        method: 'post',
        response: () => resultSuccess(null),
    },
] as MockMethod[];
```

> Mock 文件名以 `_` 开头会被忽略（用于工具文件，如 `_util.ts`）。

---

### Step 5：页面中调用接口

在 `index.vue` 的 `<script setup>` 中直接调用 Step 3 定义的函数。数据流：

```
页面调用 getOrderList()
    ↓
http.request 自动拼接 prefix + token + timestamp
    ↓
开发环境 → vite-plugin-mock 拦截 → 返回 Mock 数据
生产环境 → VITE_PROXY 代理 / 直连 API → 返回真实数据
```

---

### Step 6：调试与验证

```bash
# 启动开发服务
pnpm dev

# 浏览器访问
http://localhost:8888/robot-h5/site-h5/#/order
```

**调试清单：**

- [ ] 页面渲染正常，导航栏标题显示正确
- [ ] 列表数据加载，下拉刷新 / 上拉加载正常
- [ ] 接口请求在 Network 面板可见（开发环境走 Mock）
- [ ] 切换暗黑模式（个人中心 → 主题设置），卡片样式正确切换
- [ ] 返回上级页面，若设置 keepAlive，数据和滚动位置保留

---

## 样式系统

### 设计令牌（Design Tokens）

所有颜色、圆角、阴影通过 CSS 变量引用，**禁止硬编码**。完整令牌表见 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)。

```scss
// ✅ 正确
color: var(--ds-text-primary);
background: var(--ds-glass-bg);
border-radius: var(--ds-radius-lg);

// ❌ 错误
color: #1d1d1f;
background: rgba(255, 255, 255, 0.52);
border-radius: 16px;
```

**常用令牌速查：**

| 令牌 | 亮色值 | 用途 |
|------|--------|------|
| `--ds-bg` | #ffffff | 页面背景 |
| `--ds-bg-secondary` | #f5f5f7 | 卡片/输入框背景 |
| `--ds-surface` | #ffffff | 浮层背景 |
| `--ds-text-primary` | #1d1d1f | 标题、正文 |
| `--ds-text-secondary` | #6e6e73 | 描述、标签 |
| `--ds-text-tertiary` | #aeaeb2 | 占位符、注释 |
| `--ds-accent` | #0071e3 | 主操作（Apple 蓝） |
| `--ds-success / warning / danger` | 绿/橙/红 | 语义色 |
| `--ds-glass-bg` | rgba(255,255,255,0.52) | 毛玻璃背景 |
| `--ds-glass-blur` | 40px | 毛玻璃模糊值 |
| `--ds-glass-border` | rgba(255,255,255,0.82) | 毛玻璃边框 |
| `--ds-radius-sm/md/lg/xl` | 8/12/16/20px | 圆角 |

### CSS @layer 优先级体系

```
@layer base         ← UnoCSS preflight（reset），最低
@layer components   ← 组件 SCSS（vite.config.ts 自动包裹），中
@layer utilities    ← UnoCSS 工具类（flex / mb-4），最高
```

层顺序在 `index.html` 中声明：`<style>@layer base, components, utilities;</style>`

| 配置文件 | 作用 |
|----------|------|
| `index.html` | 声明 @layer 顺序 |
| `uno.config.ts` | `outputToCssLayers`：preflight → base，工具类 → utilities |
| `vite.config.ts` | `additionalData`：src/ 下 SCSS 自动包进 @layer components |

### BEM 命名约定

```scss
.order-page {              // Block = 页面唯一根类名
    &__card { ... }        // Element
    &__card--active { ... } // Modifier
}
```

> 不使用 `scoped`，每个页面通过唯一根类名实现样式隔离。

---

## 组件

通过 `unplugin-vue-components` 自动注册，**无需手动 import**：

| 组件 | 用途 | 示例 |
|------|------|------|
| `<CNavBar>` | 导航栏 | `<CNavBar title="标题" />` |
| `<CIcon>` | UnoCSS 图标 | `<CIcon name="ph:heart-bold" :size="20" />` |
| `<CSvgIcon>` | 自定义 SVG | `<CSvgIcon name="logo" :size="24" />` |
| `<CPullRefreshList>` | 下拉刷新 + 无限滚动 | `<CPullRefreshList :request="fn" />` |
| `<CWebSite>` | WebView 容器 | `<CWebSite />` |
| `<CVirtualStatusBar>` | 虚拟状态栏（桌面模拟） | 自动注入 |

> 全局组件以 `C_` 开头命名（`src/components/C_xxx/`），Vant 组件也自动导入。

---

## 图标

### UnoCSS 图标（推荐）

```html
<!-- 静态使用 -->
<i class="i-ph:heart-bold text-20px text-red" />

<!-- 动态绑定 -->
<i :class="item.icon" />
```

**已安装图标集**：`ph`、`ic`、`mdi`、`carbon`、`tabler`、`bxs`、`mingcute`、`mage`、`iconamoon`

> 搜索图标：[icones.js.org](https://icones.js.org/)

**重要**：`data.ts` 中动态引用的图标类名必须加入 `uno.config.ts` 的 `safelist`，否则不会被提取生成。

### 自定义 SVG 图标

将 `.svg` 文件放入 `src/assets/svgs/`，然后：

```html
<CSvgIcon name="文件名（不含后缀）" :size="24" />
```

---

## 状态管理

```ts
// 使用已有 Store
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const nickname = computed(() => userStore.getUserInfo.nickname);
```

### 新建 Store

```ts
// src/store/modules/order.ts
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useOrderStore = defineStore('app-order-store', {
    state: () => ({
        list: [] as any[],
    }),
    actions: {
        setList(list: any[]) { this.list = list; },
    },
    persist: { key: 'ORDER-DATA' },        // 自动持久化
});

// HMR 热更新支持
if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot));
```

> 持久化策略：开发环境 JSON 明文存储，生产环境 AES 加密。

---

## 环境配置

项目通过三个 `.env` 文件管理不同环境：

| 文件 | 环境 | Mock | 代理 | 用途 |
|------|------|------|------|------|
| `.env.development` | 开发 | ✅ 开启 | ✅ localhost:8001 | 本地开发调试 |
| `.env.test` | 测试 | ❌ 关闭 | ❌ 直连测试服 | 测试环境构建 |
| `.env.production` | 生产 | ❌ 关闭 | ❌ 直连生产服 | 正式上线构建 |

### 关键变量说明

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_ENV` | 环境标识 | `development` / `test` / `production` |
| `VITE_GLOB_APP_TITLE` | 应用名称 | `CHENY` |
| `VITE_PORT` | 开发端口 | `8888` |
| `VITE_PUBLIC_PATH` | 部署路径 | `/robot-h5/site-h5/` |
| `VITE_USE_MOCK` | Mock 开关 | `true` / `false` |
| `VITE_PROXY` | 开发代理 | `[["/appApi","http://host"]]` |
| `VITE_GLOB_API_URL` | 接口 Base URL | 生产环境填写真实地址 |
| `VITE_GLOB_API_URL_PREFIX` | 接口前缀 | `/api` |
| `VITE_HASH_ROUTE` | Hash 路由模式 | `false` |
| `VITE_BUILD_COMPRESS` | 构建压缩 | `gzip` / `brotli` / `none` |

### 环境安全规则

- **生产环境必须关闭 Mock**（`VITE_USE_MOCK = false`）— 否则 Mock 数据会打包进产物
- **生产环境不配置 VITE_PROXY** — 代理仅用于开发，生产由 Nginx 转发
- **VITE_GLOB_API_URL 生产环境必须填写** — 空值会导致接口请求失败

---

## 构建与部署

```bash
# 开发
pnpm dev                    # 开发服务器（Mock + HMR）

# 测试环境构建（含 Mock）
pnpm build:test

# 生产环境构建（无 Mock、类型检查、Gzip 压缩）
pnpm build:prod

# 预览构建产物
pnpm preview:dist
```

### Nginx 部署

```nginx
server {
    listen 80;
    root /path/to/dist;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_static on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

---

## 工程规范

### 提交规范

```bash
pnpm cz   # 交互式规范提交（推荐）
```

基于 [`@robot-admin/git-standards`](https://www.npmjs.com/package/@robot-admin/git-standards)。

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `perf` | 性能优化 |
| `refactor` | 重构（不改功能） |
| `docs` | 文档变更 |
| `style` | 代码格式（不改逻辑） |
| `build` | 构建/打包 |
| `chore` | 其他杂项 |

**Git Hooks**：`pre-commit` 运行 lint-staged，`commit-msg` 校验提交格式。

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build:prod` | 生产构建 |
| `pnpm build:test` | 测试构建 |
| `pnpm preview:dist` | 预览构建产物 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查 + 自动修复 |
| `pnpm cz` | 交互式规范提交 |
| `pnpm clean` | 清理 node_modules + dist |
| `pnpm deps:check` | 检查依赖更新 |

---

## 最佳实践

### 页面结构

| 规则 | 说明 |
|------|------|
| 三文件结构 | `index.vue` + `index.scss` + `data.ts`（可选） |
| 样式外置 | `.vue` 不写 `<style>`，样式放 `index.scss`，通过 `import './index.scss'` 引入 |
| 最小高度 | 页面根类用 `min-height: 100%`，不用 `height: 100%`（避免内容截断） |
| BEM 隔离 | 页面使用唯一根类名（如 `.order-page`），不使用 `scoped` |
| 数据驱动 | 重复列表/表单字段提取到 `data.ts`，用 `v-for` 渲染 |

### 样式规范

| 规则 | 说明 |
|------|------|
| 使用 Token | 所有颜色、圆角、阴影用 `var(--ds-xxx)`，禁止硬编码 |
| 毛玻璃卡片 | 用 `--ds-glass-*` 系列变量，效果自动适配暗黑模式 |
| Vant 样式覆盖 | 在 `index.scss` 中用 `.page-name .van-xxx` 覆盖，不用 `:deep()` |
| 响应式单位 | 直接写 `px`，postcss-mobile-forever 自动转 vw/vh（基准 375px） |

### 路由与缓存

| 规则 | 说明 |
|------|------|
| name 一致性 | 路由 `name` = `defineOptions({ name })` = `<keep-alive :include="...">` |
| keepAlive | 列表页建议 `keepAlive: true`（保留滚动位置），详情页用 `false` |
| 子页面路由 | 注册在 `modules.ts`，TabBar 页注册在 `menu.ts` |

### 接口规范

| 规则 | 说明 |
|------|------|
| 一个模块一个文件 | `src/api/system/xxx.ts`，按业务模块组织 |
| 快捷方法优先 | `import { get, post, toast } from '@/utils/http'` |
| 类型按需 | 不关心返回类型就不写泛型，需要时 `get<UserInfo>(...)` |
| 成功提示 | 用 `toast('消息')` 替代手写 `{ isShowSuccessMessage: true, ... }` |
| Mock 对应 | 每个 API 必须有对应 Mock 文件，接口 URL 一致（含 `/api` 前缀） |

### 自动导入

| 范围 | 说明 |
|------|------|
| Vue API | `ref`、`computed`、`watch`、`onMounted` 等自动可用 |
| Vue Router | `useRouter`、`useRoute` 自动可用 |
| VueUse | `useStorage`、`useDark` 等自动可用 |
| Vant 组件 | `<van-button>`、`<van-field>` 等自动注册 |
| 全局组件 | `<CNavBar>`、`<CIcon>` 等自动注册 |

---

**PROPRIETARY** — 内部私有项目。© Robot H5. All rights reserved.
