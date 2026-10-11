import type { Plugin } from 'postcss';

/** 字号按同一个令牌缩放，保留原声明作为旧 WebView 回退。 */
export function fontScalePlugin(): Plugin {
    return {
        postcssPlugin: 'robot-h5:font-scale',
        Once(root) {
            root.walkDecls('font-size', declaration => {
                const {value} = declaration;
                if (/--ds-font-scale|inherit|initial|unset|revert|em\b/.test(value) || !/\d|var\(/.test(value)) return;
                const rule = declaration.parent;
                if (rule?.type === 'rule' && /(?:c-icon|__icon|i-ph|i-ic|van-icon)/.test(rule.selector)) return;
                declaration.cloneAfter({ value: `calc(${value} * var(--ds-font-scale, 1))` });
            });
        },
    };
}
