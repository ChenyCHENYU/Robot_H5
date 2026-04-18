# C_Icon — 通用图标组件

> 统一封装 Iconify / UnoCSS / SVG 三种图标方案，提供一致的 API。

## 基本用法

```vue
<!-- Iconify 模式（默认） -->
<C_Icon name="ph:house-bold" :size="20" color="var(--ds-accent)" />

<!-- UnoCSS 模式 -->
<C_Icon name="i-ph:gear-bold" type="unocss" :size="18" />

<!-- SVG 模式 -->
<C_Icon name="logo" type="svg" :size="24" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | — | **必填**，图标名称 |
| `type` | `'iconify' \| 'unocss' \| 'svg'` | `'iconify'` | 图标类型 |
| `color` | `string` | `'currentColor'` | 颜色（支持 CSS 值） |
| `size` | `number \| string` | `18` | 尺寸（px） |
| `clickable` | `boolean` | `false` | 是否可点击 |
| `rotate` | `0 \| 1 \| 2 \| 3` | `0` | 旋转（0°/90°/180°/270°） |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | — | 翻转方向 |
| `customClass` | `string` | `''` | 自定义 CSS 类 |

## Events

| 事件 | 说明 |
|------|------|
| `click` | 点击事件（仅 `clickable=true` 时触发） |

## 图标类型选择指南

| 场景 | 推荐类型 | 说明 |
|------|---------|------|
| 模板中静态图标 | `unocss` | 编译时生成 CSS，零运行时开销 |
| 动态图标名 | `iconify` | 运行时渲染，支持动态切换 |
| 品牌/自定义图标 | `svg` | 放 `src/assets/svgs/` 下 |

## 注意

- UnoCSS 图标在 `data.ts` 动态引用时，类名**必须**加入 `uno.config.ts` 的 `safelist`
- Iconify 图标已通过 `src/plugins/iconify.ts` 预注册到运行时，无 CDN 请求
