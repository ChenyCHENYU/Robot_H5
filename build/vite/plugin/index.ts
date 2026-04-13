import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import UnoCSS from 'unocss/vite';
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
