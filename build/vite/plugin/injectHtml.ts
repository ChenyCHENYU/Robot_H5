/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type { Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { createHtmlPlugin } from 'vite-plugin-html';
export function configHtmlPlugin(env: ViteEnv): Plugin | Plugin[] {
    const plugins: Plugin[] = [];

    const { VITE_GLOB_APP_TITLE } = env;
    // 首屏无需额外请求图片；仍复用应用唯一的品牌资产。
    const shellLogo = readFileSync(new URL('../../../public/logo.svg', import.meta.url), 'utf8')
        .replace('<svg ', '<svg class="shell-logo" ')
        .replace(/robot-/g, 'shell-robot-')
        .replace('id="title"', 'id="shell-logo-title"')
        .replace('aria-labelledby="title"', 'aria-labelledby="shell-logo-title"');

    const htmlPlugin = createHtmlPlugin({
        minify: true,
        inject: {
            data: {
                title: VITE_GLOB_APP_TITLE,
                shellLogo,
            },
        },
    }) as Plugin[];

    if (htmlPlugin) {
        plugins.push(...htmlPlugin);
    }

    return plugins;
}
