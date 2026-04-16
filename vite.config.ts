import { defineConfig, loadEnv, type UserConfig, type ConfigEnv } from 'vite';
import { getNowTime, pathResolve, wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { createProxy } from './build/vite/proxy';
import { createBuild } from './build/vite/build';
import autoprefixer from 'autoprefixer';
import { postcssPxToViewProtConfig } from './build/vite/plugin/postcssPxToView';
import pkg from './package.json';

// 应用信息
const __APP_INFO__ = {
    pkg,
    lastBuildTime: getNowTime(),
};

/**
 * https://vite.dev/config/
 * @type {import('vite').UserConfig}
 * @param command dev/serve || build 命令模式
 * @param mode development || production 环境模式
 * */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
    // 当前工作目录
    const root = process.cwd();
    // 是否是构建 (dev/serve 或 build)
    const isBuild = command === 'build';
    // 加载env环境 (root目录下的 .env开头的环境文件)
    const env = loadEnv(mode, root);
    // 将env环境变量转换为对象
    const viteEnv = wrapperEnv(env);

    const { VITE_PUBLIC_PATH, VITE_PORT } = viteEnv;

    return {
        base: VITE_PUBLIC_PATH,
        root,
        plugins: createVitePlugins(viteEnv, isBuild),
        resolve: {
            alias: [
                {
                    find: '@',
                    replacement: pathResolve('src'),
                },
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // @ts-expect-error
                    api: 'modern-compiler',
                    // src/ 下的组件 SCSS 自动包裹进 @layer components
                    // UnoCSS 工具类在 @layer utilities（后声明 = 高优先级）
                    // 这样工具类能覆盖组件 SCSS，彻底修复级联冲突
                    additionalData: (content: string, id: string) => {
                        const use = `@use "@/styles/index.scss" as *;\n`;
                        if (id.includes('/src/') && id.endsWith('.scss') && !id.includes('/src/styles/')) {
                            return `${use}@layer components {\n${content}\n}`;
                        }
                        return `${use}${content}`;
                    },
                },
            },
            postcss: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist: ['Chrome >= 87', 'Firefox >= 78', 'Safari >= 14', 'Edge >= 88'],
                    }),
                    postcssPxToViewProtConfig(),
                ],
            },
        },
        server: {
            host: true,
            open: true,
            hmr: true, // 开启热更新
            port: Number(VITE_PORT),
            proxy: createProxy(viteEnv.VITE_PROXY),
            // 预热文件以降低启动期间的初始页面加载时长（** 匹配所有层级子文件）
            warmup: {
                clientFiles: [
                    './index.html',
                    './src/main.ts',
                    './src/App.vue',
                    './src/{views,components}/**/*.vue',
                    './src/styles/**/*.scss',
                ],
            },
        },
        build: createBuild(viteEnv),
        esbuild: {
            // 使用esbuild来构建去掉console和debugger，
            drop: mode === 'production' ? ['console', 'debugger'] : [],
        },
        define: {
            __APP_INFO__: JSON.stringify(__APP_INFO__),
        },
        // 预优化依赖，避免首次访问时 Vite 发现新依赖触发 "reloading"
        optimizeDeps: {
            include: [
                'vue',
                'vue-router',
                'pinia',
                // Iconify 运行时 + 本地图标集（避免首屏 CDN 请求）
                '@iconify/vue',
                '@iconify-json/ph/icons.json',
                '@iconify-json/ic/icons.json',
                '@iconify-json/mdi/icons.json',
                '@iconify-json/bxs/icons.json',
                '@iconify-json/carbon/icons.json',
                '@iconify-json/iconamoon/icons.json',
                '@iconify-json/mage/icons.json',
                '@iconify-json/mingcute/icons.json',
                '@iconify-json/tabler/icons.json',
                // Vant 组件样式（按需引入时 Vite 首次遇到会重新优化，预先声明避免页面闪烁）
                'vant/es/config-provider/style/index',
                'vant/es/tabbar/style/index',
                'vant/es/tabbar-item/style/index',
                'vant/es/nav-bar/style/index',
                'vant/es/button/style/index',
                'vant/es/cell/style/index',
                'vant/es/cell-group/style/index',
                'vant/es/field/style/index',
                'vant/es/form/style/index',
                'vant/es/image/style/index',
                'vant/es/list/style/index',
                'vant/es/pull-refresh/style/index',
                'vant/es/tag/style/index',
                'vant/es/loading/style/index',
                'vant/es/empty/style/index',
                'vant/es/switch/style/index',
                'vant/es/action-sheet/style/index',
                'vant/es/popup/style/index',
                'vant/es/picker/style/index',
                'vant/es/toast/style/index',
                'vant/es/dialog/style/index',
                'vant/es/notify/style/index',
                'vant/es/uploader/style/index',
                'vant/es/checkbox/style/index',
                'vant/es/checkbox-group/style/index',
                'vant/es/radio/style/index',
                'vant/es/radio-group/style/index',
                'vant/es/slider/style/index',
                'vant/es/stepper/style/index',
                'vant/es/steps/style/index',
                'vant/es/step/style/index',
                'vant/es/skeleton/style/index',
                'vant/es/skeleton-title/style/index',
                'vant/es/skeleton-image/style/index',
                'vant/es/skeleton-paragraph/style/index',
                'vant/es/divider/style/index',
                'vant/es/collapse/style/index',
                'vant/es/collapse-item/style/index',
                'vant/es/progress/style/index',
                'vant/es/circle/style/index',
                'vant/es/sticky/style/index',
            ],
        },
    };
});
