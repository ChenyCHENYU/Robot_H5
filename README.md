# H5 移动端模板

内部 H5 移动端项目模板，基于 Vue 3 + Vite + TypeScript + Pinia。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) + Vite 7 + TypeScript |
| 状态管理 | Pinia + pinia-plugin-persistedstate |
| 样式 | UnoCSS + Sass |
| UI 组件 | @miracle-web/ui |
| 工具 | @vueuse/core, mitt, nprogress, ECharts |
| 代码质量 | ESLint + Prettier + Husky + lint-staged |

## 项目结构

```
.
├── build/          # Vite 插件与构建配置
├── mock/           # Mock 数据
├── public/         # 静态资源
├── src/
│   ├── api/        # 接口请求
│   ├── assets/     # 资源文件
│   ├── components/ # 公共组件
│   ├── hooks/      # 组合式函数
│   ├── layout/     # 布局组件
│   ├── plugins/    # 插件注册
│   ├── router/     # 路由配置
│   ├── services/   # 原生交互桥接
│   ├── store/      # 状态管理
│   ├── styles/     # 全局样式
│   ├── utils/      # 工具函数
│   └── views/      # 页面组件
├── types/          # 类型声明
├── index.html      # 入口 HTML
├── vite.config.ts  # Vite 配置
├── uno.config.ts   # UnoCSS 配置
└── tsconfig.json   # TypeScript 配置
```

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 8.15.6

### 安装与运行

```bash
pnpm install
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm preview      # 构建后预览
```

### 常用命令

```bash
pnpm lint         # 代码检查
pnpm lint:fix     # 自动修复
pnpm format       # 格式化代码
pnpm type-check   # 类型检查
```

## 维护者

CHENY

## 协议

MIT
