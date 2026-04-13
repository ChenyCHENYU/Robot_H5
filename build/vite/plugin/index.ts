import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import UnoCSS from 'unocss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { configAutoImportPlugin } from './autoImport';
import { configAutoComponentsPlugin } from './autocomponents';
import { configCompressPlugin } from './compress';
import { configVisualizerConfig } from './visualizer';
import { configProgressPlugin } from './progress';
import { configLegacyPlugin } from './legacy';
import { configSvgIconsPlugin } from './svgSprite';
import { configMockPlugin } from './mock';
import { configHtmlPlugin } from './injectHtml';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
    const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

    const vitePlugins: (Plugin | Plugin[])[] = [
        // vue支持
        vue(),
        // JSX支持
        vueJsx({
            include: /\.(jsx|tsx)/,
        }),
        // UnoCSS支持
        UnoCSS(),
    ];

    // 开发模式下 eslint 在编辑器中校验即可，不阻塞 HMR
    if (isBuild) {
        vitePlugins.push(eslintPlugin());
    }

    // 自动按需引入组件
    vitePlugins.push(configAutoComponentsPlugin());

    // 自动按需引入依赖
    vitePlugins.push(configAutoImportPlugin());

    // mock数据
    vitePlugins.push(configMockPlugin(VITE_USE_MOCK, isBuild));

    // svgIcon
    vitePlugins.push(configSvgIconsPlugin(isBuild));

    // 加载 html 插件 vite-plugin-html
    vitePlugins.push(configHtmlPlugin(viteEnv));

    // PWA 支持
    vitePlugins.push(
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico'],
            manifest: {
                name: '金恒 H5',
                short_name: '金恒',
                description: '金恒敏捷团队 H5 应用模版',
                theme_color: '#0071E3',
                background_color: '#F5F5F7',
                display: 'standalone',
                start_url: '.',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                ],
            },
            workbox: {
                // 缓存所有静态资源
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                // 运行时缓存 API 请求
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\./i,
                        handler: 'NetworkFirst',
                        options: { cacheName: 'api-cache', expiration: { maxEntries: 50, maxAgeSeconds: 300 } },
                    },
                ],
            },
        }),
    );

    if (isBuild) {
        // es兼容性支持 (仅构建时需要)
        vitePlugins.push(configLegacyPlugin());
        // 构建时显示进度条
        vitePlugins.push(configProgressPlugin());
        // 打包分析 rollup-plugin-visualizer
        vitePlugins.push(configVisualizerConfig());
        // 开启 gzip 压缩
        vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));
    }

    return vitePlugins;
}
