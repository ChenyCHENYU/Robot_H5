# Robot_H5 构建、环境与产物身份证

本文面向使用 Robot_H5 创建业务子应用的开发、CI/CD 和发布人员。模板只有 H5 一个构建目标，标准流水线统一执行 `pnpm build`。

## 1. 核心约定

- `dev / sit / uat / pre / main(prd)` 分支分别映射 DEV、SIT、UAT、PRE、PRD。
- SIT/UAT/PRE/PRD 默认是 `integrated`，用于作为 wl-mbase 子应用运行；本地 DEV 和 Vercel 演示保持 `standalone`。
- 构建环境与已识别的 Git 分支不一致时直接失败；生产构建只允许从 `main` 或 `prd` 分支发起。
- 每个子应用产物只生成一个自己的 `dist/env.json`。它用于诊断版本和部署环境，不参与运行时切换。
- 旧命令仍保留为兼容别名，已有流水线无需立即修改；新流水线只使用 `pnpm build`。

## 2. 配置文件

| 文件 | 环境 | 默认运行模式 | 说明 |
| --- | --- | --- | --- |
| `.env.development` | DEV | `standalone` | 本地 Mock 与 HMR |
| `.env.sit` | SIT | `integrated` | SIT mbase 子应用 |
| `.env.uat` | UAT | `integrated` | UAT mbase 子应用 |
| `.env.pre` | PRE | `integrated` | PRE mbase 子应用 |
| `.env.production` | PRD | `integrated` | PRD mbase 子应用 |
| `.env.vercel` | DEMO | `standalone` | 静态演示站 |

环境名称、别名、Vite mode 和分支映射集中维护在 `build/environments.json`。`project.config.json` 保存新项目初始化时各环境的网关与 API 前缀默认值，业务应用最终使用的标题、应用 ID、部署路径和 API 地址写入对应 `.env` 文件；`pnpm setup` 会一次性按项目参数更新所有标准环境。

已删除旧的 `.env.test` 和 `.env.integrated`：

- `test` 只是 SIT 的旧名字，现在由 `.env.sit` 承载；
- `integrated` 是运行模式，不是部署环境，现在 SIT/UAT/PRE/PRD 各自包含完整的 mbase 配置。

## 3. 构建命令

### 标准流水线

```bash
pnpm install --frozen-lockfile
pnpm template:validate
pnpm build
```

`pnpm build` 的选择顺序为：

1. 命令参数 `--env`；
2. CI 变量 `DEPLOY_ENV`；
3. 当前 Git 分支。

本地显式构建示例：

```bash
pnpm build -- --env sit
```

在标准环境分支上，显式环境必须与分支一致。例如 `sit` 分支不能构建 UAT。

### 旧流水线兼容

| 旧命令 | 当前等价环境 | 状态 |
| --- | --- | --- |
| `pnpm build:test` | SIT | 保留，执行统一构建入口 |
| `pnpm build:uat` | UAT | 保留，执行统一构建入口 |
| `pnpm build:prod` | PRD | 保留，执行统一构建入口 |
| `pnpm build:integrated` | PRD integrated | 保留，执行统一构建入口 |
| `pnpm build:vercel` | DEMO | 保留，执行统一构建入口 |

兼容命令会打印迁移提示，但不会改变构建结果。运维可按计划把它们逐步替换为 `pnpm build`。

## 4. `env.json` 的边界

构建完成后，应用根目录会生成：

```text
dist/env.json
```

它记录：

- 应用 ID、标题和版本；
- 环境、H5 目标、Vite mode、分支和 Commit；
- 是否基于脏工作区构建、构建时间和流水线编号；
- public path、API、上传地址、运行模式和可信 mbase origin。

`env.json` 只能包含公开诊断信息，不得放 Token、密码、OAuth secret 或私钥。`builtAt` 是产物构建时间；实际部署时间应由发布平台记录。

### 基座与子应用会不会加载多个文件

不会。每个部署单元只负责自己的一个文件：

```text
/mbase/env.json             # wl-mbase 自己的产物身份证
/mbase/zl/env.json          # 品质子应用自己的产物身份证
/mbase/sb/env.json          # 设备子应用自己的产物身份证
```

子应用被基座 iframe 或 App WebView 打开时，不会自动读取 `/mbase/env.json`；基座也不会替子应用读取其 `env.json`。只有诊断、发布核对或监控主动请求时才会访问对应文件，因此不存在重复加载、相互覆盖或额外首屏请求。

子应用不能把基座 `env.json` 当运行时配置源。API、public path 和可信 origin 必须在子应用构建时固化；否则基座升级或缓存变化会造成不可控的跨环境行为。

## 5. 初始化新项目

执行：

```bash
pnpm setup
```

初始化脚本会同步更新 DEV/SIT/UAT/PRE/PRD 的：

- `VITE_GLOB_APP_TITLE`；
- `VITE_GLOB_APP_ID`；
- `VITE_PUBLIC_PATH=/mbase/{应用缩写}/`；
- API Origin、API 前缀和上传地址；
- `VITE_MBASE_ORIGIN`；
- mbase 集成运行模式。

Vercel 环境只同步应用标题和 ID，并强制保持根路径、standalone、Mock 与空后端地址，避免演示产物意外连接 localhost 或业务网关。

初始化后必须逐环境复核 `.env.*`，尤其是应用缩写、HTTPS 域名和 API 前缀。若网关规则变化，应先更新 `project.config.json` 再初始化；不要把另一个子应用的路径或应用 ID 原样提交。

## 6. 发布校验

```bash
pnpm template:validate
pnpm type-check
pnpm build
pnpm test:compat
```

发布前确认：

1. 构建日志中的环境、分支、应用 ID 和 API 正确；
2. `dist/env.json` 与目标环境一致；
3. `dist/env.json` 不包含敏感字段；
4. 线上访问 `/{应用部署路径}/env.json` 返回 JSON 而不是 SPA `index.html`；
5. 从 mbase 进入时单头部、动态标题、Token、公司上下文和能力桥正常；
6. 独立打开开发或演示环境时仍走 standalone 行为；
7. PDA 构建产物不包含 `@layer` 和不兼容的桥接代码。

## 7. 常见阻断

| 提示 | 处理方式 |
| --- | --- |
| 无法从分支识别环境 | 使用标准环境分支，或在非生产 CI 设置 `DEPLOY_ENV` |
| 构建环境与分支冲突 | 切换到对应分支，不要绕过环境锁 |
| 禁止绕过统一构建入口 | 使用 `pnpm build` 或仍受支持的 `build:*` 兼容命令 |
| 环境文件标识错误 | 检查 `.env.<mode>` 中的 `VITE_ENV` |
| integrated 模式或 HTTPS 校验失败 | 检查目标环境的 `VITE_APP_MODE`、Mock、API 和 mbase origin |
| 产物缺少/不匹配 `env.json` | 停止部署，清理 `dist` 后重新构建 |
