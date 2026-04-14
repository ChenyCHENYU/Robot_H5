# @robot/h5-core 通用能力包设计文档

> 面向钢铁企业 17+ 业务系统的移动端 H5 通用基础设施包。
> 各项目 `pnpm add @robot/h5-core` 按需取用，tree-shaking 友好。

---

## 目录

- [落地策略](#落地策略先在-robot_h5-实现后迁移到包)
- [包目录结构](#包目录结构)
- [能力分类总览](#能力分类总览)
- [详细设计](#详细设计)
  - [Hooks](#hooks)
  - [Bridge 适配层](#bridge-适配层)
  - [Utils 工具函数](#utils-工具函数)
  - [Types 类型定义](#types-类型定义)
- [隔离原则](#隔离原则不互相污染)
- [按需取用方式](#按需取用方式)
- [测试方案](#测试方案)
- [版本管理与发布](#版本管理与发布)
- [迁移路径](#迁移路径从-robot_h5-到-npm-包)

---

## 落地策略：先在 Robot_H5 实现，后迁移到包

### 结论：先在当前项目实现 → 稳定后整体迁移

**理由：**

1. **调试效率**：在 Robot_H5 中直接开发，热更新即时生效，无需 `pnpm link` 或本地发包
2. **需求验证**：只有在真实业务中跑过的 Hook 才知道 API 设计是否合理
3. **避免过早抽象**：一开始就建包容易过度设计，等 2-3 个能力稳定后再提取
4. **零成本启动**：不改架构，直接在 `src/hooks/` 和 `src/utils/` 里按最终命名开发

### 迁移时机

| 信号 | 动作 |
|------|------|
| Robot_H5 中 5+ 个 Hook 稳定运行 | 开始准备包结构 |
| 第二个 H5 项目启动 | 正式提取、发包 |
| 3+ 项目使用 | 进入成熟维护期 |

### 命名规范（现在就统一，迁移零重构）

- Hooks：`src/hooks/useCamera/index.ts` → 迁移后 `packages/hooks/useCamera/index.ts`
- Utils：`src/utils/image.ts` → 迁移后 `packages/utils/image.ts`
- Bridge：`src/services/bridge/` → 迁移后 `packages/bridge/`
- 导出路径保持不变，迁移时只需改 `import` 的包名前缀

---

## 包目录结构

```
@robot/h5-core/
├── package.json
├── tsconfig.json
├── vitest.config.ts           # 测试配置
├── README.md
│
├── packages/
│   ├── hooks/                 # ===== Vue 3 Composition Hooks =====
│   │   ├── useCamera/
│   │   │   ├── index.ts       # Hook 实现
│   │   │   ├── types.ts       # 类型定义
│   │   │   └── __tests__/
│   │   │       └── useCamera.test.ts
│   │   ├── useQrScanner/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── __tests__/
│   │   ├── useNfc/
│   │   ├── useLocation/
│   │   ├── useFileUpload/
│   │   ├── useFilePreview/
│   │   ├── useSignature/
│   │   ├── useAudioRecorder/
│   │   ├── useVideoRecorder/
│   │   ├── useBluetooth/
│   │   ├── useOfflineStorage/
│   │   ├── usePushNotification/
│   │   ├── useWatermark/
│   │   ├── usePermission/
│   │   └── index.ts           # 统一导出所有 Hooks
│   │
│   ├── bridge/                # ===== JSBridge 宿主适配层 =====
│   │   ├── core.ts            # BridgeAdapter 抽象接口
│   │   ├── native.ts          # APP WebView 适配
│   │   ├── dingtalk.ts        # 钉钉适配 (dd.ready)
│   │   ├── wechat.ts          # 微信/企微适配 (wx.config)
│   │   ├── browser.ts         # 浏览器降级适配（Web API）
│   │   ├── detector.ts        # 运行环境检测（自动识别宿主）
│   │   └── index.ts           # createBridge() 工厂
│   │
│   ├── auth/                  # ===== 宿主鉴权统一 =====
│   │   ├── native.ts          # APP Token 注入
│   │   ├── dingtalk.ts        # 钉钉免登/授权码
│   │   ├── wechat.ts          # 微信 OAuth / JS-SDK 签名
│   │   └── index.ts           # createAuth() 工厂
│   │
│   ├── utils/                 # ===== 纯函数工具 =====
│   │   ├── image.ts           # 图片压缩、格式转换
│   │   ├── coord.ts           # 坐标系转换 (GCJ-02 ↔ WGS-84)
│   │   ├── device.ts          # 设备信息采集
│   │   ├── file.ts            # 文件类型判断、大小格式化
│   │   ├── validate.ts        # 通用校验（手机号、身份证、邮箱）
│   │   ├── format.ts          # 日期/数字/金额格式化
│   │   └── index.ts           # 统一导出
│   │
│   └── types/                 # ===== 共享类型 =====
│       ├── bridge.d.ts        # Bridge 接口协议
│       ├── hooks.d.ts         # Hook 配置/返回类型
│       └── index.d.ts         # 统一导出
│
├── playground/                # 开发调试用 Demo App
│   ├── vite.config.ts
│   └── src/
│       └── App.vue            # 各能力交互式测试页
│
└── scripts/
    └── release.ts             # 发包脚本
```

---

## 能力分类总览

### Hooks（Vue 3 Composition API）

| # | Hook | 分类 | 说明 | 依赖 Bridge |
|---|------|------|------|-------------|
| 1 | `useCamera` | 媒体采集 | 拍照/相册选图 → File/Base64 | ✅ |
| 2 | `useQrScanner` | 扫码 | 二维码/条形码扫描 | ✅ |
| 3 | `useNfc` | 硬件 | NFC 读卡/写卡 | ✅ |
| 4 | `useLocation` | 定位 | GPS 单次/持续定位 | ✅ |
| 5 | `useFileUpload` | 文件 | 分片上传 + 进度 + 压缩 | ❌ |
| 6 | `useFilePreview` | 文件 | PDF/Office/图片 在线预览 | ✅（可选） |
| 7 | `useSignature` | 交互 | Canvas 手写签名板 | ❌ |
| 8 | `useAudioRecorder` | 媒体采集 | 录音 + 可选语音转文字 | ✅ |
| 9 | `useVideoRecorder` | 媒体采集 | 视频录制 | ✅ |
| 10 | `useBluetooth` | 硬件 | 蓝牙设备连接 | ✅ |
| 11 | `useOfflineStorage` | 离线 | IndexedDB 缓存 + 在线自动同步 | ❌ |
| 12 | `usePushNotification` | 推送 | 统一推送（钉钉/微信/APP） | ✅ |
| 13 | `useWatermark` | 安全 | 拍照水印（时间+地点+人员） | ❌（依赖 useLocation） |
| 14 | `usePermission` | 权限 | 系统权限请求/检查 | ✅ |

### Bridge 适配层

| 能力 | APP (Native) | 钉钉 | 微信/企微 | 浏览器降级 |
|------|-------------|------|----------|-----------|
| 拍照 | WebView.camera | dd.biz.util.scan | wx.chooseImage | `<input capture>` |
| 扫码 | Native.scan | dd.biz.util.scan | wx.scanQRCode | jsQR 库 |
| NFC | Native.nfc | dd.biz.nfc | ❌ | Web NFC API |
| 定位 | Native.location | dd.device.geolocation | wx.getLocation | navigator.geolocation |
| 蓝牙 | Native.bluetooth | ❌ | wx.openBluetoothAdapter | Web Bluetooth API |
| 文件预览 | Native.openFile | dd.biz.util.openLink | wx.previewDocument | `<iframe>` / PDF.js |

### Utils 工具函数

| # | 模块 | 函数 | 说明 |
|---|------|------|------|
| 1 | `image.ts` | `compressImage(file, options)` | 图片压缩（质量/尺寸/格式） |
| 2 | `image.ts` | `fileToBase64(file)` | File → Base64 |
| 3 | `image.ts` | `base64ToBlob(base64)` | Base64 → Blob |
| 4 | `coord.ts` | `gcj02ToWgs84(lng, lat)` | 火星坐标 → GPS |
| 5 | `coord.ts` | `wgs84ToGcj02(lng, lat)` | GPS → 火星坐标 |
| 6 | `device.ts` | `getDeviceInfo()` | OS/版本/屏幕/网络/电量 |
| 7 | `device.ts` | `isAndroid() / isIOS()` | 平台判断 |
| 8 | `file.ts` | `getFileType(name)` | 获取文件 MIME 类型 |
| 9 | `file.ts` | `formatFileSize(bytes)` | 人类可读文件大小 |
| 10 | `validate.ts` | `isPhone(str)` | 手机号校验 |
| 11 | `validate.ts` | `isIdCard(str)` | 身份证号校验 |
| 12 | `validate.ts` | `isEmail(str)` | 邮箱校验 |
| 13 | `format.ts` | `formatDate(date, pattern)` | 日期格式化 |
| 14 | `format.ts` | `formatMoney(amount)` | 金额千分位 |

---

## 详细设计

### Hooks

#### 设计原则

1. **统一 API 形态**：所有 Hook 返回 `{ data, loading, error, execute }` 四元组
2. **配置式调用**：通过 options 对象传参，方便扩展不破坏签名
3. **自动清理**：`onUnmounted` 自动释放资源（监听器、定时器、蓝牙连接等）
4. **Bridge 透传**：通过依赖注入获取 Bridge 实例，不直接耦合宿主 SDK

#### useCamera 示例

```ts
// packages/hooks/useCamera/types.ts
export interface UseCameraOptions {
    /** 图片来源：拍照 / 相册 / 两者 */
    source?: 'camera' | 'album' | 'both';
    /** 最大文件大小 (KB)，超出自动压缩 */
    maxSize?: number;
    /** 压缩质量 0-1 */
    quality?: number;
    /** 是否添加水印 */
    watermark?: boolean;
    /** 水印文本（默认：时间+人员） */
    watermarkText?: string;
}

export interface UseCameraReturn {
    /** 拍摄/选择的图片 */
    photo: Ref<File | null>;
    /** Base64 预览 */
    preview: Ref<string>;
    /** 是否正在处理 */
    loading: Ref<boolean>;
    /** 错误信息 */
    error: Ref<Error | null>;
    /** 触发拍照/选图 */
    capture: (options?: Partial<UseCameraOptions>) => Promise<File | null>;
    /** 清除已选图片 */
    clear: () => void;
}
```

```ts
// packages/hooks/useCamera/index.ts
import { ref, onUnmounted } from 'vue';
import { useBridge } from '../bridge';
import { compressImage } from '../../utils/image';
import type { UseCameraOptions, UseCameraReturn } from './types';

const defaults: UseCameraOptions = {
    source: 'both',
    maxSize: 1024,
    quality: 0.8,
    watermark: false,
};

export function useCamera(options?: Partial<UseCameraOptions>): UseCameraReturn {
    const opts = { ...defaults, ...options };
    const bridge = useBridge();

    const photo = ref<File | null>(null);
    const preview = ref('');
    const loading = ref(false);
    const error = ref<Error | null>(null);

    async function capture(overrides?: Partial<UseCameraOptions>) {
        const merged = { ...opts, ...overrides };
        loading.value = true;
        error.value = null;

        try {
            const file = await bridge.camera.capture(merged);
            const compressed = merged.maxSize
                ? await compressImage(file, { maxSize: merged.maxSize, quality: merged.quality! })
                : file;

            photo.value = compressed;
            preview.value = URL.createObjectURL(compressed);
            return compressed;
        } catch (e) {
            error.value = e as Error;
            return null;
        } finally {
            loading.value = false;
        }
    }

    function clear() {
        if (preview.value) URL.revokeObjectURL(preview.value);
        photo.value = null;
        preview.value = '';
    }

    onUnmounted(clear);

    return { photo, preview, loading, error, capture, clear };
}
```

#### useFileUpload 示例

```ts
export interface UseFileUploadOptions {
    /** 上传接口 URL */
    action: string;
    /** 分片大小 (默认 2MB) */
    chunkSize?: number;
    /** 最大并发数 */
    concurrent?: number;
    /** 自定义请求头 */
    headers?: Record<string, string>;
    /** 上传前压缩（仅图片） */
    compress?: boolean;
}

export interface UseFileUploadReturn {
    /** 上传进度 0-100 */
    progress: Ref<number>;
    /** 是否上传中 */
    uploading: Ref<boolean>;
    /** 上传结果 URL */
    url: Ref<string>;
    /** 错误 */
    error: Ref<Error | null>;
    /** 开始上传 */
    upload: (file: File) => Promise<string>;
    /** 取消上传 */
    cancel: () => void;
}
```

#### useOfflineStorage 示例

```ts
export interface UseOfflineStorageOptions<T> {
    /** 存储键名 */
    key: string;
    /** 同步 API URL */
    syncUrl: string;
    /** 同步策略 */
    syncStrategy?: 'online-first' | 'offline-first';
    /** 自动同步间隔 (ms) */
    syncInterval?: number;
}

export interface UseOfflineStorageReturn<T> {
    /** 本地数据 */
    data: Ref<T[]>;
    /** 待同步条数 */
    pendingCount: Ref<number>;
    /** 是否在线 */
    isOnline: Ref<boolean>;
    /** 添加数据（离线时缓存） */
    add: (item: T) => Promise<void>;
    /** 手动触发同步 */
    sync: () => Promise<void>;
}
```

---

### Bridge 适配层

#### 核心设计：策略模式 + 自动检测

```ts
// packages/bridge/core.ts
/**
 * Bridge 抽象接口 — 所有宿主适配器必须实现
 * Hook 只依赖这个接口，不关心具体宿主
 */
export interface BridgeAdapter {
    /** 宿主类型 */
    readonly platform: 'native' | 'dingtalk' | 'wechat' | 'browser';

    /** 摄像头 */
    camera: {
        capture(options: CameraCaptureOptions): Promise<File>;
    };

    /** 扫码 */
    scanner: {
        scan(options?: ScanOptions): Promise<string>;
    };

    /** 定位 */
    location: {
        getCurrent(): Promise<Coordinates>;
        watchPosition(callback: (pos: Coordinates) => void): () => void;
    };

    /** NFC */
    nfc: {
        read(): Promise<NFCData>;
        write(data: NFCData): Promise<void>;
    };

    /** 蓝牙 */
    bluetooth: {
        connect(deviceId: string): Promise<BluetoothDevice>;
        disconnect(): Promise<void>;
    };

    /** 文件预览 */
    file: {
        preview(url: string, name?: string): Promise<void>;
    };

    /** 推送 */
    notification: {
        register(token: string): Promise<void>;
        onMessage(callback: (msg: PushMessage) => void): () => void;
    };
}
```

```ts
// packages/bridge/detector.ts
export type PlatformType = 'native' | 'dingtalk' | 'wechat' | 'browser';

/** 运行环境检测（UA + 全局对象） */
export function detectPlatform(): PlatformType {
    const ua = navigator.userAgent.toLowerCase();

    // 钉钉环境
    if (ua.includes('dingtalk')) return 'dingtalk';

    // 微信/企业微信环境
    if (ua.includes('micromessenger') || ua.includes('wxwork')) return 'wechat';

    // APP WebView（需与原生约定 UA 特征或检测 Bridge 对象）
    if (window.NativeCallJs || ua.includes('robot-app')) return 'native';

    // 兜底：浏览器
    return 'browser';
}
```

```ts
// packages/bridge/index.ts
import { detectPlatform } from './detector';
import type { BridgeAdapter } from './core';

let bridgeInstance: BridgeAdapter | null = null;

/**
 * 创建 Bridge 实例（单例）
 * 自动检测当前宿主环境，加载对应适配器
 */
export async function createBridge(): Promise<BridgeAdapter> {
    if (bridgeInstance) return bridgeInstance;

    const platform = detectPlatform();

    switch (platform) {
        case 'native':
            bridgeInstance = (await import('./native')).default;
            break;
        case 'dingtalk':
            bridgeInstance = (await import('./dingtalk')).default;
            break;
        case 'wechat':
            bridgeInstance = (await import('./wechat')).default;
            break;
        default:
            bridgeInstance = (await import('./browser')).default;
    }

    return bridgeInstance;
}

/**
 * Vue Composition API 中使用
 * 在 app 初始化时调用 provideBridge()，组件中 useBridge() 获取
 */
export function useBridge(): BridgeAdapter {
    // inject from Vue provide/inject
    const bridge = inject<BridgeAdapter>('robot-bridge');
    if (!bridge) throw new Error('[h5-core] Bridge 未初始化，请在 main.ts 中调用 provideBridge()');
    return bridge;
}
```

---

### Utils 工具函数

#### 设计原则

1. **纯函数**：不依赖 Vue、不依赖 Bridge，可在任何 JS 环境运行
2. **单一职责**：一个文件一个领域，函数粒度小
3. **Tree-shaking 友好**：全部 named export，不用 default export

#### image.ts 示例

```ts
export interface CompressOptions {
    /** 最大文件大小 (KB) */
    maxSize?: number;
    /** 压缩质量 0-1 (默认 0.8) */
    quality?: number;
    /** 最大宽度 (px) */
    maxWidth?: number;
    /** 最大高度 (px) */
    maxHeight?: number;
    /** 输出格式 */
    outputType?: 'image/jpeg' | 'image/png' | 'image/webp';
}

/** 图片压缩 */
export async function compressImage(file: File, options?: CompressOptions): Promise<File> {
    const { maxSize = 1024, quality = 0.8, maxWidth = 1920, maxHeight = 1920, outputType = 'image/jpeg' } = options || {};

    // 如果已经小于 maxSize，直接返回
    if (file.size / 1024 <= maxSize) return file;

    const bitmap = await createImageBitmap(file);
    const { width, height } = calculateSize(bitmap.width, bitmap.height, maxWidth, maxHeight);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await canvas.convertToBlob({ type: outputType, quality });
    return new File([blob], file.name, { type: outputType });
}

/** 计算等比缩放尺寸 */
function calculateSize(w: number, h: number, maxW: number, maxH: number) {
    if (w <= maxW && h <= maxH) return { width: w, height: h };
    const ratio = Math.min(maxW / w, maxH / h);
    return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}

/** File → Base64 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/** Base64 → Blob */
export function base64ToBlob(base64: string): Blob {
    const [meta, data] = base64.split(',');
    const mime = meta.match(/:(.*?);/)![1];
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}
```

#### validate.ts 示例

```ts
/** 中国大陆手机号（1开头 11位） */
export function isPhone(str: string): boolean {
    return /^1[3-9]\d{9}$/.test(str);
}

/** 18位身份证号 */
export function isIdCard(str: string): boolean {
    return /^\d{17}[\dXx]$/.test(str);
}

/** 邮箱 */
export function isEmail(str: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);
}

/** 统一社会信用代码（18位） */
export function isCreditCode(str: string): boolean {
    return /^[0-9A-HJ-NP-RTUW-Y]{2}\d{6}[0-9A-HJ-NP-RTUW-Y]{10}$/.test(str);
}
```

---

### Types 类型定义

```ts
// packages/types/hooks.d.ts

/** 所有 Hook 的通用返回结构 */
export interface UseAsyncReturn<T> {
    data: Ref<T | null>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    execute: (...args: any[]) => Promise<T>;
}

/** GPS 坐标 */
export interface Coordinates {
    longitude: number;
    latitude: number;
    altitude?: number;
    accuracy: number;
    timestamp: number;
}

/** NFC 读取数据 */
export interface NFCData {
    id: string;
    type: string;
    records: Array<{
        type: string;
        data: string;
    }>;
}

/** 推送消息 */
export interface PushMessage {
    title: string;
    body: string;
    data?: Record<string, any>;
    timestamp: number;
}
```

---

## 隔离原则（不互相污染）

### 1. 依赖方向：单向无环

```
Hooks → Bridge → (宿主 SDK)
  ↓
Utils ← 纯函数，无外部依赖
  ↓
Types ← 纯类型，零运行时
```

- **Hooks 可以依赖 Bridge 和 Utils**
- **Bridge 不依赖 Hooks**（只实现接口）
- **Utils 不依赖任何其他模块**（纯函数）
- **Types 纯类型声明**，所有模块可引用

### 2. 每个 Hook 独立可树摇

```ts
// ✅ 只打包 useCamera 和 image 工具
import { useCamera } from '@robot/h5-core/hooks';
import { compressImage } from '@robot/h5-core/utils';

// ❌ 不会引入 useNfc、useBluetooth 等不需要的代码
```

实现方式：
- `package.json` 的 `exports` 字段精确定义子路径
- 每个 Hook/Utils 独立的 `index.ts` 入口
- 无全局副作用（无顶层代码执行）

### 3. Bridge 按需加载

```ts
// 只在检测到钉钉环境时，才 dynamic import 钉钉 SDK
case 'dingtalk':
    bridgeInstance = (await import('./dingtalk')).default;
```

不使用的宿主适配器代码不会打包进产物。

### 4. Vue 版本松耦合

```json
{
    "peerDependencies": {
        "vue": "^3.3.0"
    }
}
```

只依赖 Vue 3 Composition API 的稳定接口（`ref`, `computed`, `onUnmounted`, `inject`）。

---

## 按需取用方式

### package.json exports 配置

```json
{
    "name": "@robot/h5-core",
    "exports": {
        ".": {
            "types": "./dist/index.d.ts",
            "import": "./dist/index.mjs"
        },
        "./hooks": {
            "types": "./dist/hooks/index.d.ts",
            "import": "./dist/hooks/index.mjs"
        },
        "./hooks/*": {
            "types": "./dist/hooks/*/index.d.ts",
            "import": "./dist/hooks/*/index.mjs"
        },
        "./bridge": {
            "types": "./dist/bridge/index.d.ts",
            "import": "./dist/bridge/index.mjs"
        },
        "./utils": {
            "types": "./dist/utils/index.d.ts",
            "import": "./dist/utils/index.mjs"
        },
        "./utils/*": {
            "types": "./dist/utils/*.d.ts",
            "import": "./dist/utils/*.mjs"
        },
        "./types": {
            "types": "./dist/types/index.d.ts"
        }
    }
}
```

### 业务项目使用方式

```ts
// 方式 1：从子路径导入（推荐，tree-shaking 最佳）
import { useCamera } from '@robot/h5-core/hooks/useCamera';
import { compressImage } from '@robot/h5-core/utils/image';

// 方式 2：从分类入口导入
import { useCamera, useLocation } from '@robot/h5-core/hooks';
import { compressImage, isPhone } from '@robot/h5-core/utils';

// 方式 3：从顶层入口导入（方便但 tree-shaking 依赖打包器）
import { useCamera, compressImage } from '@robot/h5-core';
```

---

## 测试方案

### 测试栈

| 工具 | 用途 |
|------|------|
| **Vitest** | 单元测试框架 |
| **@vue/test-utils** | Vue 组件/Hook 测试 |
| **happy-dom** | 轻量 DOM 模拟 |
| **msw** | Mock Service Worker（模拟网络请求） |

### 分层测试策略

#### Layer 1：Utils 纯函数测试（覆盖率 > 95%）

```ts
// packages/utils/__tests__/image.test.ts
import { describe, it, expect } from 'vitest';
import { fileToBase64, base64ToBlob } from '../image';

describe('image utils', () => {
    it('fileToBase64 → base64ToBlob 双向转换', async () => {
        const original = new File(['hello'], 'test.txt', { type: 'text/plain' });
        const base64 = await fileToBase64(original);
        const blob = base64ToBlob(base64);
        expect(blob.type).toBe('text/plain');
        expect(blob.size).toBe(original.size);
    });
});
```

```ts
// packages/utils/__tests__/validate.test.ts
describe('validate', () => {
    it.each([
        ['13800138000', true],
        ['12345678901', false],
        ['1380013800', false],
    ])('isPhone(%s) → %s', (input, expected) => {
        expect(isPhone(input)).toBe(expected);
    });
});
```

#### Layer 2：Bridge 适配器测试（Mock 宿主 SDK）

```ts
// packages/bridge/__tests__/browser.test.ts
import { describe, it, expect, vi } from 'vitest';
import browserBridge from '../browser';

describe('browser bridge - camera', () => {
    it('调用 input[type=file] 选择图片', async () => {
        // Mock file input
        const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
        vi.spyOn(HTMLInputElement.prototype, 'click');
        // ... 模拟用户选择文件
    });
});
```

#### Layer 3：Hooks 集成测试（@vue/test-utils）

```ts
// packages/hooks/__tests__/useCamera.test.ts
import { describe, it, expect, vi } from 'vitest';
import { withSetup } from '../test-utils';
import { useCamera } from '../useCamera';

// 模拟 Bridge
vi.mock('../../bridge', () => ({
    useBridge: () => ({
        camera: {
            capture: vi.fn().mockResolvedValue(new File([''], 'photo.jpg')),
        },
    }),
}));

describe('useCamera', () => {
    it('capture 返回压缩后的文件', async () => {
        const [result] = withSetup(() => useCamera({ maxSize: 500 }));
        expect(result.loading.value).toBe(false);

        const file = await result.capture();
        expect(file).toBeInstanceOf(File);
        expect(result.photo.value).not.toBeNull();
        expect(result.preview.value).toContain('blob:');
    });

    it('capture 失败时设置 error', async () => {
        // ... mock bridge 抛异常
    });

    it('clear 释放 ObjectURL', () => {
        // ...
    });
});
```

#### Layer 4：E2E 真机测试（可选）

在 `playground/` 项目中构建测试页面，部署到各宿主环境手工验证：

| 宿主 | 测试方式 |
|------|---------|
| 浏览器 | localhost 直接测试 |
| 钉钉 | 内网穿透 + 钉钉微应用调试 |
| 微信 | 微信开发者工具 + 公众号测试号 |
| APP | Debug 版 WebView + Chrome DevTools Remote |

---

## 版本管理与发布

### 版本策略

采用 [语义化版本](https://semver.org/lang/zh-CN/) (SemVer)：

| 版本号 | 含义 | 触发场景 |
|--------|------|---------|
| `0.1.0` → `0.2.0` | Minor | 新增 Hook / 工具函数 |
| `0.2.0` → `0.2.1` | Patch | Bug 修复 / 文档更新 |
| `0.x` → `1.0.0` | Major | Bridge 接口变更 / 破坏性改动 |

### 发布流程

```bash
# 基于 changesets 管理版本
pnpm changeset          # 记录变更
pnpm changeset version  # 自动更新版本号 + CHANGELOG
pnpm changeset publish  # 发布到私有 npm
```

### 私有 npm 配置

```ini
# .npmrc
@robot:registry=https://npm.yourcompany.com/
//npm.yourcompany.com/:_authToken=${NPM_TOKEN}
```

---

## 迁移路径：从 Robot_H5 到 npm 包

### Phase 0：当前（在 Robot_H5 中开发）

```
src/hooks/useCamera/index.ts       ← 直接在项目里写
src/hooks/useFileUpload/index.ts
src/utils/image.ts
src/services/bridge/               ← 现有 JSBridge 逐步重构
```

导入方式不变：`import { useCamera } from '@/hooks/useCamera'`

### Phase 1：提取到独立仓库

1. 创建 `@robot/h5-core` 仓库
2. 从 Robot_H5 的 `src/hooks/` 和 `src/utils/` 复制代码
3. 添加 Vitest 测试、构建脚本
4. 发布 `@robot/h5-core@0.1.0`

### Phase 2：Robot_H5 切换到包

```bash
pnpm add @robot/h5-core
```

```diff
- import { useCamera } from '@/hooks/useCamera';
+ import { useCamera } from '@robot/h5-core/hooks';
```

用 IDE 全局替换 `@/hooks/use` → `@robot/h5-core/hooks/use`，一次性完成。

### Phase 3：多项目接入

各业务 H5 项目独立安装使用，按需锁版本：

```json
{
    "dependencies": {
        "@robot/h5-core": "^0.3.0"
    }
}
```

---

## 关联图

```
┌─────────────────────────────────────────────────┐
│                   业务 H5 项目                    │
│  (生产管理 / 设备管理 / 物流管理 / 安全管理 ...)     │
│                                                   │
│  import { useCamera } from '@robot/h5-core/hooks' │
│  import { compressImage } from '@robot/h5-core'   │
└───────────────────────┬─────────────────────────┘
                        │  pnpm add
                        ▼
┌─────────────────────────────────────────────────┐
│              @robot/h5-core (npm 包)              │
│                                                   │
│  hooks/    ← Vue 3 Composable (14 个)             │
│  bridge/   ← 宿主适配层 (4 个适配器)               │
│  utils/    ← 纯函数工具 (14 个函数)                │
│  types/    ← TypeScript 类型声明                   │
└───────────────────────┬─────────────────────────┘
                        │  peerDependency
                        ▼
                    vue >= 3.3
```

---

**PROPRIETARY** — 内部私有文档。© Robot H5. All rights reserved.
