# C_NavBar — 导航栏组件

> 基于 VanNavBar 封装，固定顶部 + 毛玻璃背景 + 圆形返回按钮，支持原生 Bridge 返回。

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

- 点击左侧返回按钮 → 调用 `JsCallNative.back()`（优先原生返回，降级 `router.back()`）
- 固定顶部定位 + `placeholder` 占位
- 毛玻璃背景 `backdrop-filter: blur(20px) saturate(180%)`
- 亮/暗模式自动适配

## 规范

- **必须**作为页面级组件的第一个子元素
- 标题文字建议 ≤ 8 个汉字
