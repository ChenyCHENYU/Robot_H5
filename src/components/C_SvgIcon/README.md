# C_SvgIcon — SVG 雪碧图标组件

> 基于 `vite-plugin-svg-icons` 的 SVG 雪碧图渲染组件。

## 基本用法

```vue
<C_SvgIcon name="logo" :size="24" color="#333" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | — | **必填**，SVG 文件名（对应 `src/assets/svgs/{name}.svg`） |
| `prefix` | `string` | `'icon'` | 符号 ID 前缀 |
| `size` | `number \| string` | `16` | 尺寸（px） |
| `color` | `string` | `'#333'` | 填充颜色 |

## 注意

- SVG 文件放置在 `src/assets/svgs/` 目录下
- 推荐优先使用 `C_Icon` 组件（统一 API），仅在需要自定义 SVG 时直接使用本组件
