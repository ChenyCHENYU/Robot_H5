# wl-mbase 子应用集成指南

Robot_H5 `v1.8.0+` 已内置免登参数接收、公司上下文闭环、宿主识别、各宿主单头部、动态标题、App/PDA 返回导航和 `@robot-h5/core@^1.2.0` 通用能力桥。业务项目只负责环境配置、路由元数据与业务交互。

## 1. 配置目标环境

SIT/UAT/PRE/PRD 都是独立的 integrated 环境，不再共用 `.env.integrated`。以下以 `.env.sit` 为例：

```dotenv
VITE_APP_MODE = integrated
VITE_PUBLIC_PATH = /mbase/{应用缩写}/
VITE_MBASE_ORIGIN = https://ytiop-sit.walsin.com.cn
VITE_GLOB_API_URL = https://ytiop-sit.walsin.com.cn
VITE_GLOB_API_URL_PREFIX = /sit-api
VITE_MBASE_COMPANY_SYNC_MODE = server
VITE_MBASE_CHANGE_COMPANY_API = /hrms/user/changeCompany
```

`pnpm setup` 会同时写入 `.env.sit / .env.uat / .env.pre / .env.production` 的应用 ID、`/mbase/{应用缩写}/`、API 和网关 origin。`VITE_MBASE_ORIGIN` 用于严格校验 iframe 消息，禁止配置 `*`。`dev / sit / uat / pre / main` 标准环境分支统一执行 `pnpm build:h5`；生产只认 `main`。旧 `build:test / build:uat / build:prod / build:integrated` 命令仍兼容，但只能校验、不能覆盖分支环境。

每次构建只生成当前子应用自己的 `dist/env.json`。它不会自动加载基座的 `/mbase/env.json`，也不参与运行时环境切换；完整边界见[构建、环境与产物身份证](./build-and-environments.md)。

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

## 2. 公司上下文闭环

mbase 每次打开子应用都会传入本次选择的 `companyId/companyName`。模板把这次 URL 作为权威来源，先清理上一账号与上一公司的用户/权限状态，再完成公司初始化；公司未就绪前不会加载菜单和业务首页。

默认 `server` 模式对齐当前平台和 `wl-ui-public`：

```text
读取 portal_token/companyId/companyName
  → 清理旧用户与旧权限
  → POST /hrms/user/changeCompany?companyId=<本次公司>
  → 获取用户信息
  → 重新获取菜单和按钮权限
  → 进入业务页面并加载当前公司数据
```

服务端同步失败或缺少 `companyId` 时会进入“公司上下文未就绪”诊断页，不会带着旧公司状态继续请求。诊断页展示稳定错误码、目标公司和同步接口，可在网络恢复后重新同步。

### 2.1 两种后端模式

| 模式 | 配置 | 使用场景 | 子应用要求 |
| --- | --- | --- | --- |
| `server`（默认） | `VITE_MBASE_COMPANY_SYNC_MODE=server` | 存量接口根据服务端当前公司过滤数据 | 入口自动调用 `changeCompany`；后续正常加载 |
| `explicit` | `VITE_MBASE_COMPANY_SYNC_MODE=explicit` | 新接口显式接收 `companyId` | 每个公司级业务接口都必须传 `companyId` |

新业务接口即使运行在 `server` 模式，也建议显式携带公司 ID：

```ts
import { get } from '@/utils/http';
import { withMbaseCompanyContext } from '@/platform/mbase';

export const getInspectionList = (params: Record<string, unknown>) =>
  get('/inspection/list', withMbaseCompanyContext(params));
```

`withMbaseCompanyContext` 在独立 H5 中保持原参数不变；在 mbase 集成模式下缺少公司 ID 会直接阻止请求，避免落入默认公司。后端仍必须验证 `portal_token + companyId`，`companyName` 仅用于展示。

业务持久化缓存必须按公司隔离：

```ts
import { getMbaseCompanyScopedKey } from '@/platform/mbase';

localStorage.setItem(getMbaseCompanyScopedKey('inspection-draft'), JSON.stringify(draft));
```

禁止只执行 `userStore.setCompanyId()`：它只改变前端字段，无法让依赖服务端当前公司的存量接口切换数据。也不要直接调用 `@jhlc/common-core` 的 PC `changeCompany()`；该方法没有覆盖移动端初始化阻断、缓存清理和失败诊断。

### 2.2 初始化约束

- 公司同步必须发生在用户信息、菜单权限和业务列表请求之前。
- 每次 URL 带新 `portal_token` 时都重新消费公司上下文，不能因为本地已有 Token 而跳过。
- 切换公司后不得复用上一公司的 Pinia/KeepAlive/localStorage/IndexedDB 业务缓存；持久化缓存应按公司 ID 分区。
- 不得把 `companyId` 转成 `number`，平台长 ID 必须全程按字符串保存和传输。
- `/hrms/user/changeCompany` 只在 `integrated + server` 模式调用，独立 H5 登录流程零影响。

## 3. 路由即导航契约

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

