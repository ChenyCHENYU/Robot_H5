# Robot H5

> **Vue 3 + Vite 7 + TypeScript** 移动端 H5 应用框架
>
> 设计语言：Apple HIG Liquid Glass · 暗黑模式 · PDA 旧 WebView 兼容 · 响应式 viewport 适配

---

## 目录

- [快速开始](#快速开始)
- [作为项目模板使用](#作为项目模板使用)
- [五大模块](#五大模块)
- [技术栈](#技术栈)
- [服务架构](#服务架构)
- [权限体系](#权限体系)
- [目录结构](#目录结构)
- [开发全流程](#开发全流程从-0-到-1-完整闭环)
- [样式系统](#样式系统)
- [组件](#组件)
- [图标](#图标)
- [状态管理](#状态管理)
- [环境配置](#环境配置)
- [构建与部署](#构建与部署)
- [构建环境专项文档](#构建环境专项文档)
- [工程规范](#工程规范)
- [最佳实践](#最佳实践)
- [@robot-h5/core 通用能力包](#robot-h5core-通用能力包)
- [附录：mbase 集成指南](#附录mbase-集成指南)
- [PDA 兼容与 mbase 专项文档](#pda-兼容与-mbase-专项文档)

---

## 快速开始

```bash
# 环境要求
node 22.12+ 或 Node 24
pnpm >= 11.8.0

# 安装依赖
pnpm install

# 启动开发服务（含 Mock）
pnpm dev

# 构建（自动跟随 dev/sit/uat/pre/main/prd 分支）
pnpm build
```

**默认账号**：`admin` / `123456`

---

## 作为项目模板使用

推荐通过 JH4J Cloud 脚手架创建，脚手架会依次尝试 GitHub 和 Gitee 模板源：

```bash
pnpm dlx @agile-team/jh4j-cloud-cli@latest create my-mobile-app \
  --category mobile \
  --template mobile.robot-h5
```

也可以直接 clone 后初始化，两种方式共用同一套模板参数和初始化脚本：

```bash
git clone https://github.com/ChenyCHENYU/Robot_H5.git my-mobile-app
cd my-mobile-app
pnpm setup
pnpm install
pnpm dev
```

初始化时可确认项目名称、应用标题、开发端口、本地 API 地址、npm registry，以及是否启用完整 Git 与代码质量规范。

模板从 `v1.7.0` 起默认内置 PDA 兼容构建、wl-mbase 宿主识别、各宿主单头部与动态标题，并为 App/PDA 提供双向返回导航；`v1.7.1` 起桥接传输统一由 `@robot-h5/core` 维护，`v1.8.0` 起内置公司上下文数据闭环。当前构建体系进一步统一了纯 H5 多环境入口和独立 `env.json` 产物身份证。新项目无需复制业务项目的适配代码。

---

## 五大模块

底部 TabBar 提供 **5 大功能模块**，覆盖开发全流程：

| Tab | 模块 | 说明 |
|-----|------|------|
| 🏠 首页 | Dashboard | 问候语 + 快捷入口 + 每日金句 + 核心能力卡片 |
| 📦 组件 | 组件中心 | 16 个交互示例 + 开发工具（暗黑模式 / Eruda） |
| 📋 模板 | 模板中心 | 10 大业务领域模板入口（CRM / 工单 / 审批等） |
| ⚡ 能力 | 能力中心 | 15 个 @robot-h5/core 设备能力 Hook 可交互演示 |
| 👤 我的 | 个人中心 | 账号设置 / 主题外观 / 关于 / 退出登录 |

### 首页 Dashboard

- Mesh Gradient Hero 区域 + 时段问候 + 用户昵称
- Liquid Glass 统计卡片（组件 16 / 能力 15 / TypeScript 100%）
- 4 个快捷入口（组件 / 模板 / 能力 / 主题）
- 每日金句轮播（Apple / 乔布斯 / 黑客精神主题）
- 6 张核心能力卡片（Vite 7 / UnoCSS / TypeScript / Pinia / ECharts / Core Hooks）

### 组件中心（16 个示例）

| 示例 | 路由 | 亮点 |
|------|------|------|
| 主题设置 | `/themeSetting` | 暗黑/跟随系统、主题色、字体缩放、动画开关 |
| 状态缓存 | `/keepAliveDemo` | keep-alive 计数器 + 表单 + 生命周期日志 |
| 404 页面 | `/404` | Liquid Glass 毛玻璃动画 |
| 自定义指令 | `/directives` | v-long-press、v-ripple 等 |
| SVG 图标 | `/svgIcon` | 本地 SVG + Iconify 在线图标（点击复制） |
| UnoCSS 样式 | `/unoCss` | 原子 CSS 能力展示 |
| 滚动位置缓存 | `/scrollCache` | 返回页面自动恢复滚动位置 |
| 下拉刷新列表 | `/pullRefreshList` | CPullRefreshList 组件封装 |
| 渲染性能优化 | `/requestAnimationFrame` | rAF 动画帧对比 |
| 弹出层组合 | `/popupDemo` | ActionSheet / Popup 5 方位 / Dialog |
| 手势交互 | `/gestureDemo` | SwipeCell 删除、长按菜单、多按钮滑动 |
| 骨架屏 | `/skeletonDemo` | 基础骨架、商品卡片、联系人列表 |
| 表单验证 | `/formDemo` | C_Form 异步校验、动态规则、多步骤表单 |
| 表格组件 | `/tableDemo` | C_Table 虚拟滚动、排序、多选 |
| 客户档案 | `/customerArchive` | 完整 CRUD 业务模板 |
| ECharts 图表 | `/chart` | 折线/饼图/仪表盘可视化 |

### 能力中心（15 个 Hook 演示）

按 5 大分类展示 `@robot-h5/core` 全部设备能力，每个 Hook 提供可交互的 Playground：

| 分类 | Hooks | 说明 |
|------|-------|------|
| 📸 影像采集 | useCamera · useVideoRecorder · useAudioRecorder | 拍照/录像/录音 + 实时预览 |
| 📍 定位扫描 | useLocation · useQrScanner · useNfc | GPS 定位 + 二维码 + NFC |
| 📁 文件处理 | useFileUpload · useFileDownload · useFilePreview | 分片上传 + 下载 + 预览 |
| ⚙️ 系统能力 | useBluetooth · useOfflineStorage · usePushNotification · usePermission | 蓝牙 / 离线 / 推送 / 权限 |
| ✨ 创意工具 | useSignature · useWatermark | 手写签名 + 图片水印 |

### 模板中心（10 大领域）

| 领域 | 代码 | 说明 |
|------|------|------|
| 客户管理 | CRM | 客户档案 / 跟进记录 / 商机 |
| 设备巡检 | INSPECT | 巡检计划 / 故障报修 / 备件 |
| 物流配送 | LOGISTICS | 运单 / 签收 / 轨迹 |
| 合同管理 | CONTRACT | 合同模板 / 审批流 / 归档 |
| 安全管理 | SAFETY | 隐患排查 / 应急预案 |
| 能源管理 | ENERGY | 能耗监控 / 碳排放 |
| 视频监控 | VIDEO | 实时流 / 回放 / AI 告警 |
| 质量管理 | QUALITY | 质检记录 / 不良追溯 |
| 营销活动 | MARKETING | 活动管理 / 优惠券 / 推送 |
| 运维管理 | OPS | 工单系统 / 值班排班 |

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
| 工程规范 | @robot-admin/git-standards | 1.0 |

---

## 服务架构

### 整体拓扑

```
    ┌──────────────────────┐
    │   Nginx / 外网网关    │
    └──────────┬───────────┘
               │
    ┌──────────▼───────────┐
    │   后端网关             │
    │   172.28.99.172:9000  │
    │                       │
    │  · 登录鉴权            │
    │  · 菜单权限            │
    │  · 客户/订单/工单 CRUD │
    │  · 文件上传            │
    └───────────────────────┘
               ▲
               │  /api/*
    ┌──────────┴───────────┐
    │   Robot H5 移动端     │
    │                       │
    │  所有请求统一走网关    │
    │  前端只配一个地址      │
    └───────────────────────┘
```

### 核心设计原则

| 原则 | 说明 |
|------|------|
| **单一网关** | 前端只对接一个后端地址，网关内部路由到各微服务 |
| **Token 统一** | 登录后获取 Token，所有后续请求自动携带 |
| **服务复用** | 后端网关复用 PC 端已有微服务，不重复开发 |
| **本地路由** | 所有页面组件本地打包，后端仅返回权限菜单树用于过滤可见性 |

### HTTP 调用

统一使用 `get / post / put / del` 快捷方法，所有请求走同一个网关：

```ts
import { get, post, toast } from '@/utils/http';

// 登录
export const login = (data: object) => post('/login', data, toast('登录成功'));

// 业务接口
export const getOrderList = (params?: object) => get('/order/list', params);

// 权限接口
export const getAppMenus = (appId: string) => get('/system/menu/getRouters', { appId });
```

---

## 权限体系

### 权限模型

```
┌──────────────────────────────────────────────────────┐
│                     PC 端管理系统                      │
│                                                      │
│  应用管理 → 创建应用「robot-h5」→ 绑定菜单和权限       │
│                                                      │
│  菜单树（menuType）：                                  │
│  ├── D（目录）— TabBar 容器                           │
│  │   ├── M（菜单）— 首页 /dashboard                   │
│  │   ├── M（菜单）— 订单 /order                       │
│  │   │   ├── B（按钮）— order:add                    │
│  │   │   ├── B（按钮）— order:edit                   │
│  │   │   └── B（按钮）— order:delete                 │
│  │   └── M（菜单）— 我的 /mine                        │
│  └── ...                                             │
└──────────────────────────────────────────────────────┘
          │
          │ API：/system/menu/getRouters?appId=robot-h5
          ▼
┌──────────────────────────────────────────────────────┐
│                   Robot H5 移动端                      │
│                                                      │
│  permissionStore.loadPermissions()                    │
│  ├── 解析菜单树 → allowedPaths = ['/dashboard', ...]  │
│  ├── 提取按钮码 → buttonPermissions = ['order:add',..]│
│  └── 提取 TabBar → tabBarMenus (visible + M 类型)    │
│                                                      │
│  路由守卫：to.path ∈ allowedPaths ? next() : → 首页   │
│  TabBar：动态渲染 tabBarMenus（替代硬编码菜单）         │
│  按钮：v-permission="'order:add'" 控制显隐            │
└──────────────────────────────────────────────────────┘
```

### 权限流程（时序）

```
用户打开 H5
    │
    ├── 无 Token → 重定向登录页
    │       │
    │       └── 输入账号密码 → post('/login') → 获取 Token
    │               │
    │               ├── userStore.GetUserInfo()
    │               └── permissionStore.loadPermissions()
    │                       │
    │                       ├── getAppMenus('robot-h5')  → 菜单树
    │                       └── getUserPermissions('robot-h5') → 按钮权限码
    │
    ├── 有 Token + 权限未加载 → 路由守卫自动触发 loadPermissions()
    │
    └── 有 Token + 权限已加载 → 校验 to.path → 放行 / 拦截
```

### 菜单级权限（路由过滤）

路由守卫 `router-guards.ts` 在每次导航时检查目标路径是否在用户权限范围内：

```ts
// 白名单页面直接放行（登录页）
// 系统页面无需权限（个人设置、主题、关于）
// 业务页面校验 permissionStore.isRouteAllowed(to.path)
```

**降级策略**：权限数据为空时（Mock 模式、权限接口未对接），所有路由**默认放行**，不会白屏。

### 按钮级权限

#### 方式一：`v-permission` 指令（推荐）

无权限时**移除 DOM 元素**，适合简单显隐场景：

```html
<!-- 单个权限码 -->
<van-button v-permission="'order:add'">新增订单</van-button>

<!-- 任一权限满足即显示 -->
<van-button v-permission="['order:edit', 'order:admin']">编辑</van-button>
```

#### 方式二：`usePermission()` Hook

适合需要在逻辑中判断权限的复杂场景：

```ts
import { usePermission } from '@/hooks/usePermission';

const { hasPermission, hasAnyPermission } = usePermission();

// 条件渲染
const canAdd = hasPermission('order:add');

// data.ts 中的操作按钮条件显示
export const OPERATIONS = [
    { text: '编辑', show: () => hasPermission('order:edit') },
    { text: '删除', type: 'danger', show: () => hasPermission('order:delete') },
];
```

### 权限相关文件

| 文件 | 职责 |
|------|------|
| `types/Permission/type.ts` | `ApiMenuItem` 菜单节点类型 |
| `src/api/permission.ts` | `getAppMenus()` / `getUserPermissions()` 接口 |
| `src/store/modules/permission.ts` | 权限状态管理（菜单树、按钮码、路径过滤） |
| `src/hooks/usePermission/index.ts` | `usePermission()` Hook + `v-permission` 指令 |
| `src/router/router-guards.ts` | 路由守卫（登录校验 + 权限校验） |
| `src/layout/index.vue` | TabBar 动态菜单渲染（权限优先、本地兜底） |
| `mock/permission.ts` | Mock 菜单树和权限码 |

### TabBar 动态渲染

Layout 组件 TabBar 的数据来源有**两个层级**：

```ts
// 优先使用权限接口返回的菜单（对接真实后端时生效）
const apiMenus = permissionStore.getTabBarMenus;

// 兜底：使用本地路由定义（Mock 模式 / 权限接口未对接时）
const localMenus = routeStore.menus[0]?.children || [];

const tabBarMenus = apiMenus.length > 0 ? apiMenus : localMenus;
```

> 这种**双层兜底设计**确保了：开发期间用 Mock 数据时 TabBar 正常显示，对接真实后端后自动切换为动态菜单，**零改动过渡**。

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
│   ├── permission.ts          #   权限菜单 Mock（5-Tab）
│   └── user/                  #   用户登录 Mock
│
├── src/
│   ├── api/                    # 接口层（按模块分目录）
│   │   ├── permission.ts     #   权限菜单接口
│   │   └── user.ts           #   用户登录接口
│   ├── components/             # 全局组件（C_ 前缀，自动注册）
│   ├── hooks/                  # 组合式函数
│   │   ├── useEnv/            #   环境配置
│   │   ├── usePermission/     #   权限校验 Hook + v-permission 指令
│   │   ├── useScrollCache/    #   滚动位置缓存
│   │   └── useTheme/          #   主题切换
│   ├── layout/                 # 布局容器（TabBar 动态渲染）
│   ├── plugins/                # 插件注册入口
│   ├── router/                 # 路由（守卫 + 菜单 + 子页面）
│   │   ├── menu.ts            #   TabBar 主导航（5 Tab）
│   │   └── modules.ts         #   子页面路由（~40 条）
│   ├── platform/mbase/         # 基座宿主、导航协议与扩展能力桥
│   ├── store/                  # Pinia 状态管理
│   │   └── modules/
│   │       ├── permission.ts  #   权限状态（菜单树 + 按钮码）
│   │       ├── route.ts       #   路由状态（菜单 + keepAlive）
│   │       └── user.ts        #   用户状态（Token + 登录）
│   ├── styles/                 # 全局样式（Token + 动画）
│   │   └── variables.scss     #   设计令牌（--ds-xxx）
│   ├── utils/                  # 工具函数（http / directives / const）
│   │   └── http/
│   │       └── index.ts       #   HTTP 封装（get/post/put/del）
│   ├── h5.config.ts            # @robot-h5/core 配置文件
│   └── views/                  # 页面视图（每页一个目录）
│       ├── dashboard/          #   首页（Hero + Quick Actions + Features）
│       ├── demo/               #   组件中心（17 个交互示例入口）
│       │   ├── chart/         #     ECharts 图表
│       │   ├── c-form/        #     表单组件
│       │   ├── c-table/       #     表格组件
│       │   ├── customer-archive/ #  客户档案 CRUD 模板
│       │   └── ...            #     更多 demo 子页面
│       ├── hooks/              #   能力中心（15 个 Hook 演示）
│       │   ├── camera/        #     useCamera 演示
│       │   ├── location/      #     useLocation 演示
│       │   ├── signature/     #     useSignature 演示
│       │   ├── _shared.scss   #     共享演示页样式
│       │   └── ...            #     更多 hook 子页面
│       ├── template/           #   模板中心（10 领域入口）
│       ├── mine/               #   个人中心
│       └── login/              #   登录页
│
├── types/                      # 全局类型声明
│   ├── Permission/type.ts     #   权限菜单类型（ApiMenuItem）
│   ├── Form/type.ts           #   C_Form 组件类型
│   ├── Table/type.ts          #   C_Table 组件类型
│   ├── index.d.ts             #   通用工具类型
│   ├── global.d.ts            #   全局声明
│   └── ...                    #   config / modules / auto-import
├── .env.development            # 开发环境变量
├── .env.sit                    # SIT 子应用环境变量
├── .env.uat                    # UAT 子应用环境变量
├── .env.pre                    # PRE 子应用环境变量
├── .env.production             # 生产环境变量
├── build/environments.json     # 环境别名、Vite mode 与分支映射唯一来源
├── project.config.json         # 初始化时各环境网关与 API 前缀默认值
├── scripts/build.mjs           # 纯 H5 统一构建入口
├── index.html                  # HTML 入口（主题与首屏加载壳）
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
import { getOrderList } from '@/api/order';

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

`src/api/order.ts`：

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
http://localhost:8888/robot-h5/#/order
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

### PDA 兼容的样式优先级

模板不使用 CSS Cascade Layers：部分工业 PDA 的旧 WebView 不识别 `@layer`，会丢弃整个组件规则块。UnoCSS 使用 `#app` 选择器提升工具类优先级，组件 SCSS 继续按正常 CSS 顺序加载。

| 配置文件 | 作用 |
|----------|------|
| `index.html` | 主题和首屏加载壳；不静态注入 App 专属 SDK |
| `uno.config.ts` | `important: '#app'` 提升工具类优先级，不输出 `@layer` |
| `vite.config.ts` | 注入设计令牌，并按旧 WebView 目标补前缀和转换尺寸 |

App/PDA 所需的官方 `uni.webview` SDK 位于 `public/vendor/`，由业务域名自托管；Core 仅在识别到 `mbase_host=app` 且首次通信时动态插入。普通 H5、微信和钉钉 iframe 不下载、不执行，主 JS 也不含 SDK 源码。

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
| `<C_VirtualStatusBar>` | 虚拟状态栏（桌面模拟） | 自动注入 |

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

Robot_H5 只有 H5 一个构建目标。环境与分支映射集中在 `build/environments.json`，标准流水线在对应分支统一执行 `pnpm build`：

| 文件 | 环境 | Mock | 模式 | 用途 |
| --- | --- | --- | --- | --- |
| `.env.development` | 开发 | ✅ 开启 | standalone | 本地开发调试（Mock 数据） |
| `.env.sit` | SIT | ❌ 关闭 | integrated | SIT mbase 子应用 |
| `.env.uat` | UAT | ❌ 关闭 | integrated | UAT mbase 子应用 |
| `.env.pre` | PRE | ❌ 关闭 | integrated | PRE mbase 子应用 |
| `.env.production` | PRD | ❌ 关闭 | integrated | PRD mbase 子应用 |
| `.env.vercel` | 演示 | ✅ 开启 | standalone | Vercel 静态演示站 |

`.env.test` 和 `.env.integrated` 已退出：`test` 是 SIT 的旧名称，`integrated` 是运行模式而不是部署环境。SIT/UAT/PRE/PRD 现在分别拥有完整 mbase 配置，不再靠修改同一份 integrated 文件切环境。

`project.config.json` 是 `pnpm setup` 的环境地址来源。模板已提供标准网关和 `sit-api / uat-api / pre-api / prd-api` 前缀；创建具体子应用前应复核这些公开地址。Vercel 演示环境始终保持 standalone、Mock 和空后端地址，不继承本地 localhost。

### 标准与兼容构建命令

| 命令 | 环境 | 状态与说明 |
| --- | --- | --- |
| `pnpm dev` | development | 本地开发（Mock + HMR） |
| `pnpm dev:integrated` | SIT | 兼容入口，本地调试 SIT 集成模式 |
| `pnpm build` | 当前分支 | 新标准：自动映射 DEV/SIT/UAT/PRE/PRD |
| `pnpm build -- --env sit` | SIT | 本地显式复核；必须与标准环境分支一致 |
| `pnpm build:test` | SIT | 旧流水线兼容别名，仍可使用 |
| `pnpm build:uat` | UAT | 旧流水线兼容别名，仍可使用 |
| `pnpm build:prod` | PRD | 旧流水线兼容别名，仍可使用 |
| `pnpm build:integrated` | PRD | 旧集成构建兼容别名，仍可使用 |
| `pnpm build:vercel` | DEMO | Vercel 演示构建兼容入口 |

环境选择优先级为 `--env`、`DEPLOY_ENV`、Git 分支。显式环境与标准环境分支不一致时构建失败；生产只允许从 `main` 或 `prd` 发起。

### 关键变量说明

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `VITE_ENV` | 环境标识 | `development` / `sit` / `uat` / `pre` / `production` |
| `VITE_GLOB_APP_TITLE` | 应用名称 | `CHENY` |
| `VITE_PORT` | 开发端口 | `8888` |
| `VITE_PUBLIC_PATH` | 部署路径 | `/robot-h5/` |
| `VITE_USE_MOCK` | Mock 开关 | `true` / `false` |
| `VITE_PROXY` | 开发代理 | `[["/api","http://host"]]` |
| `VITE_GLOB_API_URL` | 后端网关 Base URL | 生产：`https://ytiop-prd.walsin.com.cn` |
| `VITE_GLOB_API_URL_PREFIX` | 接口前缀 | 按环境：`/sit-api` / `/uat-api` / `/pre-api` / `/prd-api` |
| `VITE_GLOB_APP_ID` | 移动端应用标识 | `robot-h5`（用于获取菜单权限） |
| `VITE_HASH_ROUTE` | Hash 路由模式 | `false` |
| `VITE_APP_MODE` | 应用运行模式 | `standalone` / `integrated` |
| — 集成身份与公司 | mbase 透传 URL 参数 | `portal_token` / `companyId` / `companyName` / `user_id` / `from`（固定，无需配置） |

### 双模式运行机制（standalone / integrated）

项目仍支持两种运行模式，但它们不再冒充“环境”：开发和演示使用 standalone，SIT/UAT/PRE/PRD 业务产物使用 integrated。

```
┌─────────────────────────────────────────────────────────────────┐
│                        VITE_APP_MODE                             │
├─────────────────────────────┬───────────────────────────────────┤
│ standalone（开发/演示）      │ integrated（标准线上环境）        │
├─────────────────────────────┼───────────────────────────────────┤
│  独立部署，自有登录页         │  作为 mbase 子应用嵌入            │
│  自身 Token 管理             │  从 mbase 获取 Token              │
│  独立域名 /robot-h5/        │  mbase 子路径 /mbase/robot-h5/   │
│  自有后端网关                │  共用 mbase 网关                  │
│  完整权限体系                │  权限由 mbase 统一管控            │
└─────────────────────────────┴───────────────────────────────────┘
```

**核心设计原则**：
- standalone 保留完整独立登录能力，开发和演示不依赖 mbase
- integrated 模式仅在路由守卫层做 Token 来源切换，不侵入业务代码
- 一次构建只固化一个环境和一种运行模式，不允许在浏览器中临时切换

### 代理配置

开发环境通过 Vite Proxy 代理后端网关：

```jsonc
// .env.development 中的 VITE_PROXY
[
    ["/api",    "http://172.28.99.172:9000/api"],   // 后端网关
    ["/upload", "http://172.28.99.172:9000/upload"]  // 文件上传
]
```

> Mock URL 使用 `/api/*` 前缀，与代理前缀一致。开发环境 Mock 中间件优先于 Proxy 拦截。

### 环境安全规则

- SIT/UAT/PRE/PRD 必须关闭 Mock，并使用 `integrated` 模式
- 线上 API 与 `VITE_MBASE_ORIGIN` 必须使用 HTTPS，门户 origin 必须精确到协议和域名且不带路径
- `VITE_PUBLIC_PATH` 必须以 `/` 开头和结尾，并与基座注册的子应用路径一致
- 构建必须通过统一入口；直接执行 `vite build` 会被阻断
- `dist/env.json` 只保存公开诊断信息，禁止加入 Token、密码或私钥

---

## 构建与部署

```bash
# 开发
pnpm dev                    # 开发服务器（Mock + HMR）
pnpm dev:integrated         # SIT 集成模式本地调试

# 标准流水线：根据分支自动选择环境并先执行类型检查
pnpm build

# 本地显式复核
pnpm build -- --env sit

# 预览构建产物
pnpm preview:dist
```

构建成功后，`dist/env.json` 会记录应用 ID、版本、环境、分支、Commit、构建时间、public path、API 和 mbase origin。它不会被业务首屏自动请求，也不能作为运行时切换环境的配置源。

### Nginx 部署

```nginx
server {
    listen 80;
    root /path/to/dist;

    # SPA 路由回退
    location /mbase/{应用缩写}/ {
        try_files $uri $uri/ /mbase/{应用缩写}/index.html;
    }

    # 静态资源长缓存
    location /mbase/{应用缩写}/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /mbase/{应用缩写}/env.json {
        add_header Cache-Control "no-cache";
    }

    # Gzip
    gzip on;
    gzip_static on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

### Vercel 部署

项目已通过 `vercel.json` 固定执行 `pnpm build:vercel`，推送到 `main` 分支后构建 standalone Mock 演示站，不会误用 PRD integrated 配置。

### 加载屏

`index.html` 内嵌了高级质感加载屏（Ambient Blob + Conic-gradient Logo + 品牌文字），确保首屏无白屏：

- 3 个模糊光晕 ambient orb 动画
- 锥形渐变旋转边框 Logo 容器
- 渐变品牌文字「ROBOT H5」+ 呼吸圆点
- Vue 挂载完成后 `requestAnimationFrame` 触发淡出 + 缩放 + 模糊退场动画

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
| `wip` | 开发中（不进 CHANGELOG） |
| `deps` | 依赖更新（不进 CHANGELOG） |
| `test` | 测试（不进 CHANGELOG） |

**Git Hooks**：`pre-commit` 运行 lint-staged，`commit-msg` 校验提交格式。

### 自动发版

推送到 `main` 分支后，GitHub Actions 自动根据提交类型升级版本号并更新 CHANGELOG：

| commit type | 版本变更 | 示例 |
|-------------|----------|------|
| `fix` | patch（0.0.x） | `1.0.0` → `1.0.1` |
| `feat` | minor（0.x.0） | `1.0.0` → `1.1.0` |
| `feat` + `BREAKING CHANGE` | major（x.0.0） | `1.0.0` → `2.0.0` |

> 基于 `release-please`，CI 配置见 `.github/workflows/release.yml`。

### 类型检查

```bash
pnpm type-check        # 运行 vue-tsc --noEmit，必须零错误
```

> 每次提交前必须通过类型检查。组件类型放 `types/{Name}/type.ts`，使用 `#/` 别名导入。

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（Mock + HMR） |
| `pnpm dev:prod` | 以生产模式启动 dev server |
| `pnpm dev:integrated` | 以 SIT 集成模式启动 dev server |
| `pnpm build` | 自动跟随标准环境分支构建 H5 |
| `pnpm build:sit` / `build:pre` | SIT/PRE 显式入口 |
| `pnpm build:test` | SIT 旧流水线兼容入口 |
| `pnpm build:uat` | UAT 旧流水线兼容入口 |
| `pnpm build:prod` | PRD 旧流水线兼容入口 |
| `pnpm build:integrated` | PRD integrated 旧兼容入口 |
| `pnpm build:vercel` | Vercel 演示站构建 |
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
| 类型外置 | 组件类型放 `types/{Name}/type.ts`（路径别名 `#/`），不在 `.vue` 中 export |
| data.ts 职责 | 类型定义 + 常量映射 + 静态数据 + mock 数据，用 v-for 消除硬编码 |
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
| 一个模块一个文件 | `src/api/{module}.ts`，扁平化按业务模块组织 |
| 快捷方法优先 | `import { get, post, toast } from '@/utils/http'` |
| 类型按需 | 不关心返回类型就不写泛型，需要时 `get<UserInfo>(...)` |
| 成功提示 | 用 `toast('消息')` 替代手写 `{ isShowSuccessMessage: true, ... }` |
| Mock 前缀 | Mock URL 统一用 `/api/*` 前缀 |

### 自动导入

| 范围 | 说明 |
|------|------|
| Vue API | `ref`、`computed`、`watch`、`onMounted` 等自动可用 |
| Vue Router | `useRouter`、`useRoute` 自动可用 |
| VueUse | `useStorage`、`useDark` 等自动可用 |
| Vant 组件 | `<van-button>`、`<van-field>` 等自动注册 |
| 全局组件 | `<CNavBar>`、`<CIcon>` 等自动注册 |

---

## @robot-h5/core 通用能力包

> **企业级移动端 H5 通用能力包** — 包做厚、项目做薄。业务项目只需「配置 + 引用」，即获完整能力。
>
> NPM 地址：[@robot-h5/core](https://www.npmjs.com/package/@robot-h5/core)

### 已集成

本项目已安装并配置好 `@robot-h5/core`：

- 安装：`pnpm add @robot-h5/core@^1.2.0`（已在 `package.json` 中）
- 配置文件：`src/h5.config.ts`
- 注册方式：`main.ts` 中 `app.use(h5Core, h5Config)` 一行完成

依赖更新采用“兼容版本范围 + 锁文件 + 自动更新 PR”：`^1.2.0` 允许升级到后续兼容的 `1.x` 版本，`pnpm-lock.yaml` 保证相同源码可重复构建；GitHub 每周检查新版本并提交可审查的更新。

### 配置文件

```ts
// src/h5.config.ts
import { defineH5Config } from '@robot-h5/core';
import { useUserStoreWidthOut } from '@/store/modules/user';

export default defineH5Config({
    bridge: {
        platform: 'auto',
        mbase: {
            origin: import.meta.env.VITE_MBASE_ORIGIN,
            appBridgeTimeoutMs: 6000,
            appSdkUrl: `${import.meta.env.BASE_URL}vendor/uni.webview.1.5.8.js`,
        },
    },
    upload: {
        action: '/api/file/upload',
        headers: (): Record<string, string> => {
            const userStore = useUserStoreWidthOut();
            const token = userStore.getToken;
            return token ? { Authorization: `Bearer ${token}` } : {};
        },
    },
    image: { maxSize: 1024, quality: 0.8 },
    location: { coordType: 'gcj02', timeout: 10000 },
});
```

### 功能清单

**15 个 Hooks（组合函数）：**

| Hook | 用途 |
|------|------|
| `useCamera` | 拍照/相册 + 自动压缩 |
| `useLocation` | GPS 单次/持续定位 |
| `useQrScanner` | 二维码/条形码扫描 |
| `useNfc` | NFC 读写 |
| `useFileUpload` | 分片上传 + 进度条 + 自动重试 |
| `useFileDownload` | 文件下载 + 流式进度 |
| `useFilePreview` | PDF/Office/图片预览 |
| `useSignature` | Canvas 手写签名 |
| `useAudioRecorder` | 录音 + 暂停恢复 |
| `useVideoRecorder` | 视频录制 + 实时预览 |
| `useBluetooth` | 蓝牙设备连接 |
| `useOfflineStorage` | IndexedDB 离线存储 |
| `usePushNotification` | 推送通知 |
| `useWatermark` | 多行图片水印、旧 WebView 降级与尺寸保护 |
| `usePermission` | 系统权限查询/请求/监听 |

**Utils 工具函数（纯函数，零依赖，tree-shaking 友好）：**

| 模块 | 函数 |
|------|------|
| `image` | `compressImage` · `fileToBase64` · `base64ToBlob` |
| `coord` | `gcj02ToWgs84` · `wgs84ToGcj02` |
| `device` | `getDeviceInfo` · `isAndroid` · `isIOS` |
| `file` | `getFileType` · `formatFileSize` |
| `validate` | `isPhone` · `isIdCard` · `isEmail` · `isCreditCode` |
| `format` | `formatDate` · `formatMoney` |
| `watermark` | `buildWatermarkFormData` · `normalizeServerWatermarkPolicy` |

**Bridge 适配器（多平台适配）：**

| 适配器 | 平台 | 说明 |
|--------|------|------|
| `BrowserBridge` | 浏览器 | 完整实现，Web 标准 API 降级 |
| `NativeBridge` | APP WebView | 通过 overrides 注入原生 SDK |
| `DingtalkBridge` | 钉钉 | 通过 overrides 注入 dingtalk-jsapi |
| `MbaseBridge` | wl-mbase | 钉钉 iframe 与 App/PDA 共用严格来源校验的能力协议 |
| `WechatBridge` | 微信/企微 | 通过 overrides 注入 weixin-js-sdk |

`src/platform/mbase/` 只保留模板路由导航和宿主样式策略；宿主检测、安全传输、超时、错误码、App SDK 与扩展能力调用全部由 Core 维护，避免每个子应用复制一份桥接实现。

### 使用示例

#### 拍照上传

```vue
<template>
    <van-button @click="capture">拍照</van-button>
    <img v-if="photo" :src="photo" />
</template>

<script setup lang="ts">
import { useCamera } from '@robot-h5/core';

const { photo, loading, capture } = useCamera();
</script>
```

#### GPS 定位

```vue
<script setup lang="ts">
import { useLocation } from '@robot-h5/core';

const { position, getCurrentPosition } = useLocation();

onMounted(() => {
    getCurrentPosition();
});
</script>
```

#### 文件上传（自动分片 + 进度）

```vue
<script setup lang="ts">
import { useFileUpload } from '@robot-h5/core';

const { upload, progress, uploading } = useFileUpload();

async function handleUpload(file: File) {
    const result = await upload(file);
    console.log('上传完成', result);
}
</script>
```

#### 手写签名

```vue
<script setup lang="ts">
import { useSignature } from '@robot-h5/core';

const { canvasRef, save, clear } = useSignature();
</script>

<template>
    <canvas ref="canvasRef" />
    <van-button @click="clear">清除</van-button>
    <van-button @click="save">保存</van-button>
</template>
```

#### 工具函数

```ts
import {
    compressImage,
    fileToBase64,
    isPhone,
    isIdCard,
    formatDate,
    formatMoney,
    isAndroid,
    isIOS,
    gcj02ToWgs84,
} from '@robot-h5/core';

// 图片压缩
const compressed = await compressImage(file, { maxSize: 500, quality: 0.7 });

// 验证手机号
if (!isPhone('13800138000')) { /* ... */ }

// 格式化
formatDate(new Date());          // '2024-01-15'
formatMoney(12345.6);            // '12,345.60'

// 坐标转换
const wgs = gcj02ToWgs84(116.397, 39.908);
```

#### 钉钉平台适配

```ts
// src/h5.config.ts
import { defineH5Config } from '@robot-h5/core';
import dd from 'dingtalk-jsapi';

export default defineH5Config({
    bridge: {
        platform: 'dingtalk',
        dingtalk: { corpId: 'ding_xxx' },
        overrides: {
            scanner: {
                scan: async () => {
                    const res = await dd.biz.util.scan({ type: 'qrCode' });
                    return res.text;
                },
            },
        },
    },
});
```

> 完整 API 文档参见 [@robot-h5/core README](https://www.npmjs.com/package/@robot-h5/core)

---

## 附录：mbase 集成指南

本地开发和 Vercel 演示以 standalone 模式运行；SIT/UAT/PRE/PRD 标准环境均已启用 wl-mbase integrated 配置。旧 `pnpm build:integrated` 仍兼容为 PRD 构建，但新流水线只需执行 `pnpm build`。模板已经内置：

- `portal_token + companyId/companyName` 免登参数接收与地址栏敏感参数清理；每次收到基座 token 都以本次 URL 为权威来源，覆盖本地旧会话，支持换号进入和基座长会话续期后的重新注入；
- 公司上下文闭环：默认在用户/权限/业务请求前对齐平台 `/hrms/user/changeCompany`，失败进入可重试诊断页；新接口可使用 `withMbaseCompanyContext` 显式传参，业务缓存可用 `getMbaseCompanyScopedKey` 按公司隔离；
- App/PDA 与 iframe 宿主识别；
- 路由进入、返回时的动态标题同步；
- App/PDA 单头部和原生返回协议；
- `@robot-h5/core` 拍照、扫码、定位桥及扩展能力调用入口。

相册等扩展能力请直接使用 `@robot-h5/core/bridge` 的 `invokeMbaseCapability`；异常调试使用 `MbaseBridgeError` 与 `getMbaseTransportStatus`。模板的 `@/platform/mbase` 继续兼容转出这些 API，但新业务推荐依赖 Core 的公共出口。

完整配置、公司切换数据闭环、代码示例、错误排查和验收清单见 [wl-mbase 子应用集成指南](./docs/mbase-integration.md)。基座侧协议、相册、无 ID 暂存、可选服务端水印和断点续传契约，以 wl-mbase 项目中的《集成文档》为准。

## 构建环境专项文档

环境选择、旧流水线兼容、`env.json` 字段、基座与子应用文件边界及发布排查，统一见[构建、环境与产物身份证](./docs/build-and-environments.md)。

## PDA 兼容与 mbase 专项文档

| 文档 | 面向场景 |
| --- | --- |
| [构建、环境与产物身份证](./docs/build-and-environments.md) | 分支自动构建、旧流水线兼容、独立 env.json 与发布核验 |
| [PDA 与旧 WebView 兼容规范](./docs/pda-compatibility.md) | 构建目标、禁用语法、渐进增强、真机验证 |
| [wl-mbase 子应用集成指南](./docs/mbase-integration.md) | 免登、单头部、动态标题、能力桥、可选图片水印和排障 |

提交或发布前至少执行：

```bash
pnpm template:validate
pnpm type-check
pnpm build
pnpm test:compat
```

---

**PROPRIETARY** — 内部私有项目。© Robot H5. All rights reserved.
