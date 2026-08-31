import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv, type UserConfig, type ConfigEnv, type Plugin } from 'vite';
import { getNowTime, pathResolve, wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { createProxy } from './build/vite/proxy';
import { createBuild } from './build/vite/build';
import autoprefixer from 'autoprefixer';
import { postcssPxToViewProtConfig } from './build/vite/plugin/postcssPxToView';
import { postcssLegacyFallbacks } from './build/vite/plugin/postcssLegacyFallbacks';
import pkg from './package.json';

interface BuildEnvironmentDefinition {
    label: string;
    mode: string;
    aliases: string[];
    branches: string[];
}

interface BuildEnvironmentDocument {
    environments: Record<string, BuildEnvironmentDefinition>;
}

const buildEnvironmentDocument = JSON.parse(
    readFileSync(new URL('./build/environments.json', import.meta.url), 'utf8'),
) as BuildEnvironmentDocument;

const readGitValue = (args: string[]): string => {
    try {
        return execFileSync('git', args, {
            cwd: process.cwd(),
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
    } catch {
        return '';
    }
};

const detectBuildBranch = (): string => {
    const branch = [
        process.env.CI_COMMIT_REF_NAME,
        process.env.CI_COMMIT_BRANCH,
        process.env.BRANCH_NAME,
        process.env.GITHUB_HEAD_REF,
        process.env.GITHUB_REF_NAME,
        process.env.BUILD_SOURCEBRANCHNAME,
        process.env.GIT_LOCAL_BRANCH,
        process.env.GIT_BRANCH,
        readGitValue(['rev-parse', '--abbrev-ref', 'HEAD']),
    ].find(value => String(value || '').trim());
    return String(branch || '')
        .trim()
        .replace(/^refs\/heads\//, '')
        .replace(/^refs\/remotes\//, '')
        .replace(/^(origin|gitee)\//, '');
};

const firstNonEmpty = (...values: Array<string | undefined>): string =>
    String(values.find(value => String(value || '').trim()) || '').trim();

/** 输出 `YYYY-MM-DD HH:mm:ss` 格式的中国标准时间。 */
const formatChinaTimestamp = (value = new Date()): string => {
    const chinaTime = new Date(value.getTime() + 8 * 60 * 60 * 1000);
    return chinaTime.toISOString().slice(0, 19).replace('T', ' ');
};

const createBuildIdentity = (
    environmentName: string,
    environment: BuildEnvironmentDefinition,
    viteEnv: ViteEnv,
) => ({
    schemaVersion: 1,
    application: {
        id: String(viteEnv.VITE_GLOB_APP_ID),
        name: String(viteEnv.VITE_GLOB_APP_TITLE),
        version: pkg.version,
    },
    build: {
        environment: environmentName,
        environmentLabel: environment.label,
        target: 'h5',
        mode: environment.mode,
        branch: detectBuildBranch(),
        commitSha: firstNonEmpty(
            process.env.CI_COMMIT_SHA,
            process.env.GIT_COMMIT,
            readGitValue(['rev-parse', 'HEAD']),
        ),
        dirty: Boolean(readGitValue(['status', '--porcelain'])),
        builtAt: formatChinaTimestamp(),
        pipelineId: firstNonEmpty(
            process.env.CI_PIPELINE_ID,
            process.env.BUILD_NUMBER,
            process.env.BUILD_ID,
        ),
    },
    runtime: {
        publicPath: String(viteEnv.VITE_PUBLIC_PATH),
        apiBaseUrl: String(viteEnv.VITE_GLOB_API_URL),
        apiPrefix: String(viteEnv.VITE_GLOB_API_URL_PREFIX),
        uploadUrl: String(viteEnv.VITE_GLOB_UPLOAD_URL),
        appMode: String(viteEnv.VITE_APP_MODE),
        mbaseOrigin: String(viteEnv.VITE_MBASE_ORIGIN || ''),
    },
});

const createBuildIdentityPlugin = (identity: ReturnType<typeof createBuildIdentity>): Plugin => ({
    name: 'robot-h5:build-identity',
    apply: 'build',
    generateBundle() {
        this.emitFile({
            type: 'asset',
            fileName: 'env.json',
            source: `${JSON.stringify(identity, null, 2)}\n`,
        });
    },
});

const validateBuildLock = (
    command: string,
    mode: string,
    environmentName: string,
): void => {
    if (command !== 'build') return;
    if (process.env.ROBOT_H5_BUILD_ENTRY !== '1') {
        throw new Error('禁止绕过统一构建入口，请执行 pnpm build:h5 或兼容的 build:* 命令。');
    }
    if (
        process.env.ROBOT_H5_BUILD_ENVIRONMENT !== environmentName ||
        process.env.ROBOT_H5_BUILD_MODE !== mode
    ) {
        throw new Error(
            `构建环境锁冲突：入口为 ${process.env.ROBOT_H5_BUILD_ENVIRONMENT}/${process.env.ROBOT_H5_BUILD_MODE}，Vite 为 ${environmentName}/${mode}`,
        );
    }
};

const validateBaseEnvironment = (environmentName: string, viteEnv: ViteEnv): void => {
    if (viteEnv.VITE_ENV !== environmentName) {
        throw new Error(`环境文件标识错误：期望 VITE_ENV=${environmentName}，实际为 ${viteEnv.VITE_ENV}`);
    }
    if (!viteEnv.VITE_GLOB_APP_ID || !viteEnv.VITE_GLOB_APP_TITLE) {
        throw new Error('环境配置缺少 VITE_GLOB_APP_ID 或 VITE_GLOB_APP_TITLE。');
    }
    const publicPath = String(viteEnv.VITE_PUBLIC_PATH || '');
    if (publicPath !== '/' && !publicPath.match(/^\/.+\/$/)) {
        throw new Error('VITE_PUBLIC_PATH 必须以 / 开头和结尾。');
    }
};

const validateIntegratedEnvironment = (environmentName: string, viteEnv: ViteEnv): void => {
    if (!['sit', 'uat', 'pre', 'production'].includes(environmentName)) return;
    if (viteEnv.VITE_APP_MODE !== 'integrated' || viteEnv.VITE_USE_MOCK) {
        throw new Error(`${environmentName} 必须使用 integrated 模式并关闭 Mock。`);
    }
    const portalOrigin = new URL(String(viteEnv.VITE_MBASE_ORIGIN || ''));
    const apiUrl = new URL(String(viteEnv.VITE_GLOB_API_URL || ''));
    if (portalOrigin.origin !== viteEnv.VITE_MBASE_ORIGIN || portalOrigin.protocol !== 'https:') {
        throw new Error('VITE_MBASE_ORIGIN 必须是无路径的完整 HTTPS Origin。');
    }
    if (apiUrl.protocol !== 'https:') {
        throw new Error('线上环境 VITE_GLOB_API_URL 必须使用 HTTPS。');
    }
};

const validateBuildConfiguration = (
    command: string,
    mode: string,
    environmentName: string,
    viteEnv: ViteEnv,
): void => {
    if (command !== 'build') return;
    validateBuildLock(command, mode, environmentName);
    validateBaseEnvironment(environmentName, viteEnv);
    validateIntegratedEnvironment(environmentName, viteEnv);
};

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

    const environmentEntry = Object.entries(buildEnvironmentDocument.environments).find(
        ([, environment]) => environment.mode === mode,
    );
    if (!environmentEntry) {
        throw new Error(`未注册的 Vite mode：${mode}`);
    }
    const [environmentName, environment] = environmentEntry;
    validateBuildConfiguration(command, mode, environmentName, viteEnv);
    const buildIdentity = createBuildIdentity(environmentName, environment, viteEnv);

    const { VITE_PUBLIC_PATH, VITE_PORT } = viteEnv;

    return {
        base: VITE_PUBLIC_PATH,
        root,
        plugins: [...createVitePlugins(viteEnv, isBuild), createBuildIdentityPlugin(buildIdentity)],
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
                    // @ts-expect-error Vite 的 Sass 类型尚未包含 modern-compiler API
                    api: 'modern-compiler',
                    silenceDeprecations: ['import'],
                    // 只注入设计系统变量；禁止使用 @layer 包裹组件样式。
                    // 老旧 Android WebView 不识别 @layer 时会丢弃整个规则块。
                    additionalData: (content: string, id: string) => {
                        // src/styles/ 本身就是样式模块树，不注入 @use 以避免循环依赖
                        if (id.includes('/src/styles/')) {
                            return content;
                        }
                        const use = '@use "@/styles/index.scss" as *;\n';
                        return `${use}${content}`;
                    },
                },
            },
            postcss: {
                plugins: [
                    postcssLegacyFallbacks(),
                    autoprefixer({
                        overrideBrowserslist: ['Chrome >= 69', 'Android >= 7', 'Safari >= 12', 'Edge >= 79'],
                    }),
                    postcssPxToViewProtConfig(),
                ],
            },
        },
        server: {
            host: true,
            open: true,
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
                // ── 核心运行时依赖（不预声明会导致首次导航触发 reload）──
                '@vueuse/core',
                '@miracle-web/utils',
                'pinia-plugin-persistedstate',
                'nprogress',
                'mitt',
                'disable-devtool',
                '@vant/touch-emulator',
                // ── Iconify 运行时 + 实际使用的图标集 ──
                '@iconify/vue',
                '@iconify-json/ph/icons.json',
                '@iconify-json/ic/icons.json',
                // ── ECharts（避免首次访问 chart 页 reload）──
                'echarts/core',
                'echarts/charts',
                'echarts/components',
                'echarts/renderers',
                // ── Vant 组件样式 ──
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
                'vant/es/swipe-cell/style/index',
                'vant/es/image-preview/style/index',
                'vant/es/tab/style/index',
                'vant/es/tabs/style/index',
            ],
        },
    };
});
