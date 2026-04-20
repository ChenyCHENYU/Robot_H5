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
    // 将工具类输出到 @layer utilities；preflights 不包层（用于输出 @layer 顺序声明）
    // vite.config.ts 中组件 SCSS 被包裹进 @layer components
    // @layer components, utilities → utilities 排后 = 优先级更高 → 工具类覆盖组件SCSS ✅
    // important: '#app' 额外提升选择器优先级，双重保障
    // preflights(reset) → @layer base（最低）
    // 组件SCSS → @layer components（中）（vite.config.ts additionalData 包裹）
    // 工具类 → @layer utilities（最高）
    // 层顺序声明在 index.html <style>@layer base, components, utilities;</style>
    outputToCssLayers: {
        cssLayerName: (layer) => (layer === 'preflights' ? 'base' : 'utilities'),
    },
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

  // 层顺序声明已移至 index.html，不再需要自定义 preflight
  // presetWind3 自带 preflight（normalize/reset），会进入 @layer base
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
  ],
});
