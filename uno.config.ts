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
                display: 'inline-block',
                'vertical-align': 'middle',
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

    // 一些实用的自定义组合
    shortcuts: {
        // 用于设置元素的外边距为0并居中对齐
        'm-0-auto': 'm-0 ma',
        // 用于设置元素的宽度和高度均为100%
        'wh-full': 'w-full h-full',
        // 用于设置元素为flex布局并居中对齐
        'flex-center': 'flex justify-center items-center',
        // 用于设置元素为flex布局并水平居中对齐
        'flex-x-center': 'flex justify-center',
        // 用于设置元素为flex布局并垂直居中对齐
        'flex-y-center': 'flex items-center',
        // 用于设置文本溢出隐藏并显示省略号
        'text-overflow': 'overflow-hidden whitespace-nowrap text-ellipsis',
        // 用于设置文本换行和断行特性
        'text-break': 'whitespace-normal break-all break-words',
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
        'i-ph:house-bold',
        'i-ph:squares-four-bold',
        'i-ph:chart-bar-bold',
        'i-ph:user-bold',
        // Mine 页面图标
        'i-ph:shield-check-bold',
        'i-ph:palette-bold',
        'i-ph:info-bold',
        'i-ph:sign-out-bold',
        'i-ph:caret-right-bold',
        // Dashboard 图标
        'i-ph:sparkle-bold',
        'i-ph:quotes-bold',
        'i-ph:lightning-bold',
        'i-ph:paint-brush-bold',
        'i-ph:database-bold',
        'i-ph:chart-line-bold',
        'i-ph:image-bold',
        // Demo 页面图标
        'i-ph:moon-bold',
        'i-ph:bug-bold',
        'i-ph:arrows-counter-clockwise-bold',
        'i-ph:warning-bold',
        'i-ph:terminal-bold',
        'i-ph:package-bold',
        'i-ph:scroll-bold',
        'i-ph:list-bold',
        // NavBar
        'i-ic:sharp-arrow-back-ios',
        // Logo
        'i-ph:rocket-launch-bold',
        // Dashboard 设置快捷入口
        'i-ph:gear-bold',
    ],
});
