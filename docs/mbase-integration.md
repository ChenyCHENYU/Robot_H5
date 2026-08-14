# wl-mbase 子应用集成指南

Robot_H5 `v1.7.1+` 已内置免登参数接收、宿主识别、各宿主单头部、动态标题、App/PDA 返回导航和 `@robot-h5/core@^1.1.4` 通用能力桥。业务项目只负责环境配置、路由元数据与业务交互。

## 1. 配置 integrated 环境

```dotenv
VITE_APP_MODE = integrated
VITE_PUBLIC_PATH = /mbase/{应用缩写}/
VITE_MBASE_ORIGIN = https://ytiop-sit.walsin.com.cn
VITE_GLOB_API_URL = https://ytiop-sit.walsin.com.cn
VITE_GLOB_API_URL_PREFIX = /sit-api
```

`pnpm setup` 会按项目名自动写入 `/mbase/{应用缩写}/` 和网关 origin；部署其他环境时仍需核对。`VITE_MBASE_ORIGIN` 用于严格校验 iframe 消息，禁止配置 `*`。

模板已在 `src/h5.config.ts` 将它传入 Core：

```ts
bridge: {
  platform: 'auto',
  mbase: {
    origin: import.meta.env.VITE_MBASE_ORIGIN,
    appBridgeTimeoutMs: 6000,
    appSdkUrl: `${import.meta.env.BASE_URL}vendor/uni.webview.1.5.8.js`,
  },
},
```

Core 同时校验响应的父窗口引用和 origin；可信 origin 缺失时返回 `mbase_origin_missing`，不会用 `*` 静默放宽。

## 2. 路由即导航契约

```ts
{
  path: '/home',
  name: 'Home',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '业务首页',
    mbaseRoot: true,
  },
}
```

- 所有页面配置准确的 `meta.title`。模板在每次 `router.afterEach` 上报，进入和返回都会刷新基座标题。
- 首页、工作台、底部 Tab 根页配置 `mbaseRoot: true`；详情、编辑、扫码页不要配置。
- `C_NavBar` 在独立浏览器中正常显示；由 mbase 托管时自动隐藏，避免双头部。
- H5/钉钉由基座头部接管显示与标题；只有 App/PDA 额外启用原生返回双向协议，两者不要混为一谈。
- 右侧保存/筛选等业务操作不要只放 `C_NavBar` 插槽，应放在页面内容区或独立工具栏。

## 3. 拍照、扫码、定位

三项能力继续使用 `@robot-h5/core`，无需业务判断钉钉、App、PDA或普通浏览器：

```ts
import { useCamera, useLocation, useQrScanner } from '@robot-h5/core';

const { capture } = useCamera();
const { scan } = useQrScanner();
const { getCurrentPosition } = useLocation();
```

core 已负责 `takePhoto`、`scan`、`getLocation` 的平台适配。不要在业务页面直接调用 `window.android`、`window.webkit`、`plus.webview` 或钉钉 JSAPI。

## 4. 扩展基座能力

Core 尚未封装成 Hook 的基座 v1 能力使用公共桥接入口：

```ts
import { invokeMbaseCapability, MbaseBridgeError } from '@robot-h5/core/bridge';

try {
  const data = await invokeMbaseCapability<{ source: string; files: unknown[] }>(
    'chooseImage',
    { source: 'album', max: 1 },
  );
  console.info(data.files);
} catch (error) {
  const bridgeError = error as MbaseBridgeError;
  console.error(bridgeError.code, bridgeError.message, bridgeError.details);
}
```

相册直传、无 ID 暂存、断点续传的 payload 和后端约束以 wl-mbase《集成文档》为唯一准则。模板只提供可靠传输层，不替业务决定上传接口或页面交互。

## 5. 调试信息

```ts
import { getMbaseTransportStatus } from '@robot-h5/core/bridge';

console.table(getMbaseTransportStatus());
```

重点字段：`host` 应为 `app/iframe`，App/PDA 的 `sdkPostMessage/nativeBridge` 应为 `true`，iframe 的 `portalOrigin` 应与基座地址一致。能力异常保留 `error.code/message/details`，不要统一吞成“操作失败”。

常见错误：

| code | 含义 | 排查 |
|------|------|------|
| `unsupported` | 当前不在 wl-mbase 宿主 | 检查构建模式及 `from=portal` / `mbase_host=app` |
| `mbase_origin_missing` | 未取得可信门户来源 | 检查 `VITE_MBASE_ORIGIN` 是否进入当前构建环境 |
| `app_bridge_not_ready` | PDA/App 原生桥未就绪 | 查看宿主版本与 `sdkPostMessage/nativeBridge`，稍后重试 |
| `app_sdk_url_missing` | 未配置 App SDK 自托管地址 | 检查 `appSdkUrl` 和部署目录下 vendor 文件 |
| `timeout` | 请求已发出但基座未回传 | 用请求 api、错误 details 和基座日志联合定位 |

## 6. 验收清单

- 独立浏览器：子应用头部存在，返回、拍照/文件选择的浏览器降级正常。
- 普通 H5/钉钉：只显示宿主头部，进入二级页和返回时标题均正确。
- App/PDA：只有基座原生头部；详情返回子应用上一页，根页返回门户。
- 换号复用 WebView/未清缓存：必须使用新 `portal_token`，不能闪现或继续使用上一账号资料。
- 长会话中基座重新注入更新后的 `portal_token` 时，即使本地仍有旧 token，也必须再次清空旧用户/权限并以本次 URL 为权威来源；Robot_H5 `v1.7.0+` 已内置该行为。
- 拍照、扫码、定位失败时能看到稳定错误码和桥接状态，不出现 60 秒无提示假死。
- `pnpm build:integrated && pnpm test:compat` 通过。