## 4. 拍照、扫码、定位

三项能力继续使用 `@robot-h5/core`，无需业务判断钉钉、App、PDA或普通浏览器：

```ts
import { useCamera, useLocation, useQrScanner } from '@robot-h5/core';

const { capture } = useCamera();
const { scan } = useQrScanner();
const { getCurrentPosition } = useLocation();
```

core 已负责 `takePhoto`、`scan`、`getLocation` 的平台适配。不要在业务页面直接调用 `window.android`、`window.webkit`、`plus.webview` 或钉钉 JSAPI。

## 5. 扩展基座能力

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

## 6. 可选图片水印

正式业务水印使用服务端权威处理。子应用只维护“是否带水印”的交互，并用 Core 将策略加入现有上传 `formData`；关闭时不会增加字段，也不会改变旧上传：

```ts
import { buildWatermarkFormData } from '@robot-h5/core';

const formData = buildWatermarkFormData(
  { businessType: 'inspection', businessId },
  watermarkEnabled.value
    ? {
        enabled: true,
        required: true,
        templateId: 'inspection-photo-v1',
        source, // camera 或 album
        clientCapturedAt: new Date(),
        location: currentLocation,
        context: { businessName: '气体检测' },
      }
    : { enabled: false },
);

await window.WLPortalMedia.chooseImageAndUpload({
  source,
  max: 1,
  url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
  formData,
  header,
});
```

- 拍照和相册历史照片使用同一契约；相册照片水印应写“上传时间/位置”，不能冒充拍摄信息。
- 钉钉虚拟路径不能由子应用 `fetch`，不要尝试用 Canvas 改造原生直传。
- `required=true` 时服务端失败必须让上传失败，页面保留重试入口。
- 无业务 ID 使用 `chooseImagePersist`，取得 ID 后在 `uploadPendingPhotos.formData` 中加入同一策略。
- `useWatermark` 仅用于已取得真实 `File` 的本地预览或纯 H5 客户端处理，不能代替跨端服务端水印。

Core 新能力尚未发布时不要在模板依赖中预填不存在的版本；发布后先升级 `@robot-h5/core`，再按 wl-mbase《集成文档》的服务端契约接入。

## 7. 调试信息

```ts
import { getMbaseTransportStatus } from '@robot-h5/core/bridge';

console.table(getMbaseTransportStatus());
```

重点字段：`host` 应为 `app/iframe`，App/PDA 的 `sdkPostMessage/nativeBridge` 应为 `true`，iframe 的 `portalOrigin` 应与基座地址一致。能力异常保留 `error.code/message/details`，不要统一吞成“操作失败”。

常见错误：

| code | 含义 | 排查 |
|------|------|------|
| `unsupported` | 当前不在 wl-mbase 宿主 | 检查目标环境的 `VITE_APP_MODE` 及 `from=portal` / `mbase_host=app` |
| `mbase_origin_missing` | 未取得可信门户来源 | 检查 `VITE_MBASE_ORIGIN` 是否进入当前构建环境 |
| `app_bridge_not_ready` | PDA/App 原生桥未就绪 | 查看宿主版本与 `sdkPostMessage/nativeBridge`，稍后重试 |
| `app_sdk_url_missing` | 未配置 App SDK 自托管地址 | 检查 `appSdkUrl` 和部署目录下 vendor 文件 |
| `timeout` | 请求已发出但基座未回传 | 用请求 api、错误 details 和基座日志联合定位 |

## 8. 验收清单

- 独立浏览器：子应用头部存在，返回、拍照/文件选择的浏览器降级正常。
- 普通 H5/钉钉：只显示宿主头部，进入二级页和返回时标题均正确。
- App/PDA：只有基座原生头部；详情返回子应用上一页，根页返回门户。
- 换号复用 WebView/未清缓存：必须使用新 `portal_token`，不能闪现或继续使用上一账号资料。
- 长会话中基座重新注入更新后的 `portal_token` 时，即使本地仍有旧 token，也必须再次清空旧用户/权限并以本次 URL 为权威来源；Robot_H5 `v1.7.0+` 已内置该行为。
- 公司 A 进入后返回门户切换公司 B，再进入子应用：必须先完成公司同步，菜单、权限和业务列表不得复用公司 A 数据。
- 人工让 `/hrms/user/changeCompany` 失败：必须进入公司上下文诊断页，且业务列表接口不得发出；恢复后“重新同步”可正常进入。
- `explicit` 模式下，确认公司级接口请求参数包含本次 `companyId`；缺失时前端应在发请求前报 `company_context_missing`。
- 拍照、扫码、定位失败时能看到稳定错误码和桥接状态，不出现 60 秒无提示假死。
- 水印关闭时服务端收不到 `watermarkPolicy`；开启时拍照、相册在各宿主均返回服务端水印图。
- 必须水印处理失败时阻止提交，不静默把原图标记成水印成功。
- 对应环境分支执行 `pnpm build:h5 && pnpm test:compat` 通过，并核对 `dist/env.json`。
