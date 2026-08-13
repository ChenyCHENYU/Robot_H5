# PDA 与旧 WebView 兼容规范

Robot_H5 `v1.7.0+` 已将已验证的 PDA 兼容方式固化进模板，业务项目不需要在 wl-mbase 基座注入 CSS，也不需要判断具体设备型号。

## 默认保障

| 层级 | 模板约束 | 目的 |
| --- | --- | --- |
| JavaScript | Vite `target: es2018` | 避免旧 WebView 遇到未降级语法而白屏 |
| CSS 压缩 | `cssTarget: chrome61` | 避免生成 Android WebView 不识别的颜色格式 |
| 样式组织 | 禁止 `@layer`，UnoCSS 使用 `important: '#app'` | 防止旧内核丢弃整个组件样式块 |
| 尺寸适配 | px 转换使用 vw + 媒体查询 | 不依赖 `min()/max()` 才能限制宽度 |
| 新 CSS | 先写旧值，再写 `dvh/color-mix` 等增强值 | 新旧设备都能显示，现代设备效果更好 |
| 定位缩写 | PostCSS 自动把单值 `inset` 补成 `top/right/bottom/left` | 旧内核仍能正确铺满浮层和加载壳 |

不引入整套 legacy polyfill：当前支持下限仍具备原生 ES Module、动态 import 和 `import.meta`。如实机连这些能力也不支持，应升级 Android System WebView；只有确认无法升级且仍需支持时，才评估 `@vitejs/plugin-legacy`，避免无条件增加所有终端包体和启动成本。

模板仍使用 Flex `gap`。它在目标 PDA 实机链路中已验证；更老内核不支持时通常只损失间距，不会造成整页样式消失。不要全局加入会重写 126 处布局的 gap polyfill；遇到具体设备问题时，优先升级 WebView，或仅对关键业务组件用子元素 margin 做局部回退。

## 开发规则

```scss
// 正确：旧值先行，现代值渐进增强。
.page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--ds-accent-light);
  background: color-mix(in srgb, var(--ds-accent) 10%, transparent);
}
```

- 不使用 `@layer` 包裹业务样式。
- 玻璃模糊失败时仍必须有设计令牌背景，不得只依赖 `backdrop-filter`。
- 不根据 Android 版本猜 WebView 能力；PDA 上记录 Android System WebView/Chrome 内核版本后真机验证。
- 不在 wl-mbase 中跨 iframe 注入业务 CSS。样式兼容属于子应用及模板构建责任。

## 验证

```bash
pnpm type-check
pnpm build:integrated
pnpm test:compat
```

真机至少检查：登录、首页、列表、详情、表单、弹窗、固定底栏、横竖屏、软键盘抬起、返回与重新进入。浏览器开发者工具中确认 CSS/JS 均为 200，控制台无语法错误，页面产物不含 `@layer`。
