import type { Plugin } from 'postcss';

/**
 * 为旧 Android WebView 补充可安全降级的 CSS 物理属性。
 * 保留原声明供新内核使用；旧内核忽略 inset 后仍可按四边定位。
 */
export function postcssLegacyFallbacks(): Plugin {
    return {
        postcssPlugin: 'robot-h5-legacy-fallbacks',
        Declaration(declaration) {
            if (declaration.prop !== 'inset' || /\s/.test(declaration.value.trim())) return;
            for (const property of ['top', 'right', 'bottom', 'left']) {
                declaration.cloneBefore({ prop: property, value: declaration.value });
            }
        },
    };
}
