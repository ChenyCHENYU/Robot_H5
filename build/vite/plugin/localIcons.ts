import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

/** 只把源码和额外白名单使用的图标放入运行时，仍支持离线和动态菜单。 */
export function localIconsPlugin(): Plugin {
    const id = 'virtual:robot-icons';
    const resolvedId = `\0${id}`;
    const root = process.cwd();
    function collect(): string {
        const names = new Set(['ph:question-bold', 'ph:robot-bold']);
        function walk(directory: string) {
            for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
                const file = path.join(directory, entry.name);
                if (entry.isDirectory()) walk(file);
                else if (/\.(vue|ts|json)$/.test(file)) {
                    for (const match of fs.readFileSync(file, 'utf8').matchAll(/(?:i-)?(ph|ic):([a-z0-9-]+)/g)) names.add(`${match[1]}:${match[2]}`);
                }
            }
        }
        walk(path.join(root, 'src'));
        walk(path.join(root, 'mock'));
        const collections = ['ph', 'ic'].map(prefix => {
            const source = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', '@iconify-json', prefix, 'icons.json'), 'utf8'));
            const icons: Record<string, unknown> = {};
            for (const name of names) {
                if (!name.startsWith(`${prefix}:`)) continue;
                const key = name.slice(prefix.length + 1);
                if (source.icons[key]) icons[key] = source.icons[key];
                else throw new Error(`本地图标不存在：${name}`);
            }
            return { prefix, width: source.width, height: source.height, icons };
        });
        return `export default ${JSON.stringify(collections)}`;
    }
    return {
        name: 'robot-h5:local-icons',
        resolveId(source) { if (source === id) return resolvedId; },
        load(source) { if (source === resolvedId) return collect(); },
        handleHotUpdate({ server, file }) {
            if (!/\.(vue|ts|json)$/.test(file) || !/\/(src|mock)\//.test(file)) return;
            const module = server.moduleGraph.getModuleById(resolvedId);
            if (module) server.moduleGraph.invalidateModule(module);
        },
    };
}
