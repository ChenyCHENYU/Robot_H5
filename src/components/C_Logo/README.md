# C_Logo — 品牌 Logo 组件

> iOS App 图标风格圆角方块徽标，含环境光晕、玻璃高光、立体渐变。

## 基本用法

```vue
<C_Logo :size="56" />
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `number` | `56` | Logo 尺寸（px） |

## 替换为图片

将 `logo__inner` 内容替换为 `<img>` 标签即可：

```vue
<div class="logo__inner">
  <img class="logo__img" src="your-logo.png" />
</div>
```

## 特性

- 亮/暗模式自适应渐变
- 环境光晕脉冲动画
- 顶部半椭圆高光 + 左上角镜面光斑
- 标准 iOS 圆角率 22.5%
