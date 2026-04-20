import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
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

    // PWA 已禁用 — Vercel CDN 自带缓存，SW 在频繁部署阶段反而导致 MIME 错误
    // 后续稳定后可重新启用 vite-plugin-pwa

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
