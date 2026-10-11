import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const directory = new URL('../dist/static/', import.meta.url);
const javascript = await readdir(new URL('js/', directory));
const entries = await Promise.all(javascript.filter(file => /^index-.*\.js$/.test(file)).map(async file => ({ file, data: await readFile(new URL(`js/${file}`, directory)) })));
const entry = entries.sort((a, b) => b.data.length - a.data.length)[0];
assert.ok(entry, '缺少入口脚本');
assert.ok(entry.data.length < 512000, `入口 JS 超出 500 KiB：${entry.data.length}`);
assert.ok(gzipSync(entry.data).length < 163840, '入口 gzip 超出 160 KiB');
const files = await readdir(new URL('css/', directory));
const styles = await Promise.all(files.map(file => readFile(new URL(`css/${file}`, directory), 'utf8')));
assert.equal(styles.filter(css => css.includes('--ds-bg:')).length, 1, '全局主题必须只输出一次');
assert.ok(styles.every(css => !css.includes(':deep(')), '外置样式不能残留 :deep');
assert.ok(styles.every(css => !/@layer\b/.test(css)), 'PDA 样式不能输出 @layer');
console.log(`资源检查通过：入口 ${(entry.data.length / 1024).toFixed(1)} KiB，gzip ${(gzipSync(entry.data).length / 1024).toFixed(1)} KiB，全局主题一份`);
