import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { configAutoImportPlugin } from './autoImport';
import { configAutoComponentsPlugin } from './autocomponents';
import { configCompressPlugin } from './compress';
import { configVisualizerConfig } from './visualizer';
import { configProgressPlugin } from './progress';
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

    // 自动按需引入组件
    vitePlugins.push(configAutoComponentsPlugin());

    // 自动按需引入依赖
    vitePlugins.push(configAutoImportPlugin());

    // mock数据（仅 VITE_USE_MOCK=true 时加载，生产构建完全跳过）
    if (VITE_USE_MOCK) {
        vitePlugins.push(configMockPlugin(isBuild));
    }

    // svgIcon
    vitePlugins.push(configSvgIconsPlugin(isBuild));

    // 加载 html 插件 vite-plugin-html
    vitePlugins.push(configHtmlPlugin(viteEnv));

    // PWA 支持
    vitePlugins.push(
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['logo.svg'],
            manifest: {
                name: 'Robot H5',
                short_name: 'Robot',
                description: 'Robot H5 移动端应用框架',
                theme_color: '#0071E3',
                background_color: '#F5F5F7',
                display: 'standalone',
                start_url: '.',
            },
            workbox: {
                // 不缓存 index.html，让浏览器始终从网络获取最新版本
                // 避免 SW 更新时旧 index.html 请求已过期的 JS hash 路径导致 MIME 错误
                globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
                // 清理旧版本 SW 缓存
                cleanupOutdatedCaches: true,
                // 大文件阈值（echarts 等大依赖可能超过默认 2MB）
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
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
        // 构建时显示进度条
        vitePlugins.push(configProgressPlugin());
        // 打包分析 rollup-plugin-visualizer
        vitePlugins.push(configVisualizerConfig());
        // 开启 gzip 压缩
        vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));
    }

    return vitePlugins;
}
