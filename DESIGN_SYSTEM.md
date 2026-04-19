# 设计系统规范

> 基于 Apple HIG (Human Interface Guidelines) Liquid Glass 设计语言，融合 Linear 现代工具美学。
>
> **所有颜色、圆角、阴影必须通过 `var(--ds-xxx)` 引用，禁止硬编码。**

---

## 设计原则

1. **克制** — Less is more，去除一切不必要的装饰
2. **层次** — 通过字重、色深、间距构建信息层级
3. **一致** — 全局使用设计令牌，不允许硬编码色值和字号
4. **呼吸** — 充足的留白，内容永远不拥挤

---

## 颜色令牌

### 亮色模式（:root）

| 令牌 | 值 | 用途 |
|------|------|------|
| `--ds-bg` | #FFFFFF | 页面背景 |
| `--ds-bg-secondary` | #F5F5F7 | 卡片/输入框背景 |
| `--ds-bg-tertiary` | #E8E8ED | 悬停/按压态 |
| `--ds-surface` | #FFFFFF | 浮层背景 |
| `--ds-text-primary` | #1D1D1F | 标题、正文 |
| `--ds-text-secondary` | #6E6E73 | 描述、标签 |
| `--ds-text-tertiary` | #AEAEB2 | 占位符、注释 |
| `--ds-accent` | #0071E3 | 主操作按钮（Apple 蓝） |
| `--ds-accent-hover` | #0077ED | 悬停态 |
| `--ds-accent-light` | rgba(0,113,227,0.08) | 浅色强调背景 |
| `--ds-success` | #34C759 | 成功/完成 |
| `--ds-warning` | #FF9500 | 警告/注意 |
| `--ds-danger` | #FF3B30 | 危险/删除 |
| `--ds-border` | rgba(0,0,0,0.08) | 边框 |
| `--ds-divider` | rgba(0,0,0,0.05) | 分割线 |

### 暗色模式（html.dark）

| 令牌 | 值 |
|------|------|
| `--ds-bg` | #000000 |
| `--ds-bg-secondary` | #1C1C1E |
| `--ds-bg-tertiary` | #2C2C2E |
| `--ds-surface` | #1C1C1E |
| `--ds-text-primary` | #F5F5F7 |
| `--ds-text-secondary` | #98989D |
| `--ds-text-tertiary` | #636366 |
| `--ds-accent` | #0A84FF |
| `--ds-accent-hover` | #409CFF |
| `--ds-accent-light` | rgba(10,132,255,0.12) |
| `--ds-border` | rgba(255,255,255,0.1) |
| `--ds-divider` | rgba(255,255,255,0.06) |

---

## 毛玻璃令牌（Liquid Glass）

> Apple iOS 26 风格毛玻璃效果，自动适配亮/暗模式。

| 令牌 | 亮色值 | 暗色值 | 用途 |
|------|--------|--------|------|
| `--ds-glass-bg` | rgba(255,255,255,0.52) | rgba(30,30,35,0.68) | 毛玻璃背景 |
| `--ds-glass-border` | rgba(255,255,255,0.82) | rgba(255,255,255,0.13) | 毛玻璃边框 |
| `--ds-glass-blur` | 40px | 40px | 模糊半径 |
| `--ds-glass-saturate` | 210% | — | 饱和度 |
| `--ds-glass-shine` | `inset 0 1px 0 rgba(255,255,255,0.95), ...` | `inset 0 1px 0 rgba(255,255,255,0.18), ...` | 顶部/侧面高光 |
| `--ds-glass-shadow` | `0 8px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)` | `0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)` | 外阴影 |
| `--ds-glass-gradient` | `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 60%)` | `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 60%)` | 液态渐变叠层 |

### 毛玻璃卡片用法

```scss
.my-page__card {
    background: var(--ds-glass-bg);
    backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate));
    -webkit-backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate));
    border: 1px solid var(--ds-glass-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-glass-shine), var(--ds-glass-shadow);
}
```

---

## 字体

```css
font-family: var(--ds-font);
/* -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif */
```

### 字号梯度（移动端）

| 级别 | 大小 | 字重 |
|------|------|------|
| 大标题 | 34px | Bold |
| 标题 1 | 28px | Bold |
| 标题 2 | 22px | Bold |
| 标题 3 | 20px | Semibold |
| 导航标题 | 17px | Semibold |
| 正文 | 17px | Regular |
| 标注 | 16px | Regular |
| 副标题 | 15px | Regular |
| 脚注 | 13px | Regular |
| 说明文字 | 11px | Regular |

> 直接写 `px`，postcss-mobile-forever 自动转换为 vw（基准 375px）。

---

## 间距（4px 网格）

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`

使用 UnoCSS 原子类：`p-4`(4px)、`m-8`(8px)、`gap-16`(16px) 等。

---

## 圆角

| 级别 | 值 | CSS 变量 | 用途 |
|------|------|----------|------|
| 小 | 8px | `--ds-radius-sm` | 按钮、输入框 |
| 中 | 12px | `--ds-radius-md` | 卡片 |
| 大 | 16px | `--ds-radius-lg` | 对话框、大卡片 |
| 超大 | 20px | `--ds-radius-xl` | 底部弹出层 |
| 全圆 | 9999px | `--ds-radius-full` | 头像、徽章 |

---

## 阴影

| 级别 | 值 | CSS 变量 |
|------|------|----------|
| 一层 | `0 1px 3px rgba(0,0,0,0.06)` | `--ds-shadow-1` |
| 二层 | `0 4px 12px rgba(0,0,0,0.08)` | `--ds-shadow-2` |
| 三层 | `0 8px 24px rgba(0,0,0,0.12)` | `--ds-shadow-3` |

暗色模式自动使用更深的阴影值（`rgba(0,0,0,0.2~0.3)` 系列）。

---

## 动画

| 属性 | 值 |
|------|------|
| 时长 | 200ms ~ 300ms |
| 标准缓动 | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| 弹性缓动 | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

原则：不闪烁、不跳跃；所有过渡使用 `transition` 而非 `animation`（除非需要循环）。

---

## 令牌实现文件

| 文件 | 说明 |
|------|------|
| `src/styles/variables.scss` | 所有 CSS 自定义属性声明（:root + html.dark） |
| `src/styles/theme.scss` | 主题系统 + getVar() 兼容函数 |
| `src/hooks/useTheme/index.ts` | 主题切换 Hook（亮/暗模式 + Vant 变量同步） |
| `uno.config.ts` | UnoCSS 快捷方式 + @layer 映射 |

---

## 使用规范

### 正确

```scss
.my-component {
    color: var(--ds-text-primary);
    background: var(--ds-glass-bg);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-2);
}
```

### 错误

```scss
// 禁止硬编码
.my-component {
    color: #1d1d1f;
    background: rgba(255, 255, 255, 0.52);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

---

**PROPRIETARY** — 内部私有项目设计规范。
