/**
 * @name configCdnImportPlugin
 * @description 生产环境配置cdn
 * UNPKG：https://unpkg.com
 * jsDelivr ：https://www.jsdelivr.com
 */
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
export const configCdnImportPlugin = () => {
    return importToCDN({
        modules: [
            'vue',
            'vue-router',
            // 'axios',
            {
                name: 'vue-demi',
                var: 'VueDemi',
                path: `https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/lib/index.iife.min.js`,
            },
            {
                name: 'pinia',
                var: 'Pinia',
                path: `https://cdn.jsdelivr.net/npm/pinia@2.2.5/dist/pinia.iife.min.js`,
            },
            {
                name: 'vant',
                var: 'vant',
                path: 'https://cdn.jsdelivr.net/npm/vant/lib/vant.min.js',
                css: 'https://cdn.jsdelivr.net/npm/vant/lib/index.min.css',
            },
        ],
    });
};
