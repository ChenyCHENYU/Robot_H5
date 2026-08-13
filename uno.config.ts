import { defineConfig, presetAttributify, presetTypography, presetWind3 } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import presetRemToPx from '@unocss/preset-rem-to-px';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirectives from '@unocss/transformer-directives';

/**
 * UnoCSS 配置
 * @see https://unocss.dev/
 * @see https://unocss-cn.pages.dev/
 */
export default defineConfig({
    // 不输出 CSS Cascade Layers：部分 PDA 的旧 WebView 会丢弃整个 @layer 规则块。
    // 通过 #app 提升 UnoCSS 选择器优先级，仍能覆盖组件默认样式。
    important: '#app',
    presets: [
    /**
     * UnoCSS 预设
     * @see https://unocss.dev/presets/
     */
    presetWind3(),

    /**
     * rem转px预设 (unoCss默认单位为rem,模版使用vw/vh适配，需要转成px，然后由postcss把px转成 vw/vh)
     * @see https://unocss-cn.pages.dev/presets/rem-to-px
     */
    presetRemToPx({
      baseFontSize: 16,
    }),

    /**
     * 图标预设
     * @see https://unocss-cn.pages.dev/presets/icons
     * 可用图标库
     * @see https://icones.js.org/
     * @see https://icon-sets.iconify.design/
     */
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),

    /**
     * 属性模式（class过多时可启用）
     * @see https://unocss-cn.pages.dev/presets/attributify#attributify-mode
     * */
    presetAttributify(),

    /**
     * 文字排版预设
     * @see https://unocss-cn.pages.dev/presets/typography
     */
    presetTypography(),
  ],
  transformers: [
    /**
     * 启用 UnoCSS 的变体组功能(用法简写)
     * @see https://unocss-cn.pages.dev/transformers/variant-group
     */
    transformerVariantGroup(),
    /**
     * 启用样式里也可以使用原子化
     * @see https://unocss-cn.pages.dev/transformers/directives
     */
    transformerDirectives(),
  ],

  // 项目使用 common.scss 管理全局基础样式，避免额外 reset 改变存量页面。
  preflights: [],

  // 一些实用的自定义组合
  shortcuts: {
    "m-0-auto": "m-0 ma",
    // 用于设置元素的宽度和高度均为100%
    "wh-full": "w-full h-full",
    // 用于设置元素为flex布局并居中对齐
    "flex-center": "flex justify-center items-center",
    // 用于设置元素为flex布局并水平居中对齐
    "flex-x-center": "flex justify-center",
    // 用于设置元素为flex布局并垂直居中对齐
    "flex-y-center": "flex items-center",
    // 用于设置文本溢出隐藏并显示省略号
    "text-overflow": "overflow-hidden whitespace-nowrap text-ellipsis",
    // 用于设置文本换行和断行特性
    "text-break": "whitespace-normal break-all break-words",
  },

  // 确保 .ts 数据文件中的动态类名也能被扫描提取
  content: {
    pipeline: {
      include: [/\.(vue|ts|tsx|jsx|html)($|\?)/],
    },
  },

  // 指定始终要生成的 css 类（动态拼接 / 数据文件中使用的图标）
  safelist: [
    // Tabbar 图标
    "i-ph:house-bold",
    "i-ph:squares-four-bold",
    "i-ph:browsers-bold",
    "i-ph:atom-bold",
    "i-ph:user-bold",
    // Mine 页面图标
    "i-ph:shield-check-bold",
    "i-ph:palette-bold",
    "i-ph:info-bold",
    "i-ph:sign-out-bold",
    "i-ph:caret-right-bold",
    // Dashboard 图标
    "i-ph:sparkle-bold",
    "i-ph:quotes-bold",
    "i-ph:lightning-bold",
    "i-ph:paint-brush-bold",
    "i-ph:database-bold",
    "i-ph:chart-line-bold",
    "i-ph:image-bold",
    // Demo 页面图标
    "i-ph:moon-bold",
    "i-ph:bug-bold",
    "i-ph:arrows-counter-clockwise-bold",
    "i-ph:warning-bold",
    "i-ph:terminal-bold",
    "i-ph:package-bold",
    "i-ph:scroll-bold",
    "i-ph:list-bold",
    "i-ph:chart-bar-bold",
    "i-ph:stack-bold",
    "i-ph:hand-swipe-right-bold",
    "i-ph:layout-bold",
    "i-ph:note-pencil-bold",
    "i-ph:table-bold",
    "i-ph:address-book-bold",
    // NavBar
    "i-ic:sharp-arrow-back-ios",
    // Logo
    "i-ph:rocket-launch-bold",
    // Dashboard 设置快捷入口
    "i-ph:gear-bold",
    // Template 领域图标
    "i-ph:buildings-bold",
    "i-ph:wrench-bold",
    "i-ph:truck-bold",
    "i-ph:scales-bold",
    "i-ph:shield-warning-bold",
    "i-ph:leaf-bold",
    "i-ph:video-camera-bold",
    "i-ph:seal-check-bold",
    "i-ph:megaphone-bold",
    // Hooks 演示页图标
    "i-ph:camera-bold",
    "i-ph:film-strip-bold",
    "i-ph:microphone-bold",
    "i-ph:map-pin-bold",
    "i-ph:qr-code-bold",
    "i-ph:contactless-payment-bold",
    "i-ph:cloud-arrow-up-bold",
    "i-ph:cloud-arrow-down-bold",
    "i-ph:eye-bold",
    "i-ph:bluetooth-bold",
    "i-ph:bell-bold",
    "i-ph:key-bold",
    "i-ph:pen-nib-bold",
    "i-ph:drop-bold",
    "i-ph:broadcast-bold",
    "i-ph:clipboard-bold",
    "i-ph:clipboard-text-bold",
    // File Preview 文件类型图标
    "i-ph:file-pdf-bold",
    "i-ph:file-xls-bold",
    "i-ph:file-doc-bold",
    "i-ph:file-ppt-bold",
    "i-ph:music-note-bold",
    "i-ph:file-text-bold",
    "i-ph:brackets-curly-bold",
  ],
});
