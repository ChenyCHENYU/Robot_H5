# C_NavBar — 导航栏组件

> 基于 VanNavBar 封装，固定顶部 + 毛玻璃背景 + 圆形返回按钮，并自动适配 wl-mbase 托管状态。

## 基本用法

```vue
<template>
  <C_NavBar title="客户详情" />
</template>
```

自动读取路由 `meta.title` 作为标题（也可通过 `title` prop 覆盖）。

## 带右侧插槽

```vue
<template>
  <C_NavBar title="客户列表">
    <template #right>
      <i class="i-ph:funnel-bold text-16px" @click="openFilter" />
    </template>
  </C_NavBar>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `''` | 标题文字（为空时取 `route.meta.title`） |

## Slots

| 插槽名 | 说明 |
|--------|------|
| `right` | 右侧自定义内容（如筛选图标、更多按钮） |

## 行为

- 独立运行时点击左侧返回按钮 → `router.back()`
- wl-mbase 托管时隐藏整个子应用导航栏（含 placeholder），标题由路由 `meta.title` 自动交给基座
- App/PDA 的原生返回由 `src/platform/mbase/navigation.ts` 接管，禁止页面直调原生 WebView
- 固定顶部定位 + `placeholder` 占位
- 毛玻璃背景 `backdrop-filter: blur(20px) saturate(180%)`
- 亮/暗模式自动适配

## 规范

- **必须**作为页面级组件的第一个子元素
- 标题文字建议 ≤ 8 个汉字
- 每个页面必须配置准确的 `route.meta.title`；Tab 根页必须配置 `meta.mbaseRoot: true`
- 右侧重要业务按钮不能只放在导航栏插槽中，否则基座托管时会随子导航一起隐藏
